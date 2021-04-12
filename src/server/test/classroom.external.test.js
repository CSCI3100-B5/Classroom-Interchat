const mongoose = require('mongoose');
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Classroom = require('../models/classroom.model');
const server = require('../index');

// this describe block contains all tests related to /src/server/classroom/external
describe('Classroom.External', () => {
  // variables for all tests to use
  let classroom; // classroom object in the database
  let user; // user object in the database
  let clientSocket; // the connection to the server

  // here we are not testing whether the connection works. It is assumed to work.
  // Therefore we are connecting to the server before the tests, and running the
  // tests while being connected to the server
  beforeEach(async () => {
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
    classroom = await Classroom.create({
      name: 'Test classroom',
      host: user.id,
    });
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
  });

  // all tests related to classroom creation
  describe('create classroom', () => {
    // creating a classroom without supplying a classroom name
    it('create without a name', (done) => {
      // socket.emit(eventName, data, callback)
      clientSocket.emit('create classroom', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // creating a classroom with a name
    it('create with a name', (done) => {
      // when we create a classroom, the server receives the creation request and
      // immediately respond with an error if any, or an empty object to indicate
      // success
      // then after some processing, it sends the classroom data to the client
      // via a "catch up" event

      // we are expecting the "catch up" event
      clientSocket.once('catch up', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.host.should.have.property('name', 'test user');
        // tell mocha that this test is done
        done();
      });
      // send the classroom creation request to server
      clientSocket.emit('create classroom', { name: 'New Classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });
});
