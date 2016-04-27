import 'babel-polyfill';
import Server from '@r/platform/server';
import KoaStatic from 'koa-static';

import routes from './app/router/routes';
import main from './serverTemplates/main';
import allReducers from './app/reducers/importAll';
import Session from './app/models/Session';
import * as sessionActions from './app/actions/session';

const binFiles = KoaStatic('bin');
const assetFiles = KoaStatic('assets');

const CONFIG = {
  oauthAppOrigin: 'https://m.reddit.com',
  clientId: process.env.SECRET_OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_SECRET,
};

Server({
  routes,
  template: main,
  reducers: allReducers,
  dispatchBeforeNavigation: async (ctx, dispatch, getState, utils) => {
    try {
      const cookies = ctx.request.headers.cookie;
      const response = await Session.fromCookie(cookies, CONFIG);
      dispatch(sessionActions.setSession(response));
    } catch (e) {
      // ignore for now.
    }
  },
  preRouteServerMiddleware: [
    binFiles,
    assetFiles,
  ],
  getServerRouter: router => {
    router.post('/loginproxy', async (ctx, next) => {
      const { username, password } = ctx.request.body;

      try {
        ctx.body = {
          session: await Session.fromLogin(username, password, CONFIG),
        };
      } catch (e) {
        ctx.throw(401, 'Incorrect username or password');
      }
    })
  }
})();
