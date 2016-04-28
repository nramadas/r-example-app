import 'babel-polyfill';
import Server from '@r/platform/server';
import API from '@r/api-client';
import { privateAPI } from '@r/private';
import KoaStatic from 'koa-static';
import { atob } from 'Base64';

import routes from './app/router/routes';
import main from './serverTemplates/main';
import allReducers from './app/reducers/importAll';
import Session from './app/models/Session';
import * as sessionActions from './app/actions/session';

const binFiles = KoaStatic('bin');
const assetFiles = KoaStatic('assets');

const CONFIG = {
  origin: 'https://www.reddit.com',
  oauthAppOrigin: 'https://m.reddit.com',
  clientId: process.env.SECRET_OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_SECRET,
};

const COOKIE_OPTIONS = {
  // signed: true,
  httpOnly: false,
  overwrite: true,
  maxAge: 1000 * 60 * 60,
};

const AGELESS_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 1000 * 60 * 60 * 24 * 365,
};

const api = new (privateAPI(API))(CONFIG);

const writeSessionToResponse = (ctx, data) => {
  const now = new Date();

  const session = new Session({
    accessToken: data.access_token,
    tokenType: data.token_type,
    expires: now.setSeconds(now.getSeconds() + data.expires_in),
    refreshToken: data.refresh_token,
    scope: data.scope,
  });

  ctx.cookies.set('token', session.tokenString, {
    ...COOKIE_OPTIONS,
    expires: session.expires,
    maxAge: session.expires * 1000,
  });

  ctx.body = { session };
};

Server({
  routes,
  template: main,
  reducers: allReducers,
  dispatchBeforeNavigation: async (ctx, dispatch, getState, utils) => {
    try {
      const sessionData = JSON.parse(atob(ctx.cookies.get('token')));
      let session = new Session(sessionData);

      if (!session.isValid) {
        session = await session.refresh();
      }

      dispatch(sessionActions.setSession(session));
    } catch (e) {
      console.log(e);
      console.log(e.stack);
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
        const data = await api.login(username, password);
        writeSessionToResponse(ctx, data);
      } catch (e) {
        console.log(e);
        console.log(e.stack);
        ctx.throw(401, 'Incorrect username or password');
      }
    });

    router.post('/refreshproxy', async (ctx, next) => {
      const { refreshToken } = ctx.request.body;

      try {
        const data = await api.refreshToken(refreshToken);
        writeSessionToResponse(ctx, { ...data, refresh_token: refreshToken });
      } catch (e) {
        console.log(e);
        console.log(e.stack);
        ctx.throw(400, 'Error');
      }
    });

    router.post('/logout', async (ctx, next) => {
      ctx.cookies.set('token');
      ctx.redirect('/');
    });
  }
})();
