import Store from './Store'
import DatabaseSelectionStore from './DatabaseSelectionStore';

class DatabaseStore extends Store {
  constructor() {
    super();
    this.db = DatabaseSelectionStore.getData().database;
    DatabaseSelectionStore.addChangeListener(
      this.databaseStoreOnChange.bind(this));
  }

  databaseStoreOnChange() {
    const { database } = DatabaseSelectionStore.getData();
    if (this.db !== database) {
      const olddb = this.db;
      this.db = database;
      this.databaseOnChange(this.db);
      if (olddb && this.shouldResetWhenDatabaseChanged()) 
        this.reset();
    }
  }

  shouldResetWhenDatabaseChanged() {
    return true;
  }

  databaseOnChange(newDb) {
    // Do nothing. Subclass overrides this function.
  }
}

export default DatabaseStore;
