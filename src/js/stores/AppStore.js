import Store from './Store'

const defaultTheme = 'skin-black';

class AppStore extends Store {
  constructor() {
    super();
    this.data = {
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

  getContentHeader() {
    return Object.assign({ }, this.data.contentHeader);
  }

  setTheme(theme) {
    const newTheme = theme || defaultTheme;
    this.setData(data => {
      return Object.assign({ }, data, { theme: newTheme });
    })
  }

  getTheme() {
    return this.data.theme;
  }
}

const instance = new AppStore();
export default instance;
