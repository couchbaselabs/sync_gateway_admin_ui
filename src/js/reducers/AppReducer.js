import Keys from '../actions/Keys';

const initialState = { 
  sidebarEnabled: false,
  contentHeader: { /* 
    primary:string, 
    secondary:string */ 
  }
}

function app(state = initialState, action) {
  switch(action.type) {
    case Keys.SET_APP_SIDEBAR_ENABLED:
      return Object.assign({ }, state, { 
        sidebarEnabled: action.sidebarEnabled 
      });
    case Keys.SET_APP_CONTENT_HEADER:
      const header = { 
        primary: action.primaryHeader, 
        secondary: action.secondaryHeader 
      };
      return Object.assign({ }, state, { 
        contentHeader: header 
      });
    default:
      return state;
    }
}

export default app;