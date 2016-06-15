import Store from './Store';

class DatabaseSelectionStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return { 
      database: undefined
    } 
  }

  setDatabase(database) {
    this.setData(data => {
      return { database };
    });
  }
}

const instance = new DatabaseSelectionStore();
export default instance;
