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


// this describe block wraps all tests related to "user"
describe('User', () => {
  let user;
  let accessToken;
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

    const res = await chai.request(server.app)
      .post('/api/auth/login')
      .send({ email: 'test@default.com', password: 'password' });
    res.should.have.status(200);
    res.body.should.have.property('accessToken');
    ({ accessToken } = res.body);
  });

  // this describe bock wraps all tests related to the get user route
  describe('GET /api/user/:userId', () => {
    it('valid details', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .get(`/api/user/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      res.should.have.status(200);
      res.body.should.have.property('name', user.name);
      res.body.should.have.property('email', user.email);
      res.body.should.have.property('isAdmin', user.isAdmin);
      res.body.should.have.property('emailVerified', false);
    });

    it('invalid user id', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .get('/api/user/123456789012345678901234')
        .set('Authorization', `Bearer ${accessToken}`);
      res.should.have.status(404);
    });

    it('no access token provided', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .get(`/api/user/${user.id}`);
      res.should.have.status(401);
    });
  });

  describe('PATCH /api/user/:userId', () => {
    it('update name with valid details', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New name' });
      res.should.have.status(200);
      res.body.should.have.property('name', 'New name');
      res.body.should.have.property('email', user.email);
      res.body.should.have.property('isAdmin', user.isAdmin);
      res.body.should.have.property('emailVerified', false);

      user = await User.get(user.id);
      user.should.have.property('name', 'New name');
    });

    it('update name with invalid name', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '   x   ' });
      res.should.have.status(400);
    });

    it('update email with valid details', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'def@gmail.com' });
      res.should.have.status(200);
      res.body.should.have.property('name', user.name);
      res.body.should.have.property('email', 'def@gmail.com');
      res.body.should.have.property('isAdmin', user.isAdmin);
      res.body.should.have.property('emailVerified', false);

      user = await User.get(user.id);
      user.should.have.property('email', 'def@gmail.com');
    });

    it('update email with invalid email', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'defgmail.com' });
      res.should.have.status(400);
    });

    it('update password with valid details', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ oldPassword: 'password', newPassword: 'newPassword' });
      res.should.have.status(200);
      res.body.should.have.property('name', user.name);
      res.body.should.have.property('email', user.email);
      res.body.should.have.property('isAdmin', user.isAdmin);
      res.body.should.have.property('emailVerified', false);

      user = await User.get(user.id);
      user.comparePassword('newPassword').should.eventually.be.true;
    });

    it('update password with incorrect old password', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ oldPassword: 'password2', newPassword: 'newPassword' });
      res.should.have.status(403);

      user = await User.get(user.id);
      user.comparePassword('password').should.eventually.be.true;
    });

    it('update password with no old password', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ newPassword: 'newPassword' });
      res.should.have.status(403);

      user = await User.get(user.id);
      user.comparePassword('password').should.eventually.be.true;
    });

    it('empty profile update', async () => {
      // tell chai to make a request to our own server
      const res = await chai.request(server.app)
        .patch(`/api/user/${user.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      // Note: an empty request does not fail
      // it simply does nothing
      res.should.have.status(200);
      res.body.should.have.property('name', user.name);
      res.body.should.have.property('email', user.email);
      res.body.should.have.property('isAdmin', user.isAdmin);
      res.body.should.have.property('emailVerified', false);
    });
  });
});
