import React, { PropTypes } from 'react';
import classNames from 'classnames'; 

const BoxTools = ({ style, children }) => {
  const clazz = classNames({
    'box-tools': true,
    'pull-right': true
  });
  
  return (
    <div className={clazz} style={style}>
      {children}
    </div>
  );
}

export default BoxTools;
