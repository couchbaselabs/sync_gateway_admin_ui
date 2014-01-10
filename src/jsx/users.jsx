/** @jsx React.DOM */

var helpers = require("./helpers.jsx"),
  dbPath = helpers.dbPath,
  dbState = helpers.dbState,
  docLink = helpers.docLink,
  userLink = helpers.userLink,
  channelLink = helpers.channelLink,
  StateForPropsMixin = helpers.StateForPropsMixin,
  EventListenerMixin = helpers.EventListenerMixin;

module.exports = React.createClass({
  render : function() {
    var db = this.props.db;
    var userID = this.props.userID;
    console.log("render UsersPage")
    return (
      <div>
      <UsersForDatabase db={db}/>
      <UserInfo db={db} userID={userID}/>
      </div>
    );
  }
});

var UserInfo = React.createClass({
  mixins : [StateForPropsMixin],
  getInitialState: function() {
    return {db:this.props.db};
  },
  setStateForProps : function(props) {
    if (props.db && props.userID) {
      var dbs = dbState(props.db);
      dbs.userInfo(props.userID, function(err, data) {
        this.setState({user : data, userID : props.userID, db : props.db})
      }.bind(this))

    } else {
      this.setState(this.getInitialState())
    }
  },
  render : function() {
    var user = this.state.user, userID = this.state.userID, db = this.state.db;
    if (!this.props.userID) return <div></div>;
    if (!user) return <div>No such user: {this.props.userID} Perhaps you are browsing a partial replica?</div>;
    return (
      <div className="UserInfo">
      <h2>{user.name}</h2>
      <div className="UserChannels">
            <h3>Channels <a href={dbPath(db,"channels?title=Channels for "+user.name+"&watch="+user.all_channels.join(','))}>(watch all)</a></h3>
            <ul>
      {
        user.all_channels.map(function(ch){
          return <li>{channelLink(db, ch)}</li>
        })
      }
            </ul>
      </div>
      <div className="UserDoc">
        <h3>JSON User Document</h3>
        <pre><code>{JSON.stringify(user, null, 2)}</code></pre>
      </div>
      </div>
    );
  }
});
// <a href={dbPath(db, "_user/"+userID+"/edit")}>edit</a>

var UsersForDatabase = React.createClass({
  getInitialState: function() {
    return {users: []};
  },
  componentWillMount: function() {
    var dbs = dbState(this.props.db);
    dbs.allUsers(function(err, data) {
      if (!err) this.setState({users : data.rows.filter(function(r) {
        return r.key;
      })})
    }.bind(this));
  },
  render : function() {
    var db = this.props.db;
    var users = this.state.users;
    return (<div className="UsersForDatabase">
      <p>{users.length} user{users.length !== 1 && "s"} in {db}</p>
      <ul >
        {users.map(function(user) {
          return <li key={user.key}><a href={"/_utils/db/"+db+"/users/"+user.key}>{user.key}</a></li>;
        })}
      </ul></div>)
  }
})
