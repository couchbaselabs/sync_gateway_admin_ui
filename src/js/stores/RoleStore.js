import Store from './Store'
import { fetchRole as fetchRoleApi } from '../api';

class RoleStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return {
      role: undefined
    };
  }
  
  fetchRole(db, role) {
    this.cancelFetch();
    
    const { role:curRole } = this.data;
    if (curRole && curRole.name != role)
      this.reset();
      
    this._setFetchStatus(true);
    this.fetch = fetchRoleApi(db, role);
    this.fetch.p.then(result => {
      this._setRole(result.data);
      this._setFetchStatus(false);
    })
    .catch(reason => {
      this._setFetchStatus(false, reason);
    });
  }
  
  cancelFetch() {
    if (this.data.isFetching) {
      this.fetch && this.fetch.cancel();
      this._setFetchStatus(false);
    }
  }
  
  _setFetchStatus(isFetching, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
    this.setData(data => {
      return Object.assign({ }, data, { isFetching, error });
    });
  }
  
  _setRole(role) {
    this.setData(data => {
      return Object.assign({ }, data, { role });
    });
  }
}

const instance = new RoleStore();
export default instance;
