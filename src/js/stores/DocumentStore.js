import Store from './Store'
import { fetchDoc } from '../api';

class DocumentStore extends Store {
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
  
  fetchDocument(db, docId) {
    this._setFetchStatus(true);

    fetchDoc(db, docId)
      .then(result => {
        this._setFetchStatus(false);
        this._setDoc(result.data);
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
