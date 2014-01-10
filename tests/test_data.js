/*jshint unused:true */

var //hostname = "http://localhost:4985/",
  SyncModel = require("../src/js/syncModel"),
  // coax = require("coax"),
  test = require("tap").test;


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

// exports["with database"] = {
//   setUp : function(done) {
//     this.dbName = 'test-'+Math.random().toString().substr(2)
//     this.dbClient = coax(hostname + this.dbName)
//     SyncModel.createDB(hostname, this.dbName, {server : "walrus://"}, function() {
//       this.dbState = SyncModel.SyncModelForDatabase(hostname + this.dbName)
//       done()
//     }.bind(this))
//   },
//   tearDown : function(done) {
//     this.dbState.shutdown()
//     done()
//   },
//   "created in-memory test database" : function(t) {
//     this.dbClient(function(err, info) {
//       t.ok(!err, "created database "+JSON.stringify(err))
//       t.equal(info.db_name, this.dbName)
//       t.equal(info.doc_count, 0)
//       t.done()
//     }.bind(this))
//   },
//   "with documents" : {
//     setUp : function(done) {
//       this.dbClient.post("_bulk_docs", {
//         docs : [{
//           _id : "ace",
//           channels : ["xylophone", "yakima", "zoo"]
//         }, {
//           _id : "booth",
//           channels : ["yakima", "zoo"]
//         }, {
//           _id : "cat",
//           channels : ["claws"],
//           grant : {
//             user : "kitty",
//             channels : ["claws", "xylophone"]
//           }
//         }]
//       }, function(){
//         // assert.ok(!err, "posted docs")
//         // assert.equal(ok.length, 3, "all saved")
//         done()
//       })
//     },
//     "docs saved" : function(t) {
//       this.dbClient(function(err, info) {
//         t.equal(info.doc_count, 3)
//         t.done()
//       }.bind(this))
//     },
//     "can get document sync info" : function(t) {
//       // debugger;
//       this.dbState.getDoc("ace", function(err, doc, deployed, preview) {
//         t.equal(doc._id, "ace")
//         t.deepEqual(deployed.channels, doc.channels)
//         t.deepEqual(preview.channels, doc.channels)
//         console.log("got doc done");
//         t.done()
//       })
//     },
//     "calculates channel membership" : function(t){
//       console.log("laste test");
//       t.ok(true)
//       t.done()
//       // console.log("befre conected");
//       // this.dbState.on("connected", function() {
//       //   var chan = this.dbState.channel("yakima")
//       //   console.log("conected", chan);
//       //   t.ok(chan.changes, "has changes")
//       //   t.equal(chan.changes[0].id, "booth")
//       //   t.equal(chan.changes[1].id, "ace")
//       //   // var names = dbState.channelNames();
//       //   // console.log("names", names)
//       //   // assert.equal(names.length, 4, '"xylophone", "yakima", "zoo", "claws"')
//       //   t.done()
//       // }.bind(this))
//     }
//   }
// }

// // function runPreview() {
// //   var next = getNext(arguments);
// //   console.log("runPreview")

// // }

// // function testAccess() {
// //   var next = getNext(arguments);
// //   console.log("testAccess")
// //   var chan = dbState.channel("xylophone")
// //   assert.ok(!chan.access, "no access yet")
// //   next();
// // };

// // function testUpdateSyncCode(){
// //   var next = getNext(arguments);
// //   console.log("testUpdateSyncCode")
// //   dbState.setSyncFunction("function(doc){ channel(doc.channels); if (doc.grant) {access(doc.grant.user, doc.grant.channels)} }")
// //   dbState.once("batch", function(){
// //     var chan = dbState.channel("xylophone")
// //     assert.ok(chan.access, "access")
// //     next();
// //   })
// // }

// // function testRandomDoc() {
// //   var next = getNext(arguments);
// //   console.log("testRandomDoc")
// //   var docid = dbState.randomDocID();
// //   assert.ok(["ace", "booth", "cat"].indexOf(docid) !== -1, "testRandomDoc")
// //   next()
// // }

// // function testRandomAccessDoc() {
// //   var next = getNext(arguments);
// //   var docid = dbState.randomAccessDocID();
// //   console.log("testRandomAccessDoc")
// //   assert.equal(docid, "cat", "testRandomAccessDoc")
// //   next()
// // }


// // function testGetDoc() {
// //   var next = getNext(arguments);
// //   var docid = dbState.randomAccessDocID();
// //   console.log("testGetDoc")
// //   dbState.getDoc(docid, function(doc, deployedSync, previewSync) {
// //     assert.equal(JSON.stringify(deployedSync.channels), JSON.stringify(previewSync.channels))
// //     assert.notEqual(JSON.stringify(deployedSync.access), JSON.stringify(previewSync.access), "previewing sync function with access calls, over deployed bucket without")
// //     next()
// //   })
// // }

// // function testDeploySyncCode(){
// //   var next = getNext(arguments);
// //   var newCode = "function(doc){ channel(doc.channels); if (doc.grant) {access(doc.grant.user, doc.grant.channels)} }"
// //   console.log("testDeploySyncCode")
// //   dbState.deploySyncFunction(newCode, function(err){
// //     assert.ok(!err)
// //     dbState.client.get("_info", function(err, info){
// //       assert.equal(info.config.sync, newCode)
// //       next();
// //     })
// //   })
// // }


// // function newChangesShowUp(){
// //   var next = getNext(arguments);
// //   console.log("newChangesShowUp")
// //   next()
// // }


// // setUp(initData, runPreview, testAccess, testUpdateSyncCode, testRandomDoc, testRandomAccessDoc, testGetDoc, testDeploySyncCode, newChangesShowUp)


