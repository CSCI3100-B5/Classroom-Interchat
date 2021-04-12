const mongoose = require('mongoose');

// Require the dev-dependencies
const {
  describe, beforeEach, it
} = require('mocha');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const server = require('../index');

// Our parent block
describe('Auth', () => {
  beforeEach(async () => { // Before each test we empty the database
    await User.remove({}).exec();
    const user = await User.create({
      name: 'test user',
      email: 'test@default.com',
      isAdmin: false,
      password: 'none'
    });
    await user.setPassword('password');
  });

  describe('POST /api/auth/signup', () => {
    it('valid details', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({ email: 'test@gmail.com', password: 'password', name: 'test user' });
      res.should.have.status(200);
      res.body.should.have.property('name', 'test user');
      res.body.should.have.property('email', 'test@gmail.com');
      res.body.should.have.property('isAdmin', false);
      res.body.should.have.property('emailVerified', false);
    });

    it('invalid email', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({ email: 'test', password: 'password', name: 'test user' });

      res.should.have.status(400);
    });
  });

  describe('POST /api/auth/login', () => {
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

    it('user does not exist', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test@gmail.com', password: 'password' });
      res.should.have.status(401);
    });

    it('incorrect password', async () => {
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test@default.com', password: 'password2' });
      res.should.have.status(401);
    });
  });
});
