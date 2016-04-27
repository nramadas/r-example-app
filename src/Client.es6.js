import 'babel-polyfill';
import Client from '@r/platform/client';

import routes from './app/router/routes';
import App from './app/App';
import allReducers from './app/reducers/importAll';

Client({
  routes,
  reducers: allReducers,
  modifyData: data => {
    console.log(data);
    return data;
  },
  appComponent: <App/>,
  debug: true,
})();
