import DatabaseStore from './DatabaseStore'
import { fetchDoc } from '../api';

class DocumentStore extends DatabaseStore {
  constructor() {
    super();
  }
  
  getInitialData() {
    return { 
      doc: undefined,
      history: undefined,
      isFetching: false,
      error: undefined
    };
  }
  
  fetchDocument(docId) {
    this._setFetchStatus(true);
    this.fetch = fetchDoc(this.db, docId);
    this.fetch.promise.then(result => {
      this._setDoc(result.data);
      this._setFetchStatus(false);
    })
    .catch(reason => {
      this._setFetchStatus(false, reason);
    });
  }
  
  cancelFetchDocument() {
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
  
  _setDoc(doc) {
    let seq = doc._revisions.start;
    const history = doc._revisions.ids.map(id => {
      const revId = ((seq--) + '-' + id);
      return revId;
    })
    
    this.setData(data => {
      return Object.assign({ }, data, { doc, history });
    });
  }
}

const instance = new DocumentStore();
export default instance;
