import Store from './Store'
import { fetchUser as fetchUserApi } from '../api';

class UserStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return {
      user: undefined
    };
  }
  
  fetchUser(db, user) {
    this.cancelFetch();
    
    const { user:curUser } = this.data;
    if (curUser && curUser.name != user)
      this.reset();
      
    this._setFetchStatus(true);
    this.fetch = fetchUserApi(db, user);
    this.fetch.p.then(result => {
      this._setUser(result.data);
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
  
  _setUser(user) {
    this.setData(data => {
      return Object.assign({ }, data, { user });
    });
  }
}

const instance = new UserStore();
export default instance;
