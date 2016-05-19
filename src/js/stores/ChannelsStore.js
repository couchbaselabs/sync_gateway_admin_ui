import Store from './Store';
import ChannelFeedStore from './ChannelFeedStore';

class ChannelsStore extends Store {
  constructor() {
    super();
  }
  
  getInitialData() {
    return { 
      feeds: [ ] // Array of ChannelFeedStore objects
    } 
  }
  
  reset() {
    this._stopAllChannelFeeds();
    this.setData(data => {
      return this.getInitialData();
    });
  }
  
  setDatabase(db) {
    if (this.db && this.db !== db)
      reset();
    this.db = db;
  }
  
  getExistingChannelFeed(name) {
    const chName = name || ''; 
    const { feeds } = this.data;
    return feeds.find(feed => {
      return feed.getChannel() === chName;
    });
  }
  
  getChannelFeed(name) {
    const chName = name || '';
    let feed = this.getExistingChannelFeed(chName);
    if (!feed) {
      feed = new ChannelFeedStore(this.db, name);
      this.setData(data => {
        let { feeds } = this.data;
        feeds = feeds.slice();
        feeds.push(feed);
        return Object.assign({ }, data, { feeds });
      });
    }
    return feed;
  }
  
  removeChannelFeed(name) {
    const chName = name || '';
    let { feeds } = this.data;
    const index = feeds.findIndex(feed => {
      return feed.getChannel() === chName;
    });
    
    if (index > -1) {
      const feed = feeds[index];
      feed.stop();
        
      this.setData(data => {
        feeds = feeds.slice();
        feeds.splice(index, 1);
        return Object.assign({ }, data, { feeds });
      });
    }
  }
  
  reorderChannelFeed(name, offset) {
    const chName = name || '';
    let { feeds } = this.data;
    const index = feeds.findIndex(feed => {
      return feed.getChannel() === chName;
    });
    
    if (index > -1) {
      let nuIndex = index + offset;
      if (nuIndex < 0)
        nuIndex = 0
      else if (nuIndex >= feeds.length)
        nuIndex = feeds.length
      
      this.setData(data => {
        feeds = feeds.slice();
        const moved = feeds.splice(index, 1);
        feeds.splice(nuIndex, 0, moved);
        return Object.assign({ }, data, { feeds });
      });
    }
  }
  
  _stopAllChannelFeeds() {
    const { feeds } = this.data;  
    feeds.forEach(feed => {
      feed.stop();
    })
  }
}

const instance = new ChannelsStore();
export default instance;
