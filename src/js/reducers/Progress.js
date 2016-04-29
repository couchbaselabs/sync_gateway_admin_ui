import Keys from '../actions/Keys';
import { resetProgress } from '../actions/Api';

// progress: {
//   <KEY>: { inProgress:bool, 
//            success:bool?, 
//            error:string?, 
//            status:number?, 
//            data:object?,
//            mayReset(dispatch)
//   } 
// }

export function progress(state, action) {
  let type = action && action.type;
  if (!type) 
    return undefined;

  const curProgress = state ? state.progress : undefined;
  const nuProgress = Object.assign({ }, curProgress, { 
    [type]: { 
      inProgress: action.inProgress,
      success: action.success,
      error: action.error, 
      status: action.status,
      data: action.data,
      mayReset(dispatch) {
        if (!action.inProgress) {
          dispatch(resetProgress(type));
        }
      }
    }
  });

  return { progress: nuProgress };
}

export function withProgress(state, action, successCase) {
  let newState;
  if (action.success) {
    if (typeof successCase === 'function')
      newState = successCase(state, action);
    else
      newState = successCase;
  }
  return Object.assign({ }, state, progress(state, action), newState);
}

export function tryResetProgress(state, action) {
  let progress = state && state.progress;
  if (!progress)
    return state;

  let keys = action && action.keys;
  if (!keys || keys.length == 0) 
    return state;

  const resetMap = { };
  for (let key of keys) {
    if (progress[key])
      resetMap[key] = undefined;
  }

  if (Object.keys(resetMap).length == 0)
    return state;

  progress =  Object.assign({ }, progress, resetMap);
  return Object.assign({ }, state, { progress });
}
