import Keys from '../actions/Keys';

const initialState = { 
  // rows: [ ]
}

function documentList(state = initialState, action) {
  switch(action.type) {
    case Keys.FETCH_ALL_DOCS_SUCCESS:
      return Object.assign({ }, state, { 
        rows: action.data.rows 
      });
    default:
      return state;
  }
}

export default documentList;