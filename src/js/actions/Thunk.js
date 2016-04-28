function thunk({ dispatch, getState }) {
  return next => action => {
    if (typeof action === 'function')
      return action(dispatch, getState);

    let { request } = action;
    if (!request)
      return next(action);

    let { type, payload } = action;
    payload = payload || { };

    dispatch(Object.assign({ }, { 
      type,
      payload,
      inProgress: true
    }));

    request
      .then((res) => {
        dispatch(Object.assign({ }, { 
          type,
          payload,
          inProgress: false,
          success: true,
          status: res.status,
          data: res.data,
        }));
      })
      .catch((error) => {
        console.log(`Error dispatching action ${type}: ${error}`);
        dispatch(Object.assign({ }, { 
          type,
          payload,
          inProgress: false,
          success: false,
          error: error,
          status: error.status, 
          data: error.data
        }));
      });

    return { type };
  };
}

export default thunk;
