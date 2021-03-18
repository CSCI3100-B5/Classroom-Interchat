const { compose } = require('compose-middleware');
const expressJwt = require('express-jwt');
const config = require('../config/config');

// compose-middleware is used in case further auth checks are required after jwt

module.exports = {
  requireAccessToken: compose([
    expressJwt({
      secret: config.accessTokenSecret,
      algorithms: ['HS256'],
      userProperty: 'payload'
    })
  ]),
  requireRefreshToken: compose([
    expressJwt({
      secret: config.refreshTokenSecret,
      algorithms: ['HS256'],
      userProperty: 'payload'
    })
  ]),
};
