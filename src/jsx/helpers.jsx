/** @jsx React.DOM */

var coax = require("coax"),
  sg = coax(location.origin),
  SyncModel = require("syncModel");


  // window.addEventListener("beforeunload", function() {
  //   return "You have unsaved preview"
  // })

function dbState(db) {
  // console.log("dbState",sg(db).url)
  return SyncModel.SyncModelForDatabase(sg(db).url.toString())
}

function dbLink(db, path) {
  var base = "/_utils/db/"+db
  if (path) {
    base += "/"+path
  }
  return base
}

function channelLink(db, channel) {
  return <a href={dbLink(db,"channels/"+channel)}>{channel}</a>
}

function docLink(db, id) {
  return <a href={dbLink(db,"documents/"+id)}>{id}</a>
}

function userLink(db, user) {
  return <a href={dbLink(db,"users/"+user)}>{user}</a>
}


window.brClear = React.createClass({
  shouldComponentUpdate : function() {
    return false;
  },
  render : function() {
    return <br className="clear"/>
  }
})

window.StateForPropsMixin = {
  componentWillReceiveProps: function(newProps) {
    // console.log("StateForPropsMixin componentWillReceiveProps", newProps, this.props)
    this.setStateForProps(newProps, this.props)
  },
  componentWillMount: function() {
    // console.log("StateForPropsMixin componentWillMount", this.props)
    this.setStateForProps(this.props)
  }
};
