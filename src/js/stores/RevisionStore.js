import DatabaseStore from './DatabaseStore'
import { fetchRevision } from '../api';

class RevisionStore extends DatabaseStore {
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

  fetchRevision(docId, revId) {
    this._setFetchStatus(true, undefined);
    this.fetch = fetchRevision(this.db, docId, revId);
    this.fetch.promise.then(result => {
      this._setRevision(result.data);
      this._setFetchStatus(false);
    })
    .catch(reason => {
      console.log('fetchRev Error:' + reason);
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
