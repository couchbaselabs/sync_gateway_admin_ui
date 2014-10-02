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
      mode: 'javascript',
      lineNumbers: true,
      matchBrackets: true,
      readOnly: this.props.readOnly
    });
    // console.log("CodeMirror",this.editor)
    this.editor.on('change', this.onChange);
  },
  onChange: function() {
    if (this.props.onChange) {
      var content = this.editor.getValue();
      this.props.onChange(content);
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
