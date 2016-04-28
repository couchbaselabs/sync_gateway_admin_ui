import Keys from '../actions/Keys';
import { withProgress, tryResetProgress } from './Progress';

const initialState = { 
  docs: { },            // <docId> : { <revId>: { } }
  progress: { }         // See Progress.js
}

const docs = (state, action) => {
  const { docId, revId } = action.payload;
  const curDocs = state.docs;
  const revs = Object.assign({ }, curDocs[docId], { [revId]: action.data });
  const docs = Object.assign({ }, curDocs, { [docId]: revs });
  return { docs };
}

const revision = (state = initialState, action) => {
  switch(action.type) {
    case Keys.FETCH_DOC_REV:
      return withProgress(state, action, docs);
    case Keys.UPDATE_DOC:
      return withProgress(state, action);
    case Keys.RESET_PROGRESS:
      return tryResetProgress(state, action);
    default:
      return state;
  }
}

export default revision;
