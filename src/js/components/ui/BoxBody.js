import React, { PropTypes } from 'react';
import className from 'classnames';

const BoxBody = ({ noPadding, children }) => {
  const classes = className({
    ['box-body']: true,
    ['no-padding']: noPadding
  });

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

BoxBody.propTypes = {
  noPadding: PropTypes.bool
};

BoxBody.defaultProps = { 
  noPadding: true 
}

export default BoxBody;
