import Store from './Store'
import { fetchUsers } from '../api';

class UserListStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return {
      users: [],
      filter: undefined,
      filteredUsers: [],
      isStale: false,
      isFetching: false,
      error: undefined,
    };
  }
  
  fetchUserList(db) {
    this._setFetchStatus(true);
    this.fetch = fetchUsers(db);
    this.fetch.p.then(result => {
      this._setUsers(result.data);
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
  
  deleteUser(user) {
    let { users, filteredUsers } = this.data;
    
    let index = users.indexOf(user);
    if (index > -1) {
      users = users.slice();
      users.splice(index, 1)
      
      index = filteredUsers.indexOf(user);
      if (index > -1) {
        filteredUsers = filteredUsers.slice();
        filteredUsers.splice(index, 1);
      }
      
      this.setData(data => {
        return Object.assign({ }, data, { 
          users, filteredUsers, isStale: true 
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
    
    const filteredUsers = this._filterUsers(filter);
    this.setData(data => {
      return Object.assign({ }, data, { filter, filteredUsers });
    });
  }
  
  resetFilter() {
    if (this.data.filter) {
      this.setData(data => {
        return Object.assign({ }, data, { 
          filter: undefined, filteredUsers: [ ] 
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
  
  _setUsers(users) {  
    this.setData(data => {
      const filteredUsers = this._filterUsers(this.data.filter);
      return Object.assign({ }, data, { users, filteredUsers, isStale: false });
    });
  }
  
  _filterUsers(filter) {
    if (!filter)
      return [ ];
      
    const { curFilter } = this.data;
    let users;
    if (curFilter && filter && curFilter.startsWith(filter))
      users = this.data.filteredUsers;
    else
      users = this.data.users;
    
    filter = filter.toLowerCase();
    return users.filter(user => {
      return user.toLowerCase().startsWith(filter);
    });
  }
}

const instance = new UserListStore();
export default instance;
