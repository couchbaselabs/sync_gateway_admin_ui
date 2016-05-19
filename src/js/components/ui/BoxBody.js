import React, { PropTypes } from 'react';
import classNames from 'classnames';

class BoxBody extends React.Component {
  constructor(props) {
    super(props)
    this.handleResize = this.handleResize.bind(this);
    this.state = { height: window.innerHeight };
  }
  
  componentDidMount() {
    if (this.props.matchWinHeight)
      this.listenToWindowResizeEvent(true);
  }
  
  componentWillUnmount() {
    if (this.props.matchWinHeight)
      this.listenToWindowResizeEvent(false);
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.matchWinHeight != nextProps.matchWinHeight)
      this.listenToWindowResizeEvent(nextProps.matchWinHeight);
  }
  
  listenToWindowResizeEvent(listen) {
    if (listen)
      window.addEventListener('resize', this.handleResize);
    else
      window.removeEventListener('resize', this.handleResize);
  }
  
  handleResize() {
    if (this.props.matchWinHeight) {
      this.setState(state => {
        return { height: window.innerHeight };
      });
    }
  }
  
  render() {
    const { withPadding, style, children } = this.props;
    const { matchWinHeight, matchWinHeightOffset } = this.props;
    
    let nuStyle = style;
    if (matchWinHeight) {
      const height = this.state.height - matchWinHeightOffset;
      nuStyle = Object.assign({ }, { height } , style);  
    }
    
    const clazz = classNames({
      ['box-body']: true,
      ['no-padding']: !withPadding
    }); 
    
    return (
      <div className={clazz} style={nuStyle}>
        {children}
      </div>
    );
  }
}

BoxBody.propTypes = {
  withPadding: PropTypes.bool,
  matchWinHeight: PropTypes.bool,
  matchWinHeightOffset: PropTypes.number
};

BoxBody.defaultProps = { 
  withPadding: true,
  matchWinHeight: false,
  matchWinHeightOffset: 0
}

export default BoxBody;
