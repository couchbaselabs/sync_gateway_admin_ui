import React, { PropTypes } from 'react';
import classNames from 'classnames';

const BoxFooter = ({ withPadding, style, children }) => {
  const clazz = classNames({
    ['box-footer']: true,
    ['no-padding']: !withPadding
  });

  return (
    <div className={clazz} style={style}>
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
