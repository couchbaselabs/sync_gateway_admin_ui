function thunk({ dispatch, getState }) {
  return (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    let { request, types, payload } = action;
    if (!request && !types) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    payload = payload || { };

    dispatch(Object.assign({ }, { 
      type: REQUEST, 
      payload
    }));

    return request
      .then((res) => {
        dispatch(Object.assign({ }, { 
          type: SUCCESS, 
          data: res.data, 
          status: res.status,
          payload
        }));
      })
      .catch((error) => {
        console.log("Error occurred when dispatching the request: " + error);
        dispatch(Object.assign({ }, { 
          type: FAILURE,
          error: error,
          data: error.data, 
          status: error.status, 
          payload
        }));
      });
  };
}

export default thunk;
