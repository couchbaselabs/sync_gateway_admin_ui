import Store from './Store'
import { fetchAllDatabases, fetchDatabase } from '../api';

class DatabaseListStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return {
      dbNames: [],
      dbInfo: {},
      isFetching: false,
      error: undefined
    };
  }
  
  fetchDatabases() {
    this._setFetchStatus(true);
    this.fetch = fetchAllDatabases();
    this.fetch.promise.then(result => {
      this._setNames(result.data);
      this._fetchDatabasesInfo(result.data)
    }).catch(reason => {
      this._setFetchStatus(false, reason);
    });
  }
  
  cancelFetchDatabases() {
    if (this.fetch) 
      this.fetch.cancel();
      
    if (this.dbInfoFetches) {
      this.dbInfoFetches.forEach(fetch => {
        fetch.cancel();
      })
    }
    
    this._setFetchStatus(false);
  }
  
  _fetchDatabasesInfo(dbNames) {
    this.dbInfoFetches = dbNames.map(db => fetchDatabase(db));
    let promises = this.dbInfoFetches.map(fetch => fetch.promise);
    Promise.all(promises)
      .then(results => {
        const dbInfo = { };
        for (const { data } of results) {
          dbInfo[data.db_name] = data;
        }
        this._setInfo(dbInfo);
        this._setFetchStatus(false);
      }).catch(reason => {
        this._setFetchStatus(false, reason);
      });
  }
  
  _setFetchStatus(isFetching, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
    this.setData(data => {
      return Object.assign({ }, data, { isFetching, error });
    });
  }  

  _setNames(dbNames) {
    this.setData(data => {
      return Object.assign({ }, data, { dbNames });
    });
  }

  _setInfo(dbInfo) {
    this.setData(data => {
      return Object.assign({ }, data, { dbInfo });
    });
  }
}

const instance = new DatabaseListStore();
export default instance;
