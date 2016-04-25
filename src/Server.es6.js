import 'babel-polyfill';
import Server from '@r/platform/server';
import KoaStatic from 'koa-static';

import routes from './app/router/routes';
import main from './serverTemplates/main';

const binFiles = KoaStatic('bin');
const assetFiles = KoaStatic('assets');

Server({
  routes,
  template: main,
  preRouteServerMiddleware: [
    binFiles,
    assetFiles,
  ],
})();
