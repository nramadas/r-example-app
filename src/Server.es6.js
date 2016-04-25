import 'babel-polyfill';
import Server from '@r/platform/server';
import KoaStatic from 'koa-static';

import routes from './app/router/routes';

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
