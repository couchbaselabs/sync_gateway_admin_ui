var helpers = require("./helpers.jsx"),
  React = require("react"),
  dbPath = helpers.dbPath,
  dbState = helpers.dbState,
  docLink = helpers.docLink,
  userLink = helpers.userLink,
  channelLink = helpers.channelLink,
  StateForPropsMixin = helpers.StateForPropsMixin,
  EventListenerMixin = helpers.EventListenerMixin,
  documents = require("./documents.jsx"),
  CodeMirrorEditor = require("./editor.jsx").CodeMirrorEditor,
  JSONDoc = documents.JSONDoc,
  DocSyncPreview = documents.DocSyncPreview;

exports.SyncPage = React.createClass({
  render : function() {
    return (
      <div className="SyncPage">
        <p>The <strong>Sync Function</strong> determines application-specific behavior regarding who can see and modify which documents. The code you write here can validate updates, route documents to channels, and grant access privileges  to users and groups on a per-channel basis. For more information <a href="http://docs.couchbase.com/sync-gateway/#sync-function-api">see the Sync Function API documentation.</a>
        </p>
        <SyncFunEditor db={this.props.db}/>
      </div>
      )
  }
})

var examples = {
  "basic" : "function(doc){\n  channel(doc.channels)\n}"
}


var SyncFunEditor = React.createClass({
  render : function() {
    console.log("SyncFunEditor", this.state, this.props)
    return <div className="SyncFunEditor">
      <SyncFunctionForm db={this.props.db}/>
      <SyncPreview db={this.props.db}/>
    </div>
  }
})

var SyncFunctionForm = React.createClass({
  getInitialState : function() {
    return {}
  },
  bindState: function(name) {
    return function(value) {
      var newState = {};
      newState[name] = value;
      this.setState(newState);
    }.bind(this);
  },
  componentDidMount : function(elem){
    dbState(this.props.db).on("connected", function(){
      var sync = dbState(this.props.db).getSyncFunction()
      this.setState({code : sync})
    }.bind(this))
  },
  previewClicked : function(e) {
    e.preventDefault();
    var dbs = dbState(this.props.db)
    dbs.on("connected", function() {
      console.log("setSyncFunction")
      dbs.setSyncFunction(this.state.code)
    }.bind(this))
  },
  deployClicked : function(e) {
    e.preventDefault();
    var yes = confirm("Are you sure? If you are using in-memory Walrus this will erase your data.")
    if (yes) {
      dbState(this.props.db).deploySyncFunction(this.state.code, function(err){
        // if (err) throw(err);
        console.log("deployed")
        // window.location.reload();
      })
    }
  },
  render : function() {
    var editor = this.state.code ? <CodeMirrorEditor
        onChange={this.bindState('code')}
        mode="javascript"
        className="SyncFunctionCodeEditor"
        codeText={this.state.code} /> : <div/>
    return <form className="SyncFunctionCode">
      <h3>Sync Function</h3>
      {editor}
      <div className="SyncFunctionCodeButtons">
        <button onClick={this.previewClicked}>Live Preview Mode</button>
        <button onClick={this.deployClicked}>Deploy To Server</button>
      </div>
    </form>
  }
})

var SyncPreview = React.createClass({
  getInitialState : function() {
    return {}
  },
  setDoc : function(id) {
    if (!id) return;
    dbState(this.props.db).getDoc(id, function(err, doc, deployedSync, previewSync) {
      if (err) { return console.error(err)}
      this.setState({docID : id, doc : doc, deployed : deployedSync, preview : previewSync})
    }.bind(this))
  },
  handleRandomAccessDoc : function() {
    this.setDoc(dbState(this.props.db).randomAccessDocID())
  },
  handleRandomDoc : function() {
    this.setDoc(dbState(this.props.db).randomDocID())
  },
  componentDidMount : function(){
    var dbS = dbState(this.props.db);
    dbS.on("connected", function(){
      this.setDoc(dbS.randomAccessDocID() || dbS.randomDocID())
    }.bind(this))
  },
  render : function() {
    console.log("SyncPreview", this.state, this.props)
    return <div className="SyncPreview">
      <JSONDoc db={this.props.db} doc={this.state.doc} id={this.state.docID}/>
      <div className="docs">
        <p>Preview sync function on real documents:
        <ul className="defaults">
          <li><a onClick={this.handleRandomDoc}>random</a></li>
          <li><a onClick={this.handleRandomAccessDoc}>grants access</a></li>
        </ul>
        </p>
      </div>
      <br className="clear"/>
      <p>Preview results:</p>
      <DocSyncPreview db={this.props.db} id={this.state.docID} sync={this.state.preview}/>
      <br className="clear"/>
      <p>Deployed results:</p>
      <DocSyncPreview db={this.props.db} id={this.state.docID} sync={this.state.deployed}/>
      </div>
  }
})
