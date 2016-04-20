import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Breadcrumbs from './Breadcrumbs';

const AppContent = ({ 
  primaryHeader, secondaryHeader, children, routes, params }) => {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h1>
          {primaryHeader}
          <small>{secondaryHeader}</small>
        </h1>
        <Breadcrumbs routes={routes} params={params}/>
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

AppContent.propTypes = { 
  primaryHeader: PropTypes.string,
  secondaryHeader: PropTypes.string,
  routes: PropTypes.array, // react-router routes
  params: PropTypes.object // react-router params
}

export default AppContent;