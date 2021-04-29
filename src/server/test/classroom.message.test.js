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

// this describe block contains all tests related to /src/server/classroom/external
describe('Classroom.Message', () => {
  // variables for all tests to use
  let message; // message object in the database
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

  // all tests related to sending message
  describe('send message', () => {
    //
    it('empty message input', (done) => {
      // socket.emit(eventName, data, callback)
      clientSocket.emit('send message', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('non-empty message input', (done) => {
      clientSocket.once('new message', (data) => {
        // verify the contents of the event
        // i.e. message data
        data.should.have.property('id');
        data.should.have.property('type');
        data.should.have.property('sender');
        data.host.should.have.property('content', 'test');
        // tell mocha that this test is done
        done();
      });
      // send the message request to server
      clientSocket.emit('send message', { name: 'New Classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });
});
