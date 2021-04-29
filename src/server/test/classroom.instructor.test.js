const mongoose = require('mongoose');
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Classroom = require('../models/classroom.model');
const Message = require('../models/message.model');
const server = require('../index');

// this describe block contains all tests related to /src/server/classroom/instructor
describe('Classroom.Instructor', () => {
  // variables for all tests to use
  let classroom; // classroom object in the database
  let user; // user object in the database
  let clientSocket; // the connection to the server

  // here we are not testing whether the connection works. It is assumed to work.
  // Therefore we are connecting to the server before the tests, and running the
  // tests while being connected to the server
  beforeEach((done) => {
    (async () => {
      // Before each test we always empty the database
      await User.remove({}).exec();
      await Classroom.remove({}).exec();
      user = await User.create({
        name: 'test user',
        email: 'test@default.com',
        isAdmin: false,
        password: 'none',
        lastVerifiedEmail: 'test@default.com' // directly sets our email to be verified
      });
      await user.setPassword('password');
      // make a log in request to server
      const res = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test@default.com', password: 'password' });
      // connect to the server with the access token
      clientSocket = new Client(`http://localhost:${server.server.address().port}`, {
        extraHeaders: {
          Authorization: `Bearer ${res.body.accessToken}`
        }
      });

      clientSocket.once('catch up', async (data) => {
        data.should.have.property('id');
        classroom = await Classroom.get(data.id);
        done();
      });
      // send the classroom creation request to server
      clientSocket.emit('create classroom', { name: 'Test Classroom' }, (data) => {
        data.should.eql({});
      });
    })();
  });

  // all tests related to requesting permission
  describe('request permission', () => {
    // test request permission when the user is already an instructor

    // successful request permission

  });

  describe('cancel request permission', () => {

  });

  describe('promote participant', () => {

  });

  describe('award token', () => {

  });

  describe('demote participant', () => {

  });

  describe('mute participant', () => {

  });

  describe('mute classroom', () => {

  });
});
