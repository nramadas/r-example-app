import writeSessionToResponse from './writeSessionToResponse';

export default (router, api) => {
  router.post('/loginproxy', async (ctx, next) => {
    const { username, password } = ctx.request.body;

    try {
      // try to grab a session from the api
      const data = await api.login(username, password);

      // writeSessionToResponse will set the cookies
      writeSessionToResponse(ctx, data);
    } catch (e) {
      console.log(e);
      console.log(e.stack);
      ctx.throw(401, 'Incorrect username or password');
    }
  });
}
