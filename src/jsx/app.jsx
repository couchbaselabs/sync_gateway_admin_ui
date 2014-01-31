/**
 * @jsx React.DOM
 */
 /* global Davis */
 /* global Zepto */

var PageWrap = require("./page.jsx"),
  channels = require("./channels.jsx"),
  ChannelsWatchPage = channels.ChannelsWatchPage,
  ChannelInfoPage = channels.ChannelInfoPage,
  SyncPage = require("./sync.jsx").SyncPage,
  UsersPage = require("./users.jsx"),
  AllDatabases = require("./databases.jsx"),
  documents = require("./documents.jsx"),
  DocumentsPage = documents.DocumentsPage;

Davis.$ = Zepto;

exports.start = function() {
  console.info("binding routes")
  Davis(function() {
    this.settings.generateRequestOnPageLoad = true;
    this.settings.handleRouteNotFound = true;

    // global handlers
    this.bind("routeNotFound", routeNotFound)
    this.bind("lookupRoute", lookupRoute)

    // Bind controllers to URL paths
    //
    // If you find yourself making big changes here
    // (like adding something more than /db/:db)
    // think about moving to a full page JSX router
    // like Chris describes in a comment here
    // http://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html
    this.scope("/_admin", function() {
      this.get('/', drawIndexPage)
      this.get('/db/:db', drawDocsPage)
      this.get('/db/:db/documents/:id', drawDocsPage)
      this.get('/db/:db/sync', drawSyncPage)
      this.get('/db/:db/channels', drawChannelWatchPage)
      this.get('/db/:db/channels/:id', drawChannelInfoPage)
      this.get('/db/:db/users', drawUserPage)
      this.get('/db/:db/users/:id', drawUserPage)
      // todo this.get('/db/:db/users/:id/channels', userChannelsPage)
    })
  });
}

function draw(component, container) {
  React.renderComponent(
    component,
    container || document.getElementById('container')
  );
}

/*  /_admin/
    The home page, list and create databases.
*/
function drawIndexPage(req) {
    draw(
      <PageWrap page="home">
        <p>Welcome to Couchbase Sync Gateway. You are connected to the admin
        port at <a href={location.toString()}>{location.toString()}</a></p>
        <AllDatabases title="Please select a database:"/>
        <p>Documentation for <a href="http://docs.couchbase.com/sync-gateway/">the Sync Gateway is here.</a> Visit the developer portal for <a href="http://mobile.couchbase.com">downloads, examples, cloud signup, and more documentation.</a>
        </p>
      </PageWrap>)
  }

/*  /_admin/db/myDatabase
    /_admin/db/myDatabase/documents/myDocID
    The index page for myDatabase, list and edit documents.
*/
function drawDocsPage(req) {
  draw(
    <PageWrap db={req.params.db} page="documents">
      <DocumentsPage db={req.params.db} docID={req.params.id}/>
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
