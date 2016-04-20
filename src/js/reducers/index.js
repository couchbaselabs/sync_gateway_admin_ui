import { combineReducers } from 'redux';
import app from './AppReducer';
import database from './DatabaseReducer';
import documentList from './DocumentListReducer';
import doc from './DocumentReducer';
import revision from './RevisionReducer';

const reducers = combineReducers({
  app,
  database,
  documentList,
  document: doc,
  revision
});

export default reducers;
