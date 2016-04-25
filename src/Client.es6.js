import Client from '@r/platform/client';

import routes from './app/router/routes.es6.js';
import App from './app/App';

Client({
  routes,
  appComponent: <App/>,
  debug: true,
})();
