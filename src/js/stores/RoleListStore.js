import DatabaseStore from './DatabaseStore'
import { fetchRoles } from '../api';

class RoleListStore extends DatabaseStore {
  constructor() {
    super();
  }
  
  getInitialData() {
    return {
      roles: [],
      filter: undefined,
      filteredRoles: [],
      isStale: false,
      isFetching: false,
      error: undefined,
    };
  }
  
  fetchRoleList() {
    this._setFetchStatus(true);
    this.fetch = fetchRoles(this.db);
    this.fetch.p.then(result => {
      this._setRoles(result.data);
      this._setFetchStatus(false);
    })
    .catch(reason => {
      this._setFetchStatus(false, reason);
    });
  }
  
  cancelFetch() {
    if (this.fetch)
      this.fetch.cancel();
    this._setFetchStatus(false);
  }
  
  deleteRole(role) {
    let { roles, filteredRoles } = this.data;
    
    let index = roles.indexOf(role);
    if (index > -1) {
      roles = roles.slice();
      roles.splice(index, 1)
      
      index = filteredRoles.indexOf(role);
      if (index > -1) {
        filteredRoles = filteredRoles.slice();
        filteredRoles.splice(index, 1);
      }
      
      this.setData(data => {
        return Object.assign({ }, data, { 
          roles, filteredRoles, isStale: true 
        });
      });
    }
  }
  
  setStale(isStale) {
    if (this.data.isStale !== isStale) {
      this.setData(data => {
        return Object.assign({ }, data, { isStale });
      });
    }
  }
  
  setFilter(filter) {
    if (!filter || filter.length == 0) {
      this.resetFilter();
      return;
    }
    
    const filteredRoles = this._filterRoles(filter);
    this.setData(data => {
      return Object.assign({ }, data, { filter, filteredRoles });
    });
  }
  
  resetFilter() {
    if (this.data.filter) {
      this.setData(data => {
        return Object.assign({ }, data, { 
          filter: undefined, filteredRoles: [ ] 
        });
      });
    }
  }
  
  _setFetchStatus(isFetching, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
    this.setData(data => {
      return Object.assign({ }, data, { isFetching, error });
    });
  }
  
  _setRoles(roles) {  
    this.setData(data => {
      const filteredRoles = this._filterRoles(this.data.filter);
      return Object.assign({ }, data, { roles, filteredRoles, isStale: false });
    });
  }
  
  _filterRoles(filter) {
    if (!filter)
      return [ ];
    
    const { curFilter } = this.data;
    let roles;
    if (curFilter && filter && curFilter.startsWith(filter))
      roles = this.data.filteredRoles;
    else
      roles = this.data.roles;
    
    filter = filter.toLowerCase();
    return roles.filter(role => {
      return role.toLowerCase().startsWith(filter);
    });
  }
}

const instance = new RoleListStore();
export default instance;
