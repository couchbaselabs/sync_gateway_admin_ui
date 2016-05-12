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
    this.fetch = fetchRevision(db, docId, revId);
    this.fetch.promise.then(result => {
      this._setFetchStatus(false);
      this._setRevision(result.data);
    })
    .catch(reason => {
      this._setFetchStatus(false, reason);
    });
  }
  
  cancelFetchRevision() {
    if (this.fetch)
      this.fetch.cancel();
    this._setFetchStatus(false);
  }
  
  _setFetchStatus(isFetching, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
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
