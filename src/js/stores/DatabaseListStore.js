import Store from './Store'

class DatabaseListStore extends Store {
  constructor() {
    super();
    this.data = {
      names: [],
      info: {}
    };
  }

  setNames(names) {
    this.setData(data => {
      return Object.assign({ }, data, { names });
    });
  }

  setInfo(info) {
    this.setData(data => {
      return Object.assign({ }, data, { names });
    });
  }

  getNames() {
    const { names } = this.data;
    if (names)
      return names.slice();
    else
      return [ ];
  }

  getInfo() {
    const { info } = this.data;
    if (info)
      return Object.assign({ }, info);
    else
      return { };
  }
}

const instance = new DatabaseListStore();
export default instance;
