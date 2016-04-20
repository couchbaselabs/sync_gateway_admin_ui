import React, { PropTypes } from 'react';
import brace from 'brace';

class Brace extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { cursorAt, fontSize, mode, name, readOnly, tabSize, theme, value } 
      = this.props;
    
    this.editor = brace.edit(name);
    
    this.editor.$blockScrolling = Infinity;
    
    this.setMode(mode);
    
    this.setTheme(theme);
    
    this.editor.getSession().setTabSize(tabSize);
    
    this.editor.setFontSize(fontSize);

    this.editor.setReadOnly(readOnly);

    this.shouldNotifyOnChange = true;
    this.editor.on('change', this.onChange);
    
    this.editor.setValue(value, 1);
    
    if (cursorAt)
      this.editor.moveCursorTo(cursorAt.row, cursorAt.column);
    
    this.editor.focus();
  }

  componentWillReceiveProps(nextProps) {
    const { cursorAt, fontSize, mode, tabSize, theme, value } = nextProps;
    const { cursorAt:oldCursorAt,
            fontSize:oldFontSize,
            mode:oldMode,
            tabSize:oldTabSize,
            theme:oldTheme} = this.props;
            
    if (mode !== oldMode)
      this.setMode(mode);
    
    if (theme !== oldTheme)
      this.setTheme(theme);
      
    if (tabSize !== oldTabSize)
      this.editor.getSession.setTabSize(tabSize);
      
    if (fontSize !== oldFontSize)
      this.editor.setFontSize(fontSize);
    
    if (value !== this.editor.getValue()) {
      this.shouldNotifyOnChange = false;
      this.editor.setValue(value, 1);
      this.shouldNotifyOnChange = true;
    }
    
    if (cursorAt) {
      if (!oldCursorAt || 
          cursorAt.row !== oldCursorAt.row || 
          cursorAt.column !== oldCursorAt.column) {
        this.editor.moveCursorTo(cursorAt.row, cursorAt.column);
      }
    }
  }

  componentWillUnmount() {
    this.editor.destroy();
    this.editor = null;
  }

  onChange() {
    if (this.props.onChange && this.shouldNotifyOnChange)
      this.props.onChange(this.editor.getValue());
  }
  
  setMode(mode) {
    if (mode)
      this.editor.getSession().setMode('ace/mode/' + mode);
  }
  
  setTheme(theme) {
    if (theme)
      this.editor.setTheme('ace/theme/' + theme);
  }
  
  render() {
    const { name } = this.props;
    return (
      <div id={name} style={{width: '100%', height: '100%'}}/>
    );
  }
}

Brace.propTypes = {
  fontSize: PropTypes.number,
  mode: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  tabSize: PropTypes.number,
  theme: PropTypes.string,
  value: PropTypes.string,
  cursorAt: PropTypes.shape({ 
    row: PropTypes.number, 
    column: PropTypes.number 
  })
}

Brace.defaultProps = {
  fontSize: 12,
  tabSize: 2
}

export default Brace;
