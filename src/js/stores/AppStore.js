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
        primary: undefined,     // string
        secondary: undefined,   // string
      },
      alert: undefined,         // { type: ['info', 'warning', 'error', 
                                //          'primary', 'success'], 
                                //   message: string }
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
    
    if (this.activityIndicatorTimeout)
      clearTimeout(this.activityIndicatorTimeout);
      
    const showIndicator = Object.keys(this.activityIndicators).length > 0;
    const { activityIndicatorVisible } = this.data;
    if (activityIndicatorVisible != showIndicator) {
      const delay = visible ? 1000 : 0;
      this.activityIndicatorTimeout = setTimeout(() => {
        this._setActivityIndicatorVisible(showIndicator);
        this.activityIndicatorTimeout = undefined;
      }, delay);
    }
  }
  
  _setActivityIndicatorVisible(visible) {
    this.setData(data => {
      return Object.assign({ }, data, { activityIndicatorVisible: visible });
    })
  }
  
  setAlert(alert) {
    this.setData(data => {
      return Object.assign({ }, data, { alert });
    });
  }
}

const instance = new AppStore();
export default instance;
