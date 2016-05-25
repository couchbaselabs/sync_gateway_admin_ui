import React, { PropTypes } from 'react';
import classNames from 'classnames';

const BoxHeader = (props) => {
  const clazz = classNames({
    'box-header': true,
    'with-border': props.withBorder
  });
  
  const title = props.title && <h3 className="box-title">{props.title}</h3>;
  return (
    <div className={clazz} style={props.style}>
      {title}
      {props.children}
    </div>
  );
}

BoxHeader.propTypes = {
  title: PropTypes.string,
  withBorder: PropTypes.bool
}

BoxHeader.defaultProps = { 
  withBorder: true
}

export default BoxHeader;
