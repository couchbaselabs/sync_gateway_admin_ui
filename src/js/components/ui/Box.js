import React, { PropTypes } from 'react';
import classNames from 'classnames'; 

const Box = ({ topLine, children }) => {
  const clazz = classNames({
    box: true,
    ['box-no-top-line']: !topLine
  });
  return (
    <div className={clazz}>
      {children}
    </div>
  );
}

Box.propTypes = {
  topLine: PropTypes.bool
}

Box.defaultProps = { 
  topLine: true 
}

export default Box;
