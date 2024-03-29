// require mongoose to directly access the database
const mongoose = require('mongoose');

// mocha is our testing library
const {
  describe, beforeEach, it
} = require('mocha');

// require our database model
const httpStatus = require('http-status');
const User = require('../models/user.model');

// require our server
// this represents our entire backend
const server = require('../index');

// require the setup file, which sets up chai for us
// chai helps us verify test results
const { should, chai } = require('./setup');


// this describe block wraps all tests related to "auth"
describe('Auth', () => {
  let user;
  // things to do "beforeEach" test
  beforeEach(async () => {
    // Before each test we empty the database
    await User.deleteMany({}).exec();
    // then create a new user
    user = await User.create({
      name: 'test user',
      email: 'test@default.com',
      isAdmin: false,
      password: 'none',
      emailVerification: 'sample-verification'
    });
    await user.setPassword('password');
  });

  // this describe bock wraps all tests related to the sign up route
  describe('POST /api/auth/signup', () => {
    // test sign up with valid input
    it('valid details', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({ email: 'test@gmail.com', password: 'password', name: 'test user' });
      // verify the results using almost plain english
      res.should.have.status(200);
      res.body.should.have.property('name', 'test user');
      res.body.should.have.property('email', 'test@gmail.com');
      res.body.should.have.property('isAdmin', false);
      res.body.should.have.property('emailVerified', false);
    });

    // test sign up with invalid input
    it('invalid email', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({ email: 'test', password: 'password', name: 'test user' });
      // we expect the server to return 400 BAD REQUEST
      // because the email we provided is invalid
      res.should.have.status(400);
    });
  });

  // this describe block wraps all tests related to the log in route
  describe('POST /api/auth/login', () => {
    // test log in with valid inputs
    it('valid details', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test@default.com', password: 'password' });
      res.should.have.status(200);
      res.body.should.have.property('accessToken');
      res.body.should.have.property('refreshToken');
      res.body.should.have.property('user');
      res.body.user.should.have.property('name', 'test user');
      res.body.user.should.have.property('email', 'test@default.com');
      res.body.user.should.have.property('isAdmin', false);
      res.body.user.should.have.property('emailVerified', false);
    });

    // test log in with a non-existing email
    it('user does not exist', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test@gmail.com', password: 'password' });
      res.should.have.status(401);
    });

    // test log in with an incorrect password
    it('incorrect password', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test@default.com', password: 'password2' });
      res.should.have.status(401);
    });
  });

  // this describe block wraps all tests related to the refresh token route
  describe('GET /api/auth/token', () => {
    // test token refresh with valid inputs
    it('valid details', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test@default.com', password: 'password' });
      res.should.have.status(200);
      res.body.should.have.property('refreshToken');

      const res2 = await chai.request(server.app)
        .get('/api/auth/token')
        .set('Authorization', `Bearer ${res.body.refreshToken}`);
      res2.should.have.status(200);
      res2.body.should.have.property('accessToken');
      res2.body.should.have.property('userId', user.id);
    });

    // test token refresh with a non-existing email
    it('invalid refresh token', async () => {
      const res2 = await chai.request(server.app)
        .get('/api/auth/token')
        .set('Authentication', 'Bearer 8712647386287613289427628798');
      res2.should.have.status(401);
    });

    // test token refresh without a refresh token header
    it('no refresh token', async () => {
      const res2 = await chai.request(server.app)
        .get('/api/auth/token');
      res2.should.have.status(401);
    });
  });

  // this describe block wraps all tests related to the email verification route
  describe('GET /api/auth/email/:userId/:verification', () => {
    // test email verification with valid inputs
    it('valid details', async () => {
      await chai.request(server.app)
        .get(`/api/auth/email/${user.id}/sample-verification`);
      user = await User.get(user.id);
      user.lastVerifiedEmail.should.equal('test@default.com');
    });

    // test email verification with an incorrect verification code
    it('invalid verification code', async () => {
      await chai.request(server.app)
        .get(`/api/auth/email/${user.id}/incorrect-verification`);
      user = await User.get(user.id);
      should.not.exist(user.lastVerifiedEmail);
    });

    // test email verification with an incorrect user id
    it('invalid user id', async () => {
      await chai.request(server.app)
        .get('/api/auth/email/123456789012345678901234/sample-verification');
      user = await User.get(user.id);
      should.not.exist(user.lastVerifiedEmail);
    });
  });

  // this describe block wraps all tests related to the log out route
  describe('DELETE /api/auth/logout', () => {
    // test log out with valid inputs
    it('valid details', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .send({ email: 'test@default.com', password: 'password' });
      res.should.have.status(200);
      res.body.should.have.property('refreshToken');

      const res2 = await chai.request(server.app)
        .delete('/api/auth/logout')
        .set('Authorization', `Bearer ${res.body.refreshToken}`);
      res2.should.have.status(httpStatus.NO_CONTENT);

      user = await User.get(user.id);
      user.authTokenIds.should.have.a.lengthOf(0);
    });

    // test log out with a non-existing email
    it('invalid refresh token', async () => {
      const res2 = await chai.request(server.app)
        .delete('/api/auth/logout')
        .set('Authentication', 'Bearer 8712647386287613289427628798');
      res2.should.have.status(401);
    });

    // test log out without a refresh token header
    it('no refresh token', async () => {
      const res2 = await chai.request(server.app)
        .get('/api/auth/token')
        .set('content-type', 'application/json');
      res2.should.have.status(401);
    });
  });
});
