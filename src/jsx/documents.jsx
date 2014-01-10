/** @jsx React.DOM */

var helpers = require("./helpers.jsx"),
  dbPath = helpers.dbPath,
  dbState = helpers.dbState,
  docLink = helpers.docLink,
  userLink = helpers.userLink,
  brClear = helpers.brClear,
  channelLink = helpers.channelLink,
  StateForPropsMixin = helpers.StateForPropsMixin,
  EventListenerMixin = helpers.EventListenerMixin;

var JSONDoc = exports.JSONDoc = React.createClass({
  render : function() {
    return <div className="JSONDoc">
      <h4>{
        this.props.id ? <span>{this.props.id+" "} <a href={"/"+this.props.db+"/_raw/"+this.props.id}>raw</a></span> : "Loading..."}</h4>
      <pre><code>
      {JSON.stringify(this.props.doc, null, 2)}
      </code></pre>
    </div>;
  }
})

var DocSyncPreview = exports.DocSyncPreview = React.createClass({
  getDefaultProps : function(){
    return {sync:{channels:[], access:{}}};
  },
  render : function() {
    var sync = this.props.sync;
    // console.log("sync", sync)
    var db = this.props.db;
    if (!sync) return <div></div>;
    var channels = sync.channels;
    return <div className="DocSyncPreview">
      <div className="channels">
        <h4>Channels</h4>
        <ul>
        {channels.map(function(ch) {
          return <li>{channelLink(db, ch)}</li>
        })}
        </ul>
      </div>
      <AccessList access={sync.access} db={db}/>
    </div>;
    }
})

// smells like ChannelAccessList
var AccessList = React.createClass({
  render : function() {
    var db = this.props.db;
    var accessList = []
    for (var ch in this.props.access) {
      accessList.push({name: ch, users: this.props.access[ch]})
    }
    return <div className="access">
    <h4>Access</h4>
    <dl>
    {accessList.map(function(ch) {
      return <span><dt>{channelLink(db, ch.name)}</dt>
        {ch.users.map(function(who){
            return <dd>{userLink(db, who)}</dd>
          })}</span>
    })}
    </dl>
  </div>
  }
})

exports.DocumentsPage = React.createClass({
  render : function() {
    var db = this.props.db;
    var docID = this.props.docID;
    return (
      <div>
        <ListDocs db={db}/>
        {docID && <DocInfo db={db} docID={docID}/>}
      </div>
    );
  }
});

var ListDocs = React.createClass({
  getInitialState: function() {
    return {rows: []};
  },
  componentWillMount: function() {
    console.log("load ListDocs")
    var dbs = dbState(this.props.db)
    dbs.on("connected", function() {
      dbs.allDocs(function(err, rows){
        this.setState({rows : rows})
      }.bind(this));
    }.bind(this))
  },
  render : function() {
    var db = this.props.db;
    var rows = this.state.rows;
    return <div className="ListDocs">
          <strong>{rows.length} documents</strong>, highlighted documents have access control output with the current sync function.
          <ul>
          {rows.map(function(r) {
            return <li className={r.access && "isAccess"} key={"docs"+r.id}>
              <a href={dbPath(db, "documents/"+r.id)}>
                {r.id}
              </a>
              </li>;
          })}
        </ul></div>
  }
})


var DocInfo = React.createClass({
  mixins : [StateForPropsMixin],
  getInitialState: function() {
    return {doc: {}, deployed : {channels:[], access:{}}, db : this.props.db};
  },
  setDoc : function(id) {
    if (!id) return;
    dbState(this.props.db).getDoc(id, function(err, doc, deployedSync, previewSync) {
      if (err) {return console.error(err);}
      this.setState({docID : id, doc : doc, deployed : deployedSync, preview : previewSync})
    }.bind(this))
  },
  setStateForProps : function(props) {
    if (props.db && props.docID) {
      this.setDoc(props.docID)
    }
  },
  render : function() {
    return (
      <div className="DocInfo">
        <JSONDoc db={this.state.db} doc={this.state.doc} id={this.state.docID}/>
        <DocSyncPreview db={this.state.db} sync={this.state.deployed} id={this.state.docID}/>
        <brClear/>
        <p><a href={"/"+this.props.db+"/"+this.state.docID}>Raw document URL</a></p>
      </div>
    );
  }
});

