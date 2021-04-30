/* eslint-disable no-unused-expressions */

const mongoose = require('mongoose');
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Classroom = require('../models/classroom.model');
const { Message } = require('../models/message.model');
const Token = require('../models/token.model');
const server = require('../index');

// this describe block contains all tests related to /src/server/classroom/instructor
describe('Classroom.Instructor', () => {
  // variables for all tests to use
  let classroom; // classroom object in the database
  let user; // user object in the database
  let user2;
  let clientSocket; // the connection to the server
  let clientSocket2;

  // here we are not testing whether the connection works. It is assumed to work.
  // Therefore we are connecting to the server before the tests, and running the
  // tests while being connected to the server
  beforeEach((done) => {
    (async () => {
      // Before each test we always empty the database
      await User.deleteMany({}).exec();
      await Classroom.deleteMany({}).exec();
      await Token.deleteMany({}).exec();
      await Message.deleteMany({}).exec();

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

      user2 = await User.create({
        name: 'test user 2',
        email: 'test2@default.com',
        isAdmin: false,
        password: 'none',
        lastVerifiedEmail: 'test2@default.com' // directly sets our email to be verified
      });
      await user2.setPassword('password');
      // make a log in request to server
      const res2 = await chai.request(server.app)
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({ email: 'test2@default.com', password: 'password' });
        // connect to the server with the access token
      clientSocket2 = new Client(`http://localhost:${server.server.address().port}`, {
        extraHeaders: {
          Authorization: `Bearer ${res2.body.accessToken}`
        }
      });

      clientSocket.once('catch up', async (data) => {
        data.should.have.property('id');
        classroom = await Classroom.get(data.id);
        clientSocket2.once('catch up', (data2) => {
          data2.should.have.property('id');
          done();
        });
        clientSocket2.emit('join classroom', { classroomId: classroom.id }, (data2) => {
          // this is the immediate response from server
          // we expect this to be empty to indicate success
          data2.should.eql({});
        });
      });
      clientSocket.emit('create classroom', { name: 'Test classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    })();
  });

  // all tests related to requesting permission
  describe('request permission', () => {
    // test request permission when the user is already an instructor
    it('requestion permission when the user is already an instructor', (done) => {
      clientSocket.emit('request permission', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // test successful request permission
    it('request permission successfully', (done) => {
      clientSocket2.once('participant changed', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('permission', 'requesting');
        // tell mocha that this test is done
        done();
      });
      // send the request permission to server
      clientSocket2.emit('request permission', {}, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('cancel request permission', () => {
    // test successful cancel request permission
    it('successful cancel request permission', (done) => {
      clientSocket2.once('participant changed', (data) => {
        // verify the contents of the event=
        data.should.have.property('permission', 'requesting');
        clientSocket2.once('participant changed', (data2) => {
          // verify the contents of the event=
          data2.should.have.property('permission', 'student');
          // tell mocha that this test is done
          done();
        });
        // send the cancel request permission request to server
        clientSocket2.emit('cancel request permission', {}, (data2) => {
          // this is the immediate response from server
          // we expect this to be empty to indicate success
          data2.should.eql({});
        });
      });
      // send the request permission to server
      clientSocket2.emit('request permission', {}, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('promote participant', () => {
    // test host promote themself
    it('host promote themself', (done) => {
      // send the promote participant request to server
      clientSocket.emit('promote participant', { userId: user.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.have.property('error');
        done();
      });
    });
    // test student promote host
    it('student promote host', (done) => {
      // send the promote participant request to server
      clientSocket2.emit('promote participant', { userId: user.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.have.property('error');
        done();
      });
    });
    // test host promote student
    it('host promote student', (done) => {
      clientSocket.once('participant changed', (data) => {
        // verify the contents of the event=
        data.should.have.property('permission', 'instructor');
        // tell mocha that this test is done
        done();
      });
      // send the promote participant request to server
      clientSocket.emit('promote participant', { userId: user2.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('award token', () => {
    // test award token without userIds
    it('award token without userIds', (done) => {
      // send the award token request to server
      clientSocket.emit('award token', {}, (data) => {
        // this is the immediate response from server
        data.should.have.property('error');
        done();
      });
    });

    // test award token with one userId
    it('award token with one userId', (done) => {
      // send the award token request to server
      clientSocket.emit('award token', { userIds: [user.id] }, (data) => {
        // this is the immediate response from server
        data.should.eql({});
        Token.findOne({ createdBy: user.id }).exec().should.be.fulfilled;
        done();
      });
    });

    // test award token as student
    it('award token as student', (done) => {
      // send the award token request to server
      clientSocket2.emit('award token', { userIds: [user.id] }, (data) => {
        // this is the immediate response from server
        data.should.have.property('error');
        done();
      });
    });

    // test award token with two userIds
    it('award token with two userIds', (done) => {
      // send the award token request to server
      clientSocket.emit('award token', { userIds: [user.id, user2.id] }, (data) => {
        // this is the immediate response from server
        data.should.eql({});
        Token.findOne({ receivedBy: user.id }).exec().should.be.fulfilled;
        Token.findOne({ receivedBy: user2.id }).exec().should.be.fulfilled;
        done();
      });
    });
  });

  describe('demote participant', () => {
    // test student demote host
    it('student demote host', (done) => {
      clientSocket2.emit('demote participant', { userId: user.id }, (data) => {
        // this is the immediate response from server
        data.should.have.property('error');
        done();
      });
    });

    // test host demote themself
    it('host demote themself', (done) => {
      clientSocket.emit('demote participant', { userId: user.id }, (data) => {
        // this is the immediate response from server
        data.should.have.property('error');
        done();
      });
    });

    // test host demote student
    it('host demote student', (done) => {
      clientSocket.emit('demote participant', { userId: user2.id }, (data) => {
        // this is the immediate response from server
        data.should.have.property('error');
        done();
      });
    });

    // test host demote instructor
    it('host demote instructor', (done) => {
      clientSocket.once('participant changed', (data) => {
        // verify the contents of the event=
        data.should.have.property('permission', 'instructor');
        clientSocket.once('participant changed', (data2) => {
          data2.should.have.property('permission', 'student');
          done();
        });
        clientSocket.emit('demote participant', { userId: user2.id }, (data2) => {
          // this is the immediate response from server
          data2.should.eql({});
        });
      });
      // send the promote participant request to server
      clientSocket.emit('promote participant', { userId: user2.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('mute participant', () => {
    // test student muting host
    it('student muting host', (done) => {
      clientSocket2.emit('mute participant', { userId: user.id }, (data) => {
        // this is the immediate response from server
        data.should.have.property('error');
        done();
      });
    });

    // test host muting themself
    it('host muting themself', (done) => {
      clientSocket.once('participant changed', (data) => {
        data.should.have.property('isMuted', true);
        done();
      });
      clientSocket.emit('mute participant', { userId: user.id }, (data) => {
        // this is the immediate response from server
        data.should.eql({});
      });
    });

    // test host muting student
    it('host muting student', (done) => {
      clientSocket.once('participant changed', (data) => {
        data.should.have.property('isMuted', true);
        done();
      });
      clientSocket.emit('mute participant', { userId: user2.id }, (data) => {
        // this is the immediate response from server
        data.should.eql({});
      });
    });
  });

  describe('mute classroom', () => {
    // test student muting classroom
    it('student muting classroom', (done) => {
      clientSocket2.emit('mute classroom', {}, (data) => {
        // this is the immediate response from server
        data.should.have.property('error');
        done();
      });
    });
    // test host muting classroom
    it('host muting classroom', (done) => {
      clientSocket.once('meta changed', (data) => {
        data.should.have.property('isMuted', true);
        done();
      });
      clientSocket.emit('mute classroom', {}, (data) => {
        // this is the immediate response from server
        data.should.eql({});
      });
    });
  });
});
