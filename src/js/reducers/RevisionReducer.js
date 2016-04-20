import Keys from '../actions/Keys';

const initialState = { 
  // <docId>: { 
  //   revId: string
  //   revs: { <revId>: { }  }
  // }
}

function revision(state = initialState, action) {
  switch(action.type) {
    case Keys.FETCH_DOC_REV: {
      const { docId, revId } = action.payload;
      const docRevs = Object.assign({ }, state[docId], { 
        revId 
      });
      return Object.assign({ }, state, { 
        [docId]: docRevs 
      });
    }
    case Keys.FETCH_DOC_REV_SUCCESS: {
      const { docId, revId } = action.payload;
      const currentDocRevs = state[docId];
      const currentRevs = currentDocRevs && currentDocRevs.revs;
      const revs = Object.assign({ }, currentRevs, { 
        [revId]: action.data 
      });
      const docRevs = Object.assign({ }, currentDocRevs, { revs });
      return Object.assign({ }, state, { 
        [docId]: docRevs 
      });
    }
    default:
      return state;
  }
}

export default revision;