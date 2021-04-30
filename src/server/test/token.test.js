// require mongoose to directly access the database
const mongoose = require('mongoose');

// mocha is our testing library
const {
  describe, beforeEach, it
} = require('mocha');

// require our database model
const httpStatus = require('http-status');
const User = require('../models/user.model');
const Token = require('../models/token.model');

// require our server
// this represents our entire backend
const server = require('../index');

// require the setup file, which sets up chai for us
// chai helps us verify test results
const { should, chai } = require('./setup');


// this describe block wraps all tests related to "token"
describe('Token', () => {
  let user;
  let accessToken;
  let token;

  // things to do "beforeEach" test
  beforeEach(async () => {
    // Before each test we empty the database
    await User.deleteMany({}).exec();
    await Token.deleteMany({}).exec();
    // then create a new user
    user = await User.create({
      name: 'test user',
      email: 'test@default.com',
      isAdmin: false,
      password: 'none',
      emailVerification: 'sample-verification'
    });
    await user.setPassword('password');

    token = await Token.create({
      createdBy: user,
      receivedBy: user,
      value: 'test value'
    });

    const res = await chai.request(server.app)
      .post('/api/auth/login')
      .send({ email: 'test@default.com', password: 'password' });
    res.should.have.status(200);
    res.body.should.have.property('accessToken');
    ({ accessToken } = res.body);
  });

  describe('GET /api/token/:userId', () => {
    it('valid details', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .get(`/api/token/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      res.should.have.status(200);
      res.body.should.have.property('created');
      res.body.created.should.have.a.lengthOf(1);
      res.body.should.have.property('received');
      res.body.received.should.have.a.lengthOf(1);
    });

    it('invalid user id', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .get('/api/token/123456789012345678901234')
        .set('Authorization', `Bearer ${accessToken}`);
      res.should.have.status(404);
    });

    it('no access token provided', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .get(`/api/token/${user.id}`);
      res.should.have.status(401);
    });
  });

  describe('PATCH /api/token/:tokenId/invalidate', () => {
    it('valid details', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/token/${token.id}/invalidate`)
        .set('Authorization', `Bearer ${accessToken}`);
      res.should.have.status(200);
      res.body.should.have.property('isValid', false);
    });

    it('invalid token id', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch('/api/token/123456789012345678901234/invalidate')
        .set('Authorization', `Bearer ${accessToken}`);
      res.should.have.status(404);
    });

    it('no access token provided', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/token/${token.id}/invalidate`);
      res.should.have.status(401);
    });
  });
});
