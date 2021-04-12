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
  let clientSocket;

  beforeEach(async () => { // Before each test we empty the database
    await User.remove({}).exec();
    await Classroom.remove({}).exec();
    user = await User.create({
      name: 'test user',
      email: 'test@default.com',
      isAdmin: false,
      password: 'none',
      lastVerifiedEmail: 'test@default.com'
    });
    await user.setPassword('password');
    classroom = await Classroom.create({
      name: 'Test classroom',
      host: user.id,
    });
    const res = await chai.request(server.app)
      .post('/api/auth/login')
      .set('content-type', 'application/json')
      .send({ email: 'test@default.com', password: 'password' });
    clientSocket = new Client(`http://localhost:${server.server.address().port}`, {
      extraHeaders: {
        Authorization: `Bearer ${res.body.accessToken}`
      }
    });
  });

  describe('create classroom', () => {
    it('create without a name', (done) => {
      clientSocket.emit('create classroom', {}, (data) => {
        data.should.have.property('error');
        done();
      });
    });

    it('create with a name', (done) => {
      clientSocket.once('catch up', (data) => {
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.host.should.have.property('name', 'test user');
        done();
      });
      clientSocket.emit('create classroom', { name: 'New Classroom' }, (data) => {
        data.should.eql({});
      });
    });
  });
});
