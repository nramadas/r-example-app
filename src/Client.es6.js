import 'babel-polyfill';
import Client from '@r/platform/client';

import routes from './app/router/routes';
import App from './app/App';

Client({
  routes,
  appComponent: <App/>,
  debug: true,
})();
