import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router';
import { browserHistory } from './app'

// CSS:
import '../assets/css/main.css'

// Bootstrap:
import 'bootstrap/dist/css/bootstrap.css';

// Font-awesome for AdminLTE
import 'font-awesome/css/font-awesome.css';

// AdminLTE:
import '../../vendors/AdminLTE/css/AdminLTE.css';
import '../../vendors/AdminLTE/css/skins/_all-skins.css';
import '../../vendors/AdminLTE/js/app.js';

// Redux:
import { createStore, applyMiddleware } from 'redux';
import thunk from './actions/Thunk';
import reducers from './reducers';

// Route Components:
// - App:
import App from './components/app/App';
// - Databases:
import DatabasesPage from './components/databases/DatabasesPage';
import DatabaseList from './components/databases/DatabaseList';
import Database from './components/databases/Database';
import DocumentsPage from './components/databases/DocumentsPage';
import DocumentList from './components/databases/DocumentList';
import DocumentNew from './components/databases/DocumentNew';
import Document from './components/databases/Document';
import Revision from './components/databases/Revision';
import ChannelsPage from './components/databases/ChannelsPage';
import UsersPage from './components/databases/UsersPage';

// Redux Store:
const store = createStore(reducers, applyMiddleware(thunk));

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/databases'/>
        /* > Databases: */
        <Route path='/databases' component={DatabasesPage}>
          <IndexRoute component={DatabaseList} />
          <Route path='/databases/:db' component={Database}>
            <IndexRedirect to='/databases/:db/documents' />
            /* >> Documents: */
            <Route path='/databases/:db/documents' component={DocumentsPage}>
              <IndexRoute component={DocumentList} />
              <Route path='/databases/:db/documents/new' component={DocumentNew}/>
              <Route path='/databases/:db/documents/:docId' component={Document}>
                <Route path='/databases/db:/documents/:docId/:revId' component={Revision}/>
              </Route>
            </Route>
            /* >> Channels: */
            <Route path='/databases/:db/channels' component={ChannelsPage}></Route>
            /* >> Users: */
            <Route path='/databases/:db/users' component={UsersPage}></Route>
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
