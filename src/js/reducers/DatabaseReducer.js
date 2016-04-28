import Keys from '../actions/Keys';
import { withProgress, tryResetProgress } from './Progress';

const initialState = { 
  dbNames: [ ],
  dbInfo: { }, 
  dbInfoStale: false,
  progress: { }         // See Progress.js
}

const dbNames = (state, action) => {
  return { 
    dbNames: action.data, 
    dbInfoStale: true 
  }
}

const dbInfo = (state, action) => {
  const { db } = action.payload;
  const dbs = Object.assign({ }, state.dbs, { 
    [db]: action.data 
  });
  return { 
    dbInfo: dbs, 
    dbInfoStale: false 
  }
}

function database(state = initialState, action) {
  switch(action.type) {
    case Keys.FETCH_ALL_DATABASES:
      return withProgress(state, action, dbNames);
    case Keys.FETCH_DATABASE:
      return withProgress(state, action, dbInfo);
    case Keys.RESET_PROGRESS:
      return tryResetProgress(state, action);
    default:
      return state;
  }
}

export default database;
