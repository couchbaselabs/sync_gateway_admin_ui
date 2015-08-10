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
  React = require("react"),
  Router = require('react-router'),
  Route = Router.Route, DefaultRoute = Router.DefaultRoute, RouteHandler = Router.RouteHandler;


var IndexPage = React.createClass({
  render : function(){
    return (
      <div>
        <p>Welcome to Couchbase Sync Gateway. You are connected to the admin
        port at <a href={location.toString()}>{location.toString()}</a></p>
        <p>Documentation for <a href="http://docs.couchbase.com/sync-gateway/">the Sync Gateway is here.</a> Visit the developer portal for <a href="http://developer.couchbase.com/mobile/">downloads and examples.</a>
        </p>
        <RouteHandler/>
      </div>
      );
  }
})

var Wrap = React.createClass({
  render () {
    return (
      <div>
        <h1>App</h1>
        <RouteHandler/>
      </div>
    )
  }
});

var SelectDB = React.createClass({
  render() {
    return (
      <AllDatabases title="Please select a database:"/>
      )
  }
})

var AboutDB = React.createClass({
  render() {
    return (
      <p>About DB</p>
      )
  }
})


exports.start = function() {
  console.info("binding routes")

  var routes = (
    <Route handler={Wrap}>
      <Route path="/_admin/" handler={IndexPage}>
        <DefaultRoute handler={SelectDB}/>
        <Route path="db/:db" handler={AboutDB}/>

      </Route>
    </Route>
    );

  Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(<Root/>, document.getElementById('container'));
  });
}
//         
// <Route path="db/:db" handler={DbWrap}>
//   <Route path="documents/:id" handler={DocumentsPage}/>
//   <Route path="sync" handler={SyncPage}/>
//   <Route path="channels" handler={ChannelsWatchPage}/>
//   <Route path="channels/:id" handler={ChannelInfoPage}/>
//   <Route path="users" handler={UsersPage}/>
//   <Route path="users/:id" handler={UsersPage}/>
// </Route>

