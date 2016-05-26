// Polyfill:
import 'babel-polyfill'

// react and releated modules:
import React from 'react';
import { render } from 'react-dom';

// react-router:
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router';
import { browserHistory } from './app'

// Bootstrap:
import 'bootstrap/dist/css/bootstrap.css';

// Font-awesome for AdminLTE
import 'font-awesome/css/font-awesome.css';

// AdminLTE:
import '../../vendors/AdminLTE/css/AdminLTE.css';
import '../../vendors/AdminLTE/css/skins/_all-skins.css';
import '../../vendors/AdminLTE/js/app.js';

// CSS:
import '../assets/css/main.css'

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
import RevisionEdit from './components/databases/RevisionEdit';
import ChannelsPage from './components/databases/ChannelsPage';
import UsersPage from './components/databases/UsersPage';
import User from './components/databases/User';
import UserEdit from './components/databases/UserEdit';

render((
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
              <Route path='/databases/:db/documents/:docId/:revId' component={Revision}/>
              <Route path='/databases/:db/documents/:docId/:revId/edit' component={RevisionEdit}/>
            </Route>
          </Route>
          /* >> Channels: */
          <Route path='/databases/:db/channels' component={ChannelsPage}></Route>
          /* >> Users: */
          <Route path='/databases/:db/users' component={UsersPage}>
            <Route path='/databases/:db/users/_new' component={UserEdit}/>
            <Route path='/databases/:db/users/:userId' component={User}/>
            <Route path='/databases/:db/users/:userId/edit' component={UserEdit}/>
          </Route>
        </Route>
      </Route>
    </Route>
  </Router>
), document.getElementById('app'));
