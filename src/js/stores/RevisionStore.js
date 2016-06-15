import DatabaseStore from './DatabaseStore'
import { fetchRevision as fetchRevisionApi } from '../api';

class RevisionStore extends DatabaseStore {
  constructor() {
    super();
    this.cache = { };
  }
  
  getInitialData() {
    return { 
      rev: undefined,
      isFetching: false,
      error: undefined
    };
  }

  reset() {
    super.reset();
    this.cache = { };
  }

  fetchRevision(docId, revId) {
    const cached = this._getCachedRevision(docId, revId);
    if (cached) {
      this._setRevision(docId, revId, cached);
      return;
    }

    this._setFetchStatus(true, undefined);
    this.fetch = fetchRevisionApi(this.db, docId, revId);
    this.fetch.promise.then(result => {
      this._setRevision(docId, revId, result.data);
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

  _setRevision(docId, revId, rev) {
    this.setData(data => {
      return Object.assign({ }, data, { rev });
    });
    this._cacheRevision(docId, revId, rev);
  }

  _getCacheKey(docId, revId) {
    return docId + '/' + revId;
  }

  _getCachedRevision(docId, revId) {
    const key = this._getCacheKey(docId, revId);
    return this.cache[key];
  }

  _cacheRevision(docId, revId, rev) {
    const key = this._getCacheKey(docId, revId);
    this.cache[key] = rev;
  }
}

const instance = new RevisionStore();
export default instance;
