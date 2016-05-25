import React, { PropTypes } from 'react';
import classNames from 'classnames'; 

const Box = ({ topLine, bottomMargin, style, children }) => {
  const clazz = classNames({
    box: true,
    ['box-no-top-line']: !topLine,
    ['box-no-bottom-margin']: !bottomMargin
  });
  return (
    <div className={clazz} style={style}>
      {children}
    </div>
  );
}

Box.propTypes = {
  topLine: PropTypes.bool,
  bottomMargin: PropTypes.bool
}

Box.defaultProps = { 
  topLine: true,
  bottomMargin: true
}

export default Box;
