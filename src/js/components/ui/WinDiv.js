import React, { PropTypes } from 'react';
import classNames from 'classnames'; 

class WinDiv extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.state = { height: window.innerHeight };
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  
  handleResize() {
    this.setState(state => {
      return { height: window.innerHeight };
    });
  }
  
  render() {
    const { offset, style, className } = this.props;
    const height = this.state.height - offset;
    const nuStyle = Object.assign({ }, { height } , style);
    return (
      <div className={className} style={nuStyle}>
        {this.props.children}
      </div>
    );
  }
}

WinDiv.propTypes = {
  offset: PropTypes.number
}

WinDiv.defaultProps = { 
  offset: 0 
}

export default WinDiv;
