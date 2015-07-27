/**
 * @jsx React.DOM
 */
 /* global Zepto */

var PageWrap = require("./page.jsx"),
  channels = require("./channels.jsx"),
  ChannelsWatchPage = channels.ChannelsWatchPage,
  ChannelInfoPage = channels.ChannelInfoPage,
  SyncPage = require("./sync.jsx").SyncPage,
  UsersPage = require("./users.jsx"),
  AllDatabases = require("./databases.jsx"),
  documents = require("./documents.jsx"),
  DocumentsPage = documents.DocumentsPage,
  Router = require('react-router'),
  Route = Router.Route;


var IndexPage = React.createClass({
  render : function(){
    return (
      <div>
        <p>Welcome to Couchbase Sync Gateway. You are connected to the admin
        port at <a href={location.toString()}>{location.toString()}</a></p>
        <AllDatabases title="Please select a database:"/>
        <p>Documentation for <a href="http://docs.couchbase.com/sync-gateway/">the Sync Gateway is here.</a> Visit the developer portal for <a href="http://developer.couchbase.com/mobile/">downloads and examples.</a>
        </p>
      </div>
      );
  }
})

var DbWrap = PageWrap;


exports.start = function() {
  console.info("binding routes")

  var routes = (
    <Route path="_admin" handler={PageWrap}>
      <Route path="/" handler={IndexPage}/>
      <Route path="db/:db" handler={DbWrap}>
        <Route path="documents/:id" handler={DocumentsPage}/>
        <Route path="sync" handler={SyncPage}/>
        <Route path="channels" handler={ChannelsWatchPage}/>
        <Route path="channels/:id" handler={ChannelInfoPage}/>
        <Route path="users" handler={UsersPage}/>
        <Route path="users/:id" handler={UsersPage}/>
      </Route>
    </Route>
    );

  Router.run(routes, Router.HashLocation, (Root) => {
    console.log("run", Root)
    React.render(<Root/>, document.getElementById('container'));
  });
}

function draw(component, container) {
  React.render(
    component,
    container || document.getElementById('container')
  );
}


/*  /_admin/db/myDatabase
    /_admin/db/myDatabase/documents/myDocID
    The index page for myDatabase, list and edit documents.
*/
function drawDocsPage(req) {
  draw(
    <PageWrap db={req.params.db} page="documents">
     
    </PageWrap>);
}

/*  /_admin/db/myDatabase/sync
    Sync function editor for myDatabase
*/
function drawSyncPage(req) {
  draw(
    <PageWrap db={req.params.db} page="sync">
      <SyncPage db={req.params.db}/>
    </PageWrap>);
}

/*  /_admin/db/myDatabase/channels
    Channel watcher page for myDatabase
*/
function drawChannelWatchPage (req) {
  var watch = (req.params.watch && req.params.watch.split(',') || []);
  draw(
    <PageWrap db={req.params.db} page="channels">
        <ChannelsWatchPage db={req.params.db} watch={watch} title={req.params.title}/>
    </PageWrap>);
}

/*
    /_admin/db/myDatabase/channels/myChannel
    Channel detail page
*/
function drawChannelInfoPage(req) {
  draw(
    <PageWrap db={req.params.db} page="channels">
      <ChannelInfoPage db={req.params.db} id={req.params.id}/>
    </PageWrap>);
}


/*  /_admin/db/myDatabase/users
    /_admin/db/myDatabase/users/userID
    List and edit users.
*/
function drawUserPage(req) {
  draw(
    <PageWrap page="users" db={req.params.db}>
      <UsersPage db={req.params.db} userID={req.params.id}/>
    </PageWrap>);
}

/*  404 handlers
    If the 404 is in-app, redirect to the index page.
    Otherwise make a server request for the new page.
*/
function routeNotFound(r) {
  setTimeout(function(){ // required sleep
    window.location = "/_admin/"
  },100)
}
function lookupRoute(req) {
  if (req.path.indexOf("/_admin") !== 0) {
    window.location = req.path;
    req.delegateToServer()
  }
}
