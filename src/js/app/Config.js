const config = {
  baseURLPath() {
    return '/';
  },
  serverURL() {
    return 'http://localhost:4985';
  }
};
export default config;

export function serverApi(path) {
  var endpoint = config.serverURL();
  if (path)
      endpoint += path;
  return endpoint;
}
