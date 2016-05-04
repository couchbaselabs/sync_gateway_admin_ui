import React, { PropTypes } from 'react';
import classNames from 'classnames'; 

const BoxTools = ({ pullRight, children }) => {
  const clazz = classNames({
    'box-tools': true,
    'pull-right': pullRight
  });
  
  return (
    <div className={clazz}>
      {children}
    </div>
  );
}

BoxTools.propTypes = {
  pullRight: PropTypes.bool
}

export default BoxTools;
