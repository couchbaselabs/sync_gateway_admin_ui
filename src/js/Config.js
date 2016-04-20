const config = {
  remote() {
    return 'http://localhost:4985';
  },
  endpoint(path) {
    var endpoint = this.remote();
    if (path)
      endpoint += path;
    return endpoint;
  }
};

export default config;
