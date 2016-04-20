import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

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
import App from './components/App';
import DatabaseList from './components/DatabaseList';
import Database from './components/Database';
import Documents from './components/Documents';
import DocumentList from './components/DocumentList';
import DocumentNew from './components/DocumentNew';
import Document from './components/Document';
import Revision from './components/Revision';

const store = createStore(reducers, applyMiddleware(thunk));

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={DatabaseList}/>
        <Route path='/:db' component={Database}>
          <IndexRedirect to='/:db/documents' />
          <Route path='/:db/documents' component={Documents}>
            <IndexRoute component={DocumentList} />
            <Route path='/:db/documents/new' component={DocumentNew}/>
            <Route path='/:db/documents/:docId' component={Document}>
              <Route path='/db:/documents/:docId/:revId' component={Revision}/>
            </Route>
          </Route>          
        </Route>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
