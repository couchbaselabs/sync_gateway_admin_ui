import { EventEmitter } from 'events';

const EVENT = 'change';

class Store extends EventEmitter {
  emitChange() {
    this.emit(EVENT);
  }

  addListener(listener) {
    this.on(EVENT, listener);
  }

  removeListener(listener) {
    this.removeListener(EVENT, listener);
  }
}

export default Store;
