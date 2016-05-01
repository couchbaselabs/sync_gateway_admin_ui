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

    this.appStoreOnChange = this.appStoreOnChange.bind(this);

    this.state = {
      contentHeader: undefined
    }
  }

  componentWillMount() {
    AppStore.addListener(this.appStoreOnChange);
    this.appStoreOnChange();
  }

  componentWillUnmount() {
    AppStore.remoteListener(this.appStoreOnChange);
  }

  appStoreOnChange() {
    const contentHeader = AppStore.getContentHeader();
    this.setState(state => {
      return Object.assign({ }, this.state, { contentHeader });
    });
  }

  render() {
    const { theme, routes, params, children } = this.props;

    const { contentHeader } = this.state;

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
}

App.propTypes = {
  theme: PropTypes.string,
}

App.defaultProps = { 
  theme: 'skin-black',
}

export default App;
