const mongoose = require('mongoose');
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Classroom = require('../models/classroom.model');
const Token = require('../models/token.model');
const server = require('../index');

// this describe block contains all tests related to /src/server/classroom/instructor
describe('Classroom.Instructor', () => {
  // variables for all tests to use
  let classroom; // classroom object in the database
  let user; // user object in the database
  let token; // token object in the database
  let clientSocket; // the connection to the server

  // here we are not testing whether the connection works. It is assumed to work.
  // Therefore we are connecting to the server before the tests, and running the
  // tests while being connected to the server
  beforeEach((done) => {
    (async () => {
      // Before each test we always empty the database
      await User.remove({}).exec();
      await Classroom.remove({}).exec();
      await Token.remove({}).exec();
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
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        data.should.eql({});
      });
    })();
  });

  // all tests related to requesting permission
  describe('request permission', () => {
    // test request permission when the user is already an instructor
    it('requestion permission when the user is already an instructor', (done) => {
      clientSocket.emit('request permission', { id: user.id }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // test successful request permission
    it('requestion permission successfully', (done) => {
      clientSocket.once('', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('participants');
        // tell mocha that this test is done
        done();
      });
      // send the request permission to server
      clientSocket.emit('request permission', { id: '' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('cancel request permission', () => {
    // test successful cancel request permission
    it('successful cancel request permission', (done) => {
      clientSocket.once('', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('participants');
        // tell mocha that this test is done
        done();
      });
      // send the request permission to server
      clientSocket.emit('request permission', { id: '' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the cancel request permission request to server
      clientSocket.emit('cancel request permission', {}, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('promote participant', () => {
    // test promote participant
    it('promote participant', (done) => {
      clientSocket.once('', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('participants');
        // tell mocha that this test is done
        done();
      });
      // send the promote participant request to server
      clientSocket.emit('promote participant', { id: '' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('award token', () => {
    // test award token
    it('award token', (done) => {
      clientSocket.once('', (data) => {
        // verify the contents of the event
        // i.e. token data
        data.should.have.property('id');
        data.should.have.property('name', classroom.id);
        data.should.have.property('createdBy', user.id);
        // tell mocha that this test is done
        done();
      });
      // send the award token request to server
      clientSocket.emit('award token', { id: '', value: '' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('demote participant', () => {
    // test demote participant
    it('demote participant', (done) => {
      clientSocket.once('', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.should.have.property('participantCount');
        data.should.have.property('participant', 'permission', 'student');
        // tell mocha that this test is done
        done();
      });
      clientSocket.emit('demote participant', { id: '' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('mute participant', () => {
    // test mute participant
    it('mute participant', (done) => {
      clientSocket.once('', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.should.have.property('participantCount');
        data.should.have.property('participants', 'isMuted', true); //
        data.host.should.have.property('name', 'test user');
        // tell mocha that this test is done
        done();
      });
      // send the mute participant request to server
      clientSocket.emit('mute participant', { id: '' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('mute classroom', () => {
    // test mute classroom
    it('mute classroom', (done) => {
      clientSocket.once('', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.should.have.property('participantCount');
        data.should.have.property('isMuted', true);
        data.host.should.have.property('name', 'test user');
        // tell mocha that this test is done
        done();
      });
      // send the mute classroom request to server
      clientSocket.emit('mute classroom', {}, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });
});
