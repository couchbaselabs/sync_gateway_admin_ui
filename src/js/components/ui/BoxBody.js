import React, { PropTypes } from 'react';
import classNames from 'classnames';

const BoxBody = ({ withPadding, children }) => {
  const clazz = classNames({
    ['box-body']: true,
    ['no-padding']: !withPadding
  });

  return (
    <div className={clazz}>
      {children}
    </div>
  );
}

BoxBody.propTypes = {
  withPadding: PropTypes.bool
};

BoxBody.defaultProps = { 
  withPadding: true 
}

export default BoxBody;
