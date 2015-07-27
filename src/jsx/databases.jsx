var syncModel = require("../js/syncModel.js"),
  helpers = require("./helpers.jsx"),
  dbPath = helpers.dbPath,
  dbState = helpers.dbState,
  docLink = helpers.docLink,
  userLink = helpers.userLink,
  StateForPropsMixin = helpers.StateForPropsMixin,
  EventListenerMixin = helpers.EventListenerMixin;

module.exports = React.createClass({
  loadList : function() {
    syncModel.allDBs(location.origin, function(err, list) {
      if (!err)
        this.setState({dbs: list});
    }.bind(this));
  },
  getInitialState: function() {
    return {dbs: []};
  },
  componentWillMount: function() {
    this.loadList();
  },
  createDatabase : function(e) {
    e.preventDefault();
    var db = this.refs.dbName.state.value,
      url =this.refs.dbServer.state.value
    // console.log("createDatabase", db, url)
    syncModel.createDB(location.origin, db, {
      server : url
    }, function(err){
      var message;
      if (err && err.constructor !== SyntaxError) {
        message = err.message
      } else {
        message = "Created database: "+db
      }
      this.refs.dbName.state.value = ""
      this.loadList();
      this.setState({message : message})
    }.bind(this))
  },
  render : function() {
    var dbs = this.state.dbs;
    var title = this.props.title || "Databases"
    return (<div>
      <h3>{title}</h3>
      <ul className="defaults">
      {dbs.map(function(name) {
        return <li key={name}><a href={dbPath(name)}>{name}</a></li>;
      })}
      </ul>
      <form>
        <p>{this.state.message}</p>
        <label>Database Name: <input size="60" placeholder="lowercase" ref="dbName"/></label>
        <br/>
        <label>Storage URL: <input size="60" defaultValue="walrus:" ref="dbServer"/></label>
        <button onClick={this.createDatabase}>Create new database.</button>
      </form>
    </div>);
  }
});
