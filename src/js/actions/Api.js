import Axios from 'axios';
import Keys from './Keys';
import { serverApi } from '../app';
import { makeUrlPath } from '../utils';

export function setAppSidebarEnabled(enabled) {
  return { 
    type: Keys.SET_APP_SIDEBAR_ENABLED, 
    sidebarEnabled: enabled 
  };
}

export function setAppContentHeader(primary, secondary) {
  return { 
    type: Keys.SET_APP_CONTENT_HEADER, 
    primaryHeader: primary,
    secondaryHeader: secondary
  }
}

export function resetProgress(key) {
  return {
    type: Keys.RESET_PROGRESS,
    key: key
  }
}

export function fetchAllDatabases() {
  const path = makeUrlPath('_all_dbs');
  const request = Axios.get(serverApi(path));
  const types = [ 
    Keys.FETCH_ALL_DATABASES, 
    Keys.FETCH_ALL_DATABASES_SUCCESS, 
    Keys.FETCH_ALL_DATABASES_ERROR 
  ];
  return { types, request };
}

export function fetchDatabase(db) {
  const path = makeUrlPath(db);
  const request = Axios.get(serverApi(path));
  const types = [ 
    Keys.FETCH_DATABASE, 
    Keys.FETCH_DATABASE_SUCCESS, 
    Keys.FETCH_DATABASE_ERROR
  ];
  const payload = { db };
  return { types, request, payload };
}

export function fetchAllDocs(db) {
  const query = { access: true, channels: true, include_docs: true };
  const path = makeUrlPath(db, '_all_docs', query);
  const request = Axios.get(serverApi(path));
  const types = [ 
    Keys.FETCH_ALL_DOCS, 
    Keys.FETCH_ALL_DOCS_SUCCESS, 
    Keys.FETCH_ALL_DOCS_ERROR 
  ];
  const payload = { db };
  return { types, request, payload };
}

export function fetchDoc(db, docId, revId) {
  const query = { revs: true };
  if (revId) 
    query['rev'] = revId;
  const path = makeUrlPath(db, docId, query);
  const request = Axios.get(serverApi(path));
  const types = revId ? [ 
    Keys.FETCH_DOC_REV, 
    Keys.FETCH_DOC_REV_SUCCESS, 
    Keys.FETCH_DOC_REV_ERROR 
  ] : [ 
    Keys.FETCH_DOC, 
    Keys.FETCH_DOC_SUCCESS, 
    Keys.FETCH_DOC_ERROR
  ];
  const payload = { db, docId, revId };
  return { types, request, payload }
}

export function createDoc(db, doc) {
  debugger;
  const path = makeUrlPath(db, '');
  const request = Axios.post(serverApi(path), doc, { 
    headers: { 'Content-Type': 'application/json' }
  });
  const types = [ 
    Keys.CREATE_DOC, 
    Keys.CREATE_DOC_SUCCESS, 
    Keys.CREATE_DOC_ERROR 
  ];
  const payload = { db, doc };
  return { types, request, payload };
}
