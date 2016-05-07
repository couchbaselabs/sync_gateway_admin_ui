import Store from './Store'

const defaultTheme = 'skin-red-light';

class AppStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return {
      theme: defaultTheme,
      contentHeader: {
        primary: undefined,   // string
        secondary: undefined  // string
      }
    };
  }

  setContentHeader(primary, secondary) {
    const contentHeader = { primary, secondary };
    this.setData(data => {
      return Object.assign({ }, data, { contentHeader });
    })
  }
  
  setTheme(theme) {
    const newTheme = theme || defaultTheme;
    this.setData(data => {
      return Object.assign({ }, data, { theme: newTheme });
    })
  }
}

const instance = new AppStore();
export default instance;
