/** @jsx React.DOM */

var helpers = require("./helpers.jsx"),
  dbPath = helpers.dbPath,
  dbState = helpers.dbState,
  docLink = helpers.docLink,
  userLink = helpers.userLink,
  StateForPropsMixin = helpers.StateForPropsMixin,
  EventListenerMixin = helpers.EventListenerMixin;

module.exports = React.createClass({
  render : function() {
    return (
      <div className="page">
        <div id="main">
          <div className="content">
            <NavBar db={this.props.db} page={this.props.page}/>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

var NavBar = React.createClass({
  mixins : [StateForPropsMixin, EventListenerMixin],
  getInitialState : function() {
    return {}
  },
  syncMode : function(newMode){
    this.setState({mode : newMode})
  },
  setStateForProps: function(props) {
    // console.log("setStateForProps NavBar", props)
    if (!props.db) return;
    var dbs = dbState(props.db)
    this.listen(dbs, "syncReset", this.syncMode)
  },
  render : function() {
    // console.log("NavBar", this.props)
    var page = this.props.page;
    var db = this.props.db;
    if (!db) return <div className="NavBarWrap">
      <div className="NavBar">
        <a className="logo" href="/_utils/">
          <img src="/_utils/assets/logo.png"/>
        </a>{" "}
        <strong>Hello.</strong>
      </div>
    </div>;
    return (<div className="NavBarWrap"><div className={"NavBar "+this.state.mode}>
      <PreviewToggle mode={this.state.mode} db={db}/>
      <a className="logo" href="/_utils/" >{" "}</a>{" "}
      <strong>{db}</strong>{" > "}
      <a className={page == "documents" && "active"}
        href={dbPath(db)}>Documents</a>{" : "}
      <a className={page == "sync" && "active"}
        href={dbPath(db, "sync")}>Sync</a>{" : "}
      <a className={page == "channels" && "active"}
        href={dbPath(db, "channels")}>Channels</a>{" : "}
      <a className={page == "users" && "active"}
        href={dbPath(db, "users")}>Users</a>
    </div></div>);
  }
})

var PreviewToggle = React.createClass({
  revert : function() {
    var dbs = dbState(this.props.db)
    dbs.setSyncFunction(dbs.deployedSyncFunction())
  },
  render : function() {
    if (this.props.mode == "preview") {
      return <div className="PreviewToggle">Preview mode: <a onClick={this.revert}>revert to deployed.</a></div>
    } else {
      return <div className="PreviewToggle">Deployed mode.</div>
    }
  }
})


