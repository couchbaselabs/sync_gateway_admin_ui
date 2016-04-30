import { Keys } from '../actions';

const initialState = { 
  contentHeader: { /* 
    primary:string, 
    secondary:string */ 
  }
}

function app(state = initialState, action) {
  switch(action.type) {
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