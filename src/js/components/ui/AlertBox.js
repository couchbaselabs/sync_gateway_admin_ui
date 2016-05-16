import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

const AlertBox = ({ type, onDismiss, style, children }) => {
  let bsStyle = type === 'error' ? 'danger' : type;
  return (
    <Alert bsStyle={bsStyle} style={style} onDismiss={onDismiss}>
      {children}
    </Alert>
  );
}

AlertBox.propTypes = {
  type: PropTypes.oneOf(
    ['info', 'warning', 'error', 'danger', 'primary', 'success', 'default']),
  onDismiss: PropTypes.func
}

AlertBox.defaultProps = { 
  type: 'default' 
}

export default AlertBox;
