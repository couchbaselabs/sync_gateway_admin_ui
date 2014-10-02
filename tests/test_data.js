/*jxshint unused:true */


var hostname = "http://localhost:4985/",
  SyncModel = require("../src/js/syncModel"),
  http = require("http"),
  client = require("../src/js/json-client"),
  test = require("tape").test

  // test = tap.t;

http.globalAgent.maxSockets = 100;

// var SyncModel = {
//   createDB : function(x,y,z,cb){cb()},
//   SyncModelForDatabase : function(){
//     return {
//       shutdown : function(){},
//     }
//   }
// }

test("sync model is reachable", function(t) {
  t.ok(SyncModel, "SyncModel required")
  t.ok(SyncModel.SyncModelForDatabase, "SyncModelForDatabase API exists")
  t.end()
})

var dbState,
  dbName = 'test-'+Math.random().toString().substr(2),
  dbURL = hostname + dbName;

test("with database", function(t) {
  console.log("create database", dbName)
  SyncModel.createDB(hostname, dbName, {server : "walrus://"}, function() {
    dbState = SyncModel.SyncModelForDatabase(hostname + dbName)
    dbState.on("batch", function(){
      console.log("batch")
    })
    client(dbURL, function(err, r, info) {
      t.ok(!err, "created database "+JSON.stringify(err))
      t.equal(info.db_name, dbName, "dbName")
      t.test("create documents", function(t){
        client.post({uri: dbURL+"/_bulk_docs", body : {
          docs : [{
            _id : "ace",
            channels : ["xylophone", "yakima", "zoo"]
          }, {
            _id : "booth",
            channels : ["yakima", "zoo"]
          }, {
            _id : "cat",
            channels : ["claws"],
            grant : {
              user : "kitty",
              channels : ["claws", "xylophone"]
            }
          }]
        }}, function(err, r, ok){
          t.error(err, "posted docs")
          t.equal(ok.length, 3, "all saved")
          t.end()
        })
      })
      t.end()
    })
  })
})

test("get sync info", function(t){
  dbState.getDoc("ace", function(err, doc, deployed, preview) {
    t.equal(doc._id, "ace")
    t.deepEqual(deployed.channels, doc.channels)
    t.deepEqual(preview.channels, doc.channels)
    t.end()
  })
})

test("channel membership", function(t){
  dbState.on("change", function(ch) {
    var names = dbState.channelNames()
    var chan = dbState.channel("yakima")
    if (names.length < 4) {return console.log("wait", ch.id)}
    t.ok(chan.changes, "has changes")
    // console.log("chan", chan.changes)
    t.equal(chan.changes[0].id, "booth") // why do we get ace sometimes?
    console.log("names", names)
    t.deepEqual(names.sort(), ["claws","xylophone","yakima","zoo"])
    t.end()
  })
  client.put({uri:dbURL+"/space",body:{channels : []}}, function(err, r, ok) {
    t.error(err)
  })
})

test("channel access list", function(t) {
  var chan = dbState.channel("xylophone")
  // console.log("access",chan.access)
  t.equals(chan.access, undefined, "no access yet")
  t.end()
})

test("set simulated sync function", function(t) {
  dbState.setSyncFunction("function(doc){ channel(doc.channels); if (doc.grant) {access(doc.grant.user, doc.grant.channels)} }")
  dbState.once("batch", function(){
    var chan = dbState.channel("xylophone")
    t.ok(chan.access, "access")
    t.end();
  })
})

test("preview and deployed output are different", function(t){
  var docid = dbState.randomAccessDocID();
  dbState.getDoc(docid, function(err, doc, deployedSync, previewSync) {
    // console.log("preview", deployedSync, previewSync);
    t.ok(!err, "no error")
    t.ok(doc, "doc")
    t.ok(deployedSync, "deployedSync")
    t.ok(previewSync, "previewSync")
    t.equal(JSON.stringify(deployedSync.channels), JSON.stringify(previewSync.channels))
    t.notEqual(JSON.stringify(deployedSync.access), JSON.stringify(previewSync.access), "previewing sync function with access calls, over deployed bucket without")
    t.end()
  })
})

test("random doc", function(t){
  var docid = dbState.randomDocID();
  t.ok(["ace", "booth", "cat"].indexOf(docid) !== -1, "testRandomDoc id: "+ docid)
  t.end()
})

test("doc that has access impact", function(t) {
  var docid = dbState.randomAccessDocID();
  t.equal(docid, "cat", "testRandomAccessDoc")
  t.end()
})

test("deploy sync code", function(t) {
  var newCode = "function(doc){ channel(doc.channels); if (doc.grant) {access(doc.grant.user, doc.grant.channels)} }"
  setTimeout(function(){ // let the previous batch quiece
    dbState.on("batch", function(){
      t.error(true, "shouldn't call batch") // race condition
    })
    console.log("deploy sync code")
    dbState.deploySyncFunction(newCode, function(err){
      t.error(err, "deploySyncFunction")
      dbState.client.get("_config", function(err, config){
        t.error(err, "client.get")
        t.equal(config.sync, newCode)
        client.put({uri:dbURL+"/nonce",body:{channels : []}}, function(err, r, ok) {
          t.error(err, "did put")
          t.end()
        })
      })
    })
  },10)
})

test("this erased a memory bucket", function(t) {
  client.get(dbURL+"/ace", function(err, r, ace) {
    t.ok(err)
    t.end()
  })
})

// test("new changes show up", function(t) {
//   // t.plan(2) // fail
//   dbState.on("change", function(ch) {
//     t.equal(ch.id, "nice", "correct doc")
//     t.end()
//   })
//   client.put({uri:dbURL+"/nice",body:{channels : []}}, function(err, r, ok) {
//     t.error(err, "did put nice")
//     t.equal(ok.id, "nice", "created doc")
//   })
// setTimeout(function(){
//   t.end() // todo fix me
// },2)
// })

test("hack because change listener never hangs up", function(t){
  t.end()
  setTimeout(function(){
    process.exit()
  }, 2)
})

