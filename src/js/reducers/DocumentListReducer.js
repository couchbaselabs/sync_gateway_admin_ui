import Keys from '../actions/Keys';
import { withProgress, tryResetProgress } from './Progress';

const initialState = { 
  curPage: undefined,         // number
  pageSize: undefined,        // number
  startKeys: undefined,       // [string]
  rows: undefined,            // [{ }]
  progress: { }               // See Progress.js
}

const docs = (state, action) => {
  let { startKeys } = state;
  let { rows } = action.data;
  const { page = 0, pageSize } = action.payload;
  
  if (rows && rows.length > 0) {
    if (page === 0)
      startKeys = [ undefined ];
    else {
      startKeys = startKeys.slice(0, page);
      startKeys.push(rows[0].id);
    }

    if (rows.length > pageSize) {
      startKeys.push(rows[pageSize].id);
      rows = rows.slice(0, -1);
    }
  } else {
    startKeys = [];
  }

  return { 
    curPage: page,
    pageSize,
    startKeys,
    rows
  }
}

function documentList(state = initialState, action) {
  switch(action.type) {
    case Keys.FETCH_DOCS:
      return withProgress(state, action, docs);
    case Keys.RESET_DOCS:
      return Object.assign({ }, { progress: state.progress });
    case Keys.RESET_PROGRESS:
      return tryResetProgress(state, action);
    default:
      return state;
  }
}

export default documentList;
