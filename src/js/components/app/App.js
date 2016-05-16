import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AppStore  from '../../stores/AppStore'
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppContent from './AppContent';

const setAppTheme = (theme) => {
  document.body.classList.add(theme);  
}

const setBodyClass = () => {
  document.body.classList.add('sidebar-mini');
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.appStoreOnChange = this.appStoreOnChange.bind(this)
    this.state = AppStore.getData();
  }

  componentWillMount() {
    AppStore.addChangeListener(this.appStoreOnChange);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.appStoreOnChange);
  }

  appStoreOnChange() {
    this.setState(state => {
      return AppStore.getData();
    });
  }

  render() {
    const { routes, params, children } = this.props;
    const { contentHeader, theme, activityIndicatorVisible, alert } = 
      this.state;
    const { primary, secondary } = contentHeader || { };
    
    setAppTheme(theme);
    setBodyClass();
    
    return (
      <div className="wrapper">
        <AppHeader spinnerVisible={activityIndicatorVisible}/>
        <AppSidebar/>
        <AppContent 
          primaryHeader={primary} 
          secondaryHeader={secondary}
          alert={alert} 
          routes={routes} 
          params={params}>
          {children}
        </AppContent>
      </div>
    );
  }
}

export default App;
