import makeSessionFromData from './makeSessionFromData';
import setSessionCookies from './setSessionCookies';

const writeSessionToResponse = (ctx, data) => {
  const session = makeSessionFromData(data);
  setSessionCookies(ctx, session);
  ctx.body = { session };
};
