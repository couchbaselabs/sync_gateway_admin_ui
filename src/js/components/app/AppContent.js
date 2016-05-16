import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AppStore  from '../../stores/AppStore'
import Breadcrumbs from './Breadcrumbs';
import { AlertBox } from '../ui';

const dismissAlert = () => {
  AppStore.setAlert(undefined);
};

const AppContent = ({ 
  primaryHeader, secondaryHeader, alert, children, routes, params }) => {
  
  const alertBox = alert ? 
    (<AlertBox type={alert.type} onDismiss={dismissAlert}>
      {alert.message}
    </AlertBox>) : null;
  
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
        {alertBox}
        {children}
      </div>
    </div>
  );
}

AppContent.propTypes = { 
  primaryHeader: PropTypes.string,
  secondaryHeader: PropTypes.string,
  alert: PropTypes.shape({
    type: PropTypes.oneOf(['info', 'warning', 'error', 'primary', 'success']),
    message: PropTypes.string
  }),
  routes: PropTypes.array, // react-router routes
  params: PropTypes.object // react-router params
}

export default AppContent;