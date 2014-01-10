/** @jsx React.DOM */

var coax = require("coax"),
  sg = coax(location.origin),
  SyncModel = require("../js/syncModel");

  // window.addEventListener("beforeunload", function() {
  //   return "You have unsaved preview"
  // })

exports.dbState = function (db) {
  return SyncModel.SyncModelForDatabase(sg(db).url.toString())
}

var dbPath = exports.dbPath = function (db, path) {
  var base = "/_utils/db/"+db
  if (path) {
    base += "/"+path
  }
  return base
}

exports.channelLink = function(db, channel) {
  return <a href={dbPath(db,"channels/"+channel)}>{channel}</a>
}

exports.docLink = function(db, id) {
  return <a href={dbPath(db,"documents/"+id)}>{id}</a>
}

exports.userLink = function(db, user) {
  return <a href={dbPath(db,"users/"+user)}>{user}</a>
}


exports.brClear = React.createClass({
  shouldComponentUpdate : function() {
    return false;
  },
  render : function() {
    return <br className="clear"/>
  }
})
exports.EventListenerMixin = require("../js/eventListener.js")
exports.StateForPropsMixin = {
  componentWillReceiveProps: function(newProps) {
    // console.log("StateForPropsMixin componentWillReceiveProps", newProps, this.props)
    this.setStateForProps(newProps, this.props)
  },
  componentWillMount: function() {
    // console.log("StateForPropsMixin componentWillMount", this.props)
    this.setStateForProps(this.props)
  }
};
