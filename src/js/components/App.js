import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppContent from './AppContent';

const setAppTheme = (theme) => {
  document.body.classList.add(theme);  
}

const setSidebarEnabled = (enabled) => {
  if (enabled) {
    document.body.classList.remove('sidebar-collapse');
    document.body.classList.add('sidebar-mini');
  } else {
    document.body.classList.remove('sidebar-mini');
    document.body.classList.add('sidebar-collapse');
  }
}

const App = (props) => {
  const { theme, sidebarEnabled, sidebar, contentHeader, 
    children, routes, params} = props;

  setAppTheme(theme);
  setSidebarEnabled(sidebarEnabled);
  
  const { primary, secondary } = contentHeader || { };
  
  return (
    <div className="wrapper">
      <AppHeader displaySidebarButton={sidebarEnabled}/>
      <AppSidebar/>
      <AppContent primaryHeader={primary} secondaryHeader={secondary} 
        routes={routes} params={params}>
        {children}
      </AppContent>
    </div>
  );
}

App.propTypes = {
  theme: PropTypes.string,
  sidebarEnabled: PropTypes.bool,
  sidebar: PropTypes.array,
  contentHeader: PropTypes.shape({ 
    primary: PropTypes.string, 
    secondary: PropTypes.string 
  })
}

App.defaultProps = { 
  theme: 'skin-black',
  sidebarEnabled: false,
  sidebar: []
}

export default connect((state) => {
  const { sidebarEnabled, contentHeader } = state.app;
  return { sidebarEnabled, contentHeader };
})(App);
