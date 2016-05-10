import Store from './Store'
import { fetchRevision } from '../api';

class RevisionStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return { 
      rev: undefined,
      isFetching: false,
      error: undefined
    };
  }

  fetchRevision(db, docId, revId) {
    this._setFetchStatus(true);
    fetchRevision(db, docId, revId)
      .then(result => {
        this._setFetchStatus(false);
        this._setRevision(result.data);
      })
      .catch(error => {
        this._setFetchStatus(false, error);
      });
  }
  
  _setFetchStatus(isFetching, error) {
    this.setData(data => {
      return Object.assign({ }, data, { isFetching, error });
    });
  }

  _setRevision(rev) {
    this.setData(data => {
      return Object.assign({ }, data, { rev });
    });
  }
}

const instance = new RevisionStore();
export default instance;
