/** @jsx React.DOM */

var IS_MOBILE = (
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i)||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPod/i) ||
  navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i)
);

exports.CodeMirrorEditor = React.createClass({
  componentDidMount: function(root) {
    if (IS_MOBILE) {
      return;
    }
    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), {
      mode: this.props.mode,
      lineNumbers: true,
      matchBrackets: true,
      readOnly: this.props.readOnly
    });
    // console.log("CodeMirror",this.editor)
    this.editor.on('change', this.onChange);
  },
  onChange: function(e, change) {
    if (change.origin !== "setValue" && this.props.onChange) {
      var content = this.editor.getValue();
      this.props.onChange(content);
    }
  },
  componentWillUpdate : function(newProps) {
    // console.log("componentWillUpdate", this.props, newProps)
    // don't refill the editor unless we get new external data
    // console.log(newProps)
    if (this.props.loadSeq !== newProps.loadSeq) {
      this.editor.setValue(newProps.codeText)      
    }
  },
  render: function() {
    // wrap in a div to fully contain CodeMirror
    var editor;
    // console.log("editor", this.props)
    if (IS_MOBILE) {
      editor = <pre style={{overflow: 'scroll'}}>{this.props.codeText}</pre>;
    } else {
      editor = <textarea ref="editor" defaultValue={this.props.codeText} />;
    }

    return (
      <div className={this.props.className}>
        {editor}
      </div>
    );
  }
});
