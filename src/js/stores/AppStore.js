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
    this.data = Object.assign({ }, this.data, { contentHeader });
    this.emitChange();
  }

  getContentHeader() {
    return Object.assign({ }, this.data.contentHeader);
  }

  setTheme(theme) {
    if (!theme)
      theme = defaultTheme;
    this.data = Object.assign({ }, this.data, { theme });
  }

  getTheme() {
    return this.data.theme;
  }
}

const instance = new AppStore();
export default instance;
