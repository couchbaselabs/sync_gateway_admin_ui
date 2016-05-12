import Store from './Store'

const defaultTheme = 'skin-red-light';

class AppStore extends Store {
  constructor() {
    super();
    this.activityIndicators = { };
  }
  
  getInitialData() {
    return {
      theme: defaultTheme,
      contentHeader: {
        primary: undefined,   // string
        secondary: undefined  // string
      },
      activityIndicatorVisible: false
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
  
  setActivityIndicatorVisible(visible, from) {
    const curVisible = this.activityIndicators[from] === true;
    if (curVisible === visible)
      return;
    
    if (visible)
        this.activityIndicators[from] = true;
    else
      delete this.activityIndicators[from];
    
    const showIndicator = Object.keys(this.activityIndicators).length > 0;
    
    const { activityIndicatorVisible } = this.data;
    if (activityIndicatorVisible != showIndicator) {
      if (this.activityIndicatorTimeout)
        clearTimeout(this.activityIndicatorTimeout);
      
      const delay = visible ? 1000 : 0;
      this.activityIndicatorTimeout = setTimeout(() => {
        this._setActivityIndicatorVisible(visible);
      }, delay);
    }
  }
  
  _setActivityIndicatorVisible(visible) {
    this.setData(data => {
      return Object.assign({ }, data, { activityIndicatorVisible: visible });
    })
  }
}

const instance = new AppStore();
export default instance;
