export function makePath(...comps) {
  let paths = comps;
  
  let query = null;
  if (paths.length > 0 && typeof paths[paths.length - 1] === 'object') {
    query = paths.pop();
  }
  
  let path = paths.length > 0 ? '/' + paths.join('/') : '';
  if (query) {
    let keys = Object.keys(query);
    if (keys.length > 0)
      path += '?' + keys.map((k) => k + '=' + query[k]).join('&');
  }
  return path;
}

export function paramsOrProps(props) {
  return props ? (props.params || props) : props;
}

export function truncateString(str, size, ellipsis = '') {
  return str && str.length > size ? str.substr(0, size - 1) + ellipsis : str;
}

export function createProgress(state, key, status, action) {
  if (!key) return null;
  const curProgress = state ? state.progress : null;
  let nuProgress = null;
  if (status === 0) {
    nuProgress = Object.assign({ }, curProgress, { 
      [key]: { 
        inProgress: true
      }
    });
  } else if (status > 0) {
    nuProgress = Object.assign({ }, curProgress, { 
      [key]: { 
        inProgress: false, 
        success: true, 
        status: action.status, 
        data: action.data 
      }
    });
  } else {
    nuProgress = Object.assign({ }, curProgress, { 
      [key]: { 
        inProgress: false, 
        success: false,
        error: action.error, 
        status: action.status,
        data: action.data
      }
    });
  }
  return nuProgress;
}

export function resetProgress(state, key) {
  if (!key) return null;
  const curProgress = state ? state.progress : null;
  let nuProgress = Object.assign({ }, curProgress, { 
      [key]: null
  });
  return nuProgress;
}
