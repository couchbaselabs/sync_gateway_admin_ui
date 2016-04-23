import { createHistory, useBasename } from 'history';
import { useRouterHistory } from 'react-router';
import Config from './Config';

const browserHistory = useRouterHistory(useBasename(createHistory))({
  basename: '/'
});

export default browserHistory;
