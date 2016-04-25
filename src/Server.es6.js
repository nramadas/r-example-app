import Server from '@r/platform/server';
import KoaStatic from 'koa-static';

import routes from './app/router/routes.es6.js';

const binFiles = KoaStatic('bin');
const assetFiles = KoaStatic('assets');

Server({
  routes,
  reducers: {},
  preRouteServerMiddleware: [
    binFiles,
    assetFiles,
  ],
});
