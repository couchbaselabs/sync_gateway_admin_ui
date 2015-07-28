var helpers = require("./helpers.jsx"),
  React = require("react"),
  dbPath = helpers.dbPath,
  dbState = helpers.dbState,
  docLink = helpers.docLink,
  userLink = helpers.userLink,
  brClear = helpers.brClear,
  channelLink = helpers.channelLink,
  StateForPropsMixin = helpers.StateForPropsMixin,
  EventListenerMixin = helpers.EventListenerMixin,
  CodeMirrorEditor = require("./editor.jsx").CodeMirrorEditor;

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

var EditableJSONDoc = React.createClass({
  render : function(){
    var editor = this.props.docText ? <CodeMirrorEditor
              onChange={this.props.bindState('docText')}
              className="JSONDocEditor"
              mode="json"
              loadSeq={this.props.loadSeq}
              codeText={this.props.docText} /> : <div/>;
    return <form className="EditableJSONDoc">
      <div className="EditableJSONDocButtons">
        <button onClick={this.props.saveDoc}>Save Doc</button>
        <button onClick={this.props.revertDoc}>Revert Doc</button>
      </div>
      {editor}
    </form>
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
          return <li key={db + ch}>{channelLink(db, ch)}</li>
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
      return <span key={ch.name}><dt>{channelLink(db, ch.name)}</dt>
        {ch.users.map(function(who){
            return <dd key={ch.name + who}>{userLink(db, who)}</dd>
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
    var dbs = dbState(this.props.db)
    dbs.on("connected", function() {
      dbs.allDocs(function(err, rows){
        this.setState({rows : rows})
      }.bind(this));
    }.bind(this))
  },
  findOrCreateDoc : function(e){
    e.preventDefault()
    var id = this.refs.goID.getDOMNode().value
    console.log("createDoc", id)
    var url = dbPath(this.props.db, "documents/"+id)
    document.location = url;
  },
  render : function() {
    var db = this.props.db;
    var rows = this.state.rows;
    return <div className="ListDocs">
          <strong>{rows.length} documents</strong>, highlighted documents have access control output with the current sync function.
          <p>Load or create document with ID: <input ref="goID" type="text"/> 
          <button onClick={this.findOrCreateDoc}>Go</button></p>
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
    return {deployed : {channels:[], access:{}}, 
    db : this.props.db, docText : "", loadSeq : 0};
  },
  setDoc : function(id) {
    if (!id) return;
    dbState(this.props.db).getDoc(id, function(err, doc, deployedSync, previewSync) {
      if (err && err.error == "not_found") {
        doc = {_id : id}
      } else if (err) {
        return console.error(err)
      }
      console.log("getDoc", doc)
      this.setState({docID : id, 
        docText : JSON.stringify(doc, null, 2),
        isNewDoc : !doc._rev,
        loadSeq : this.state.loadSeq + 1,
        deployed : deployedSync, preview : previewSync})
    }.bind(this))
  },
  saveDoc : function(e){
    e.preventDefault();
    if (!(this.state.docText && this.state.docID)) {return;}
    var doc = JSON.parse(this.state.docText)
    console.log("saveDoc", doc)
    dbState(this.props.db).saveDoc(doc, function(err) {
      console.log("saved Doc", this.state.docID)
      this.setDoc(this.state.docID)
    }.bind(this))
  },
  revertDoc : function(e){
    e.preventDefault();
    if (!this.state.docID) return;
    this.setDoc(this.state.docID)
  },
  bindState: function(name) {
    return function(value) {
      var newState = {};
      newState[name] = value;
      this.setState(newState);
    }.bind(this);
  },
  setStateForProps : function(props) {
    if (props.db && props.docID) {
      this.setDoc(props.docID)
    }
  },
  render : function() {
    var newDocMessage;
    if (this.state.isNewDoc) {
      newDocMessage = <p><em>Document with ID "{this.props.docID}" will be created on save.</em></p>
    }
    return (
      <div className="DocInfo">
      <h4>{
        this.state.docID ? <span>{this.state.docID+" "} <a href={"/"+this.props.db+"/_raw/"+this.state.docID}>raw</a></span> : "Loading..."}
      </h4>
        {newDocMessage}
        <EditableJSONDoc db={this.state.db} docText={this.state.docText} id={this.state.docID} bindState={this.bindState} saveDoc={this.saveDoc} revertDoc={this.revertDoc} loadSeq={this.state.loadSeq}/>
        <DocSyncPreview db={this.state.db} sync={this.state.preview} id={this.state.docID}/>
        <brClear/>
        <p><a href={"/"+this.props.db+"/"+this.state.docID}>Raw document URL</a></p>
      </div>
    );
  }
});

