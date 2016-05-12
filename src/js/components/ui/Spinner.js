import React, { PropTypes } from 'react'; 
import '../../../assets/css/spinner.css'

const Spinner = ({ visible }) => {
  const spinner = visible ? <div className="spinner"/> : null;
  return (
    <div>{spinner}</div>
  );
}

Spinner.propTypes = {
  visible: PropTypes.bool
}

Spinner.defaultProps = { 
  visible: false 
}

export default Spinner;
