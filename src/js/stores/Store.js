import { EventEmitter } from 'events';

const EVENT = 'change';

class Store extends EventEmitter {
  emitChange() {
    this.emit(EVENT);
  }

  addChangeListener(listener) {
    this.on(EVENT, listener);
  }

  removeChangeListener(listener) {
    super.removeListener(EVENT, listener);
  }
  
  setData(update) {
    this.data = update(this.data);
    this.emitChange();
  }
  
  getData() {
    return Object.assign({ }, this.data);
  }
}

export default Store;
