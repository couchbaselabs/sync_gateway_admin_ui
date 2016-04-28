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
