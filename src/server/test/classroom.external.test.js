const mongoose = require('mongoose');

// Require the dev-dependencies
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Classroom = require('../models/classroom.model');
const server = require('../index');

// Our parent block
describe('Classroom.External', () => {
  let classroom;
  let user;
  let port;

  before(() => {
    ({ port } = server.server.address());
  });

  beforeEach(async () => { // Before each test we empty the database
    await User.remove({}).exec();
    await Classroom.remove({}).exec();
    user = await User.create({
      name: 'test user',
      email: 'test@default.com',
      isAdmin: false,
      password: 'none'
    });
    await user.setPassword('password');
    classroom = await Classroom.create({
      name: 'Test classroom',
      host: user.id,
    });
  });

  it('connect without credentials', async () => {
    const clientSocket = new Client(`http://localhost:${port}`);
    return (new Promise((resolve, reject) => {
      clientSocket.once('connect', resolve);
      clientSocket.once('connect_error', reject);
    })).should.be.rejected;
  });

  it('connect with wrong credentials', async () => {
    const clientSocket = new Client(`http://localhost:${port}`, {
      extraHeaders: {
        Authorization: 'Bearer invalidaccesstoken'
      }
    });
    return (new Promise((resolve, reject) => {
      clientSocket.once('connect', resolve);
      clientSocket.once('connect_error', reject);
    })).should.be.rejected;
  });

  it('connect with correct credentials but unverified email', async () => {
    const res = await chai.request(server.app)
      .post('/api/auth/login')
      .set('content-type', 'application/json')
      .send({ email: 'test@default.com', password: 'password' });
    res.should.have.status(200);
    res.body.should.have.property('accessToken');
    const clientSocket = new Client(`http://localhost:${port}`, {
      extraHeaders: {
        Authorization: `Bearer ${res.body.accessToken}`
      }
    });
    return (new Promise((resolve, reject) => {
      clientSocket.once('connect', resolve);
      clientSocket.once('connect_error', reject);
    })).should.be.rejected;
  });

  it('connect with correct credentials and verified email', async () => {
    user.lastVerifiedEmail = user.email;
    await user.save();
    const res = await chai.request(server.app)
      .post('/api/auth/login')
      .set('content-type', 'application/json')
      .send({ email: 'test@default.com', password: 'password' });
    res.should.have.status(200);
    res.body.should.have.property('accessToken');
    const clientSocket = new Client(`http://localhost:${port}`, {
      extraHeaders: {
        Authorization: `Bearer ${res.body.accessToken}`
      }
    });
    return (new Promise((resolve, reject) => {
      clientSocket.once('connect', resolve);
      clientSocket.once('connect_error', reject);
    })).should.be.fulfilled;
  });
});
