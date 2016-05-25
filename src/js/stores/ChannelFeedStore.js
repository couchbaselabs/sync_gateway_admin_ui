import Store from './Store';
import { fetchChangesFeed } from '../api';

const MAX_CHANGES = 100;

class ChannelFeedStore extends Store {
  constructor(db, channel) {
    super();
    this.channel = channel;
    this.db = db;
  }
  
  getInitialData() {
    return {
      changes: undefined,
      lastSeq: 0,
      isFetching: false,
      error: undefined
    }
  }
  
  getChannel() {
    return this.channel;
  }
  
  start() {
    this.timeout = undefined;

    const params = {
      feed: 'longpoll',
      since: this.data.lastSeq,
      heartbeat: 60000
    };
    
    if (this.channel && this.channel.length > 0) {
      params['filter'] = 'sync_gateway/bychannel';
      params['channels'] = this.channel;
    }
    
    this._setFetchStatus(true);
    this.fetch = fetchChangesFeed(this.db, params);
    this.fetch.promise.then(result => {
      const { results, last_seq } = result.data;
      let nuChanges = results;
      if (nuChanges && nuChanges.length > 0) {
        nuChanges.reverse();
        if (this.data.changes) {
          nuChanges = nuChanges.concat(this.data.changes);
          if (nuChanges.length > MAX_CHANGES)
            nuChanges = nuChanges.splice(MAX_CHANGES);
        }
        this.setData(data => {
          return Object.assign({ }, data, { 
            changes: nuChanges, 
            lastSeq: last_seq 
          }, this._fetchStatus(false));
        });
      }
            
      this.timeout = setTimeout(() => {
        this.start();
      }, 0);
    }).catch(reason => {
      this._setFetchStatus(false, reason);
    });
  }
  
  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    
    if (this.fetch) {
      this.fetch.cancel();
      this.fetch = undefined;
    }
  }
  
  _fetchStatus(isFetching, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
    return { isFetching, error }; 
  }
  
  _setFetchStatus(isFetching, reason) {
    const status = this._fetchStatus(isFetching, reason);
    this.setData(data => {
      return Object.assign({ }, data, status);
    });
  }
}

// Export class not instance:
export default ChannelFeedStore; 
