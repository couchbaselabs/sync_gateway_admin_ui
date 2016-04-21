import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppContent from './AppContent';

const setAppTheme = (theme) => {
  document.body.classList.add(theme);  
}

const setBodyClass = () => {
  document.body.classList.add('sidebar-mini');
}

const App = (props) => {
  const { theme, sidebarEnabled, sidebar, contentHeader, 
    routes, params, children } = props;

  setAppTheme(theme);
  setBodyClass();
  
  const { primary, secondary } = contentHeader || { };
  
  return (
    <div className="wrapper">
      <AppHeader/>
      <AppSidebar/>
      <AppContent 
        primaryHeader={primary} 
        secondaryHeader={secondary} 
        routes={routes} 
        params={params}>
        {children}
      </AppContent>
    </div>
  );
}

App.propTypes = {
  theme: PropTypes.string,
  contentHeader: PropTypes.shape({ 
    primary: PropTypes.string, 
    secondary: PropTypes.string 
  })
}

App.defaultProps = { 
  theme: 'skin-black',
}

export default connect((state) => {
  const { theme, contentHeader } = state.app;
  return { theme, contentHeader };
})(App);
