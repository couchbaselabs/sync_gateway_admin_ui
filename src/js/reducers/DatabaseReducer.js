import Keys from '../actions/Keys';

const initialState = { 
  dbNames: [ ],
  dbInfo: { }, 
  dbInfoStale: false
}

function database(state = initialState, action) {
  switch(action.type) {
    case Keys.FETCH_ALL_DATABASES_SUCCESS:
      return Object.assign({ }, state, { 
        dbNames: action.data, 
        dbInfoStale: true 
      });
    case Keys.FETCH_DATABASE_SUCCESS:
      const { db } = action.payload;
      const dbs = Object.assign({ }, state.dbs, { 
        [db]: action.data 
      });
      return Object.assign({ }, state, { 
        dbInfo: dbs, 
        dbInfoStale: false 
      });
    default:
      return state;
  }
}

export default database;
