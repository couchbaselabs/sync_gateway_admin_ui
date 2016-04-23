import React, { PropTypes } from 'react';
import classNames from 'classnames';

const BoxFooter = ({ withPadding, children }) => {
  const clazz = classNames({
    ['box-footer']: true,
    ['no-padding']: !withPadding
  });

  return (
    <div className={clazz}>
      {children}
    </div>
  );
}

BoxFooter.propTypes = {
  withPadding: PropTypes.bool
};

BoxFooter.defaultProps = { 
  withPadding: true 
}

export default BoxFooter;
