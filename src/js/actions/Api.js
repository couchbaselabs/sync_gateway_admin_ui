import Axios from 'axios';
import Keys from './Keys';
import { serverApi } from '../app';
import { makePath } from '../utils';

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

export function resetProgress(...keys) {
  return {
    type: Keys.RESET_PROGRESS,
    keys: keys
  }
}

export function fetchAllDatabases() {
  const type = Keys.FETCH_ALL_DATABASES;
  const path = makePath('_all_dbs');
  const request = Axios.get(serverApi(path));
  return { type, request };
}

export function fetchDatabase(db) {
  const type = Keys.FETCH_DATABASE;
  const path = makePath(db);
  const request = Axios.get(serverApi(path));
  const payload = { db };
  return { type, request, payload };
}

export function fetchAllDocs(db) {
  const type = Keys.FETCH_ALL_DOCS;
  const query = { access: true, channels: true, include_docs: true };
  const path = makePath(db, '_all_docs', query);
  const request = Axios.get(serverApi(path));
  const payload = { db };
  return { type, request, payload };
}

export function fetchDoc(db, docId) {
  const type = Keys.FETCH_DOC;
  const query = { revs: true };
  const path = makePath(db, docId, query);
  const request = Axios.get(serverApi(path));
  const payload = { db, docId };
  return { type, request, payload }
}

export function resetFetchDocProgress() {
  return resetProgress(Keys.FETCH_DOC);
}

export function fetchDocRev(db, docId, revId) {
  const type = Keys.FETCH_DOC_REV;
  const query = { revs: true, rev: revId };
  const path = makePath(db, docId, query);
  const request = Axios.get(serverApi(path));
  const payload = { db, docId, revId };
  return { type, request, payload }
}

export function createDoc(db, json) {
  const type = Keys.CREATE_DOC;
  const path = makePath(db, '');
  const request = Axios.post(serverApi(path), json, { 
    headers: { 'Content-Type': 'application/json' }
  });
  const payload = { db, json };
  return { type, request, payload };
}

export function updateDoc(db, docId, revId, json) {
  const type = Keys.UPDATE_DOC;
  const query = { rev: revId };
  const path = makePath(db, docId, query);
  const body = Object.assign({ }, json, { _id: undefined, _rev: undefined });
  const request = Axios.put(serverApi(path), body, {
    headers: { 'Content-Type': 'application/json' }
  });
  const payload = { db, docId, revId, body };
  return { type, request, payload };
}

export function resetUpdateDocProgress() {
  return resetProgress(Keys.UPDATE_DOC);
}

export function deleteDoc(db, docId, revId) {
  const type = Keys.DELETE_DOC;
  const query = { rev: revId };
  const path = makePath(db, docId, query);
  const request = Axios.delete(serverApi(path));
  const payload = { db, docId, revId };
  return { type, request, payload }; 
}
