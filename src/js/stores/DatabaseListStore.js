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
    fetchAllDatabases()
      .then(result => {
        this._setNames(result.data);
        this._fetchDatabasesInfo(result.data)
      }).catch(error => {
        this._setFetchStatus(false, error);
      });
  }
  
  cancelFetchDatabases() {
    this.setData(data => {
      return Object.assign({ }, data, { 
        isFetching: false, 
        error: undefined 
      });
    });
  }
  
  _fetchDatabasesInfo(dbNames) {
    let fetches = dbNames.map(db => fetchDatabase(db));
    Promise.all(fetches)
      .then(results => {
        this._setFetchStatus(false);
        const dbInfo = { };
        for (const { data } of results) {
          dbInfo[data.db_name] = data;
        }
        this._setInfo(dbInfo);
      }).catch(error => {
        this._setFetchStatus(false, error);
      });
  }
  
  _setFetchStatus(isFetching, error) {
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
