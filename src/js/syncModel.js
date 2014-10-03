/*
  SyncModel creates an in-memory representation of documents flowing
  through channels. It also mediates any server access so that UI
  components are abtracted from network interactions and the API is
  mostly synchronous queries from the UI triggered by SyncModel events.
*/

/* jshint -W061 */
/* global syncFun */
/* global compiledFunction */

var events = require('events'),
  coax = require("coax"),
  util = require("util");

var dbStateSingletons = {};
exports.SyncModelForDatabase = function(dbURL) {
  var state = dbStateSingletons[dbURL]
  if (!state) {
    state = new SyncModel(dbURL)
    state.setMaxListeners(100)
    dbStateSingletons[dbURL] = state
  }
  return state
}

exports.allDBs = function(host, cb){
  coax([host, "_all_dbs"], cb);
}

exports.createDB = function(host, db, config, cb){
  coax.put([host, db, ""], config, cb);
}

function SyncModel(db) {
  // setup on / emit / etc
  events.EventEmitter.call(this);

  // private state
  var previewFun, self=this, client = coax(db),
    dbConfig = {}, previewChannels = {}, previewDocs = {};

  // public state
  this.db = db;
  this.client = client;
  this.workingSet = 1000
  this.pageSize = 10
  // pubic methods
  this.setSyncFunction = function(funCode) {
    var oldCode = previewFun && previewFun.code
    if (funCode == oldCode) {
      return;
    }
    previewChannels = {};
    previewDocs = {};
    totalChanges = 0
    previewFun = compileSyncFunction(funCode)
    previewFun.code = funCode
    loadChangesHistory()
    if (this.deployedSyncFunction() == funCode) {
      this.emit("syncReset", "deployed")
    } else {
      this.emit("syncReset", "preview")
    }
  }
  this.getSyncFunction = function() {
    return previewFun.code;
  }
  this.channelNames = function() {
    return Object.keys(previewChannels);
  }
  this.deployedSyncFunction = function(){
    return dbConfig.sync || "function(doc){\n  channel(doc.channels)\n}";
  }

  this.deploySyncFunction = function(code, done) {
    var newConfig = {}
    for (var k in dbConfig) {
      if (dbConfig[k]) {
        newConfig[k] = dbConfig[k]
      }
    }
    newConfig.sync = code;
    client.del([""]/*[""] to force trailing slash*/,function(err){
      if (err && err.constructor !== SyntaxError) {
        return done(err);
      }
      client.put([""]/*[""] to force trailing slash*/,newConfig, function(err, ok){
        if (err && err.constructor !== SyntaxError) {
          return done(err);
        }
        self.setSyncFunction(code)
        done(false, ok)
      })
    })
  }
  this.channel = function(name) {
    var changes = [], revs ={}, chan = previewChannels[name];
    if (!chan) return {name:name, changes:[]};
    var docs = chan.docs;

    for (var id in docs) revs[docs[id]] = id
    var rs = Object.keys(revs).sort(function(a, b){
      return parseInt(a, 10) - parseInt(b, 10);
    })
    for (var i = rs.length - 1; i >= 0; i--) {
      var docid = revs[rs[i]]
      changes.push({id:docid, seq:parseInt(rs[i], 10), isAccess : chan.access[docid]})
    }
    var result = {
      name : name,
      changes : changes
    }
    var accessIds = Object.keys(chan.access);
    if (accessIds.length) {
      result.access = chan.access
      result.hiddenAccessIds = [];
      for (i = accessIds.length - 1; i >= 0; i--) {
        if (!docs[accessIds[i]]) {
          result.hiddenAccessIds.push(accessIds[i])
        }
      }
    }
    return result
  }
  this.randomAccessDocID = function() {
    var chs = this.channelNames()
    chs = shuffleArray(chs);
    var ch = chs.pop();
    while (ch) {
      var chInfo = this.channel(ch)
      if (chInfo.access) {
        var ids = Object.keys(chInfo.access)
        return ids[Math.floor(Math.random()*ids.length)]
      }
      ch = chs.pop()
    }
  }
  this.randomDocID = function(){
    var chs = this.channelNames()
    var ch = chs[Math.floor(Math.random()*chs.length)]
    var chInfo = this.channel(ch);
    var rIds = chInfo.changes.map(function(c){return c.id})
    return rIds[Math.floor(Math.random()*rIds.length)]
  }
  this.getDoc = function(id, cb){
    client.get(["_raw", id], function(err, raw) {
      if (err) {return cb(err);}
      var deployed = raw._sync;
      delete raw._sync;
      raw._rev = deployed.rev;
      raw._id = id;
      var previewSet = {}
      var preview = runSyncFunction(previewSet, id, raw, 0)
      cb(err, raw, transformDeployed(id, deployed), transformPreview(id, preview))
    });
  }
  this.saveDoc = function(doc, cb) {
    client.put(doc._id, doc, cb)
  }
  this.allDocs = function(cb) {
    client.get("_all_docs", function(err, data) {
      var rows = data.rows.map(function(r){
        return {id : r.id, access : previewDocs[r.id]}
      })
      cb(err, rows)
    })
  }
  this.allUsers = function(cb) {
    client.get(["_view", "principals", {state:false}], cb);
  }
  this.userInfo = function(id, cb) {
    client.get(["_user", id], cb)
  }

  // private implementation
  function transformDeployed(id, deployed){
    var access = {};
    for (var user in deployed.access) {
      var chans = Object.keys(deployed.access[user])
      for (var i = chans.length - 1; i >= 0; i--) {
        var ch = chans[i]
        access[ch] = access[ch] || []
        access[ch].push(user)
        access[ch] = access[ch].sort()
      }
    }
    return {
      access : access,
      channels : deployed.channels ? Object.keys(deployed.channels) : []
    }
  }

  function transformPreview(id, preview) {
    // console.log("preview", preview)
    var channelSet = {}
    preview.access.forEach(function(acc) {
      acc.channels.forEach(function(ch) {
        channelSet[ch] = channelSet[ch] || [];
        channelSet[ch] =
          mergeUsers(channelSet[ch], acc.users);
      })
    })
    // console.log("preview.access", channelSet)
    return {
      access : channelSet,
      channels : preview.channels,
      reject : preview.reject
    };
  }

  function runSyncFunction(channelSet, id, doc, seq) {
    // console.log('previewFun', doc)
    doc._id = id
    var sync = previewFun(doc, false, null)
    // console.log('previewFun', doc._id, doc, sync)
    if (sync.reject) {
      console.error("update rejected by sync function", doc, sync)
      return;
    }
    var changed = {};
    previewDocs[id] = false;
    sync.channels.forEach(function(ch) {
      channelSet[ch] = channelSet[ch] || {docs : {}, access:{}};
      channelSet[ch].docs[id] = seq;
      changed[ch]=true;
    })
    sync.access.forEach(function(acc) {
      previewDocs[id] = true;
      acc.channels.forEach(function(ch){
        changed[ch]=true;
        channelSet[ch] = channelSet[ch] || {docs : {}, access:{}};
        channelSet[ch].access[id] =
          mergeUsers(channelSet[ch].access[id], acc.users);
      })
    })
    sync.changed = changed;
    return sync;
  }

  function mergeUsers(existing, more) {
    var keys = {};
    existing = existing || [];
    for (var i = existing.length - 1; i >= 0; i--) {
      keys[existing[i]] = true;
    }
    for (i = more.length - 1; i >= 0; i--) {
      keys[more[i]] = true;
    }
    return Object.keys(keys).sort()
  }

  // function disconnect() {
  //   if (changesRequest) {
  //     changesRequest.abort();
  //   }
  // }
  this.shutdown = function() {
    if (changesRequest) {
      changesRequest.destroy();
    }
  }

  var changesRequest;
  var oldBefore;
  function moreHistory(before) {
    // console.log("totalChanges", totalChanges, self.workingSet)
    if (oldBefore !== before && totalChanges < self.workingSet) {
      oldBefore = before;
      client.get(["_changes", {since : before, include_docs : true,
        limit : self.pageSize}], function(err, data) {
        // console.log("history", data)
        data.results.forEach(onChange)
        self.emit("batch")
        moreHistory(data.last_seq)
      })
    }
  }

  function loadChangesHistory(){
    // get first page
    // console.log("loadChangesHistory")
    client.get(["_changes", {limit : self.pageSize, include_docs : true}], function(err, data) {
      // console.log("history once", data)
      data.results.forEach(onChange)
      self.emit("batch")
      moreHistory(data.last_seq)

      changesRequest = client.changes({since : data.last_seq, include_docs : true}, function(err, data){
        // console.log("change", err, data);
        if (!err)
        onChange(data)
      })
    })
  }

  self.once("batch", function() {
    self.connected = true;
    self.emit("connected")
  })
  self.on("newListener", function(name, fun){
    if (name == "connected" && self.connected) {
      fun()
    }
  })

  var totalChanges = 0
  function onChangeWDoc(ch, doc) {
    // console.log("onChangeWDoc", ch, doc)
    var seq;
    if ("number" !== typeof ch.seq) {
      seq = parseInt(ch.seq.split(":")[1], 10)
    } else {
      seq = ch.seq
    }
    
    ch.doc = doc
    totalChanges++;
    var sync = runSyncFunction(previewChannels, ch.id, ch.doc, seq)
    self.emit("change", ch)
    Object.keys(sync.changed).forEach(function(channel) {
      self.emit("ch:"+channel);
    })
  }

  function onChange(ch) {
    if (ch.doc) {
      onChangeWDoc(ch, ch.doc)
    }  else if (ch.id == "_user/") {
      // ignore, this is an access control change sequence not a data sequence
    } else {
      console.log("doc async", ch.id)
      // return;
      client.get(ch.id, function(err, doc) {
        if (err) {
          console.error("doc missing", ch.id)
        } else {
          onChangeWDoc(ch, doc)
        }
      })
    }

  }

  client.get("_config", function(err, config) {
    if (err) throw(err);
    dbConfig = config;
    self.setSyncFunction(config.sync || "function(doc){\n  channel(doc.channels)\n}");
  })
}

util.inherits(SyncModel, events.EventEmitter);

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var syncWrapper = function(newDoc, oldDoc, realUserCtx) {
  "syncCodeStringHere";

  function makeArray(maybeArray) {
    if (Array.isArray(maybeArray)) {
      return maybeArray;
    } else {
      return [maybeArray];
    }
  }

  function inArray(string, array) {
    return array.indexOf(string) != -1;
  }

  function anyInArray(any, array) {
    for (var i = 0; i < any.length; ++i) {
      if (inArray(any[i], array))
        return true;
    }
    return false;
  }

  // Proxy userCtx that allows queries but not direct access to user/roles:
  var shouldValidate = (realUserCtx !== null && realUserCtx.name !== null);

  function requireUser(names) {
      if (!shouldValidate) return;
      names = makeArray(names);
      if (!inArray(realUserCtx.name, names))
        throw({forbidden: "wrong user"});
  }

  function requireRole(roles) {
      if (!shouldValidate) return;
      roles = makeArray(roles);
      if (!anyInArray(realUserCtx.roles, roles))
        throw({forbidden: "missing role"});
  }

  function requireAccess(channels) {
      if (!shouldValidate) return;
      channels = makeArray(channels);
      if (!anyInArray(realUserCtx.channels, channels))
        throw({forbidden: "missing channel access"});
  }
  var results = {
    channels : [],
    access : [],
    roles : [],
    reject : false
  };
  function channel(){
    var args = Array.prototype.slice.apply(arguments);
    results.channels = Array.prototype.concat.apply(results.channels, args);
  }
  function access(users, channels){
    results.access.push({
      users : makeArray(users),
      channels : makeArray(channels)
    })
  }
  function role(users, channels){
    results.roles.push({
      users : makeArray(users),
      channels : makeArray(channels)
    })
  }

  function reject(code, message) {
    results.reject = [code, message];
  }
  try {
    // console.log("syncFun", newDoc)
    syncFun(newDoc, oldDoc);
  } catch(x) {
    if (x.forbidden)
      reject(403, x.forbidden);
    else if (x.unauthorized)
      reject(401, x.unauthorized);
    else
      throw(x);
  }
  return results;
}.toString();

function compileSyncFunction(syncCode) {
  var codeString = "var syncFun = ("+ syncCode+")",
    wrappedCode = syncWrapper.replace('"syncCodeStringHere"', codeString),
    evalString = "var compiledFunction = ("+ wrappedCode+")";
    // console.log("eval", evalString)
  eval(evalString);
  return compiledFunction;
}
