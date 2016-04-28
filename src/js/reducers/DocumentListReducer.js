import Keys from '../actions/Keys';
import { withProgress, tryResetProgress } from './Progress';

const initialState = { 
  rows: undefined,      // [{ }]
  progress: { }         // See Progress.js
}

const rows = (state, action) => {
  return { 
    rows: action.data.rows 
  }
}

function documentList(state = initialState, action) {
  switch(action.type) {
    case Keys.FETCH_ALL_DOCS:
      return withProgress(state, action, rows);
    case Keys.RESET_PROGRESS:
      return tryResetProgress(state, action);
    default:
      return state;
  }
}

export default documentList;
