import Keys from '../actions/Keys';
import { createProgress, resetProgress } from '../utils';

const initialState = {
  docs: { },
  progress: { } 
  // docs: { <docId>: { } },
  // progress: {
  //   <KEY>: { inProgress:bool, success:bool?, error:string?, 
  //            status:number?, data:object? } 
  // }
}

function document(state = initialState, action) {
  switch(action.type) {
    case Keys.RESET_PROGRESS: {
      if (state.progress[action.key]) {
          const progress = resetProgress(state, Keys.FETCH_DOC);
          return Object.assign({ }, state, { progress });  
      }
    }
    case Keys.FETCH_DOC: {
      const progress = createProgress(state, Keys.FETCH_DOC, 0);
      return Object.assign({ }, state, { progress });
    }
    case Keys.FETCH_DOC_SUCCESS: {
      const progress = createProgress(state, Keys.FETCH_DOC, 1, action);
      const docs = Object.assign({ }, state.docs, {
        [action.payload.docId]: action.data
      }); 
      return Object.assign({ }, state, { progress, docs });
    }
    case Keys.FETCH_DOC_ERROR: {
      const progress = createProgress(state, Keys.FETCH_DOC, -1, action);
      return Object.assign({ }, state, { progress });
    }
    //
    case Keys.CREATE_DOC: {
      const progress = createProgress(state, Keys.CREATE_DOC, 0);
      return Object.assign({ }, state, { progress });
    }
    case Keys.CREATE_DOC_SUCCESS: {
      const progress = createProgress(state, Keys.CREATE_DOC, 1, action);
      return Object.assign({ }, state, { progress });
    }
    case Keys.CREATE_DOC_ERROR: {
      const progress = createProgress(state, Keys.CREATE_DOC, -1, action);
      return Object.assign({ }, state, { progress });
    }
    default:
      return state;
  }
}

export default document;