import Keys from '../actions/Keys';
import { withProgress, tryResetProgress } from './Progress';

const initialState = {
  docs: { },            // { <docId>: { } },
  progress: { }         // See Progress.js 
}

const docs = (state, action) => {
  const docs = Object.assign({ }, state.docs, {
    [action.payload.docId]: action.data
  }); 
  return { docs };
}

const document = (state = initialState, action) => {
  switch(action.type) {
    case Keys.FETCH_DOC:
      return withProgress(state, action, docs);
    case Keys.CREATE_DOC:
      return withProgress(state, action);
    case Keys.RESET_PROGRESS:
      return tryResetProgress(state, action);
    default:
      return state;
  }
}

export default document;
