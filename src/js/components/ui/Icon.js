import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Icon = ({ name, spin, fw, size }) => {
  const classes = classNames({
    fa: true,
    ['fa-spin']: spin,
    ['fa-' + name]: true,
    ['fa-' + size]: (size && size.length > 0),
  });
  
  return (
    <i className={classes} aria-hidden="true"/>
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  fw: PropTypes.bool,
  spin: PropTypes.bool,
  size: PropTypes.string
};

Icon.defaultProps = {
  fw: true,
  spin: false
};

export default Icon;
