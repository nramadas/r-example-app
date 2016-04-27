import API from '@r/api-client';
import { privateAPI } from '@r/private';
import superagent from 'superagent';

const fetchLogin = (username, password) => new Promise((resolve, reject) => {
  superagent
    .post('/loginproxy')
    .send({ username, password })
    .end((err, res) => {
      if (err || !res.body) { return reject(err); }
      resolve(res.body);
    });
})

export default class Session {
  static async fromCookie(cookieStr, config) {
    const api = new (privateAPI(API))(config);
    const data = await api.convertCookiesToAuthToken(cookieStr.split(';'));

    return new Session(data);
  };

  static async fromLogin(username, password, config) {
    if (config) {
      const api = new (privateAPI(API))(config);
      const data = await api.login(username, password);

      return new Session({
        accessToken: data.access_token,
        tokenType: data.token_type,
        expires: data.expires_in,
        refreshToken: data.refresh_token,
        scope: data.scope,
      });
    } else {
      const data = await fetchLogin(username, password);
      return new Session(data.session);
    }
  };

  constructor(data) {
    Object.assign(this, data);

    if (Object.freeze) {
      Object.freeze(this);
    }
  }

  toJSON() {
    return {
      accessToken: this.accessToken,
      tokenType: this.tokenType,
      expires: this.expires,
      refreshToken: this.refreshToken,
      scope: this.scope,
    };
  }
}
