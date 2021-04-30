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

  describe('peek classroom', () => {
    // test no classroom id input
    it('no classroom id input', (done) => {
      clientSocket.emit('peek classroom', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // test invalid classroom id input
    it('invalid classroom id input', (done) => {
      // when we peek a classroom, the server receives the peek classroom request and
      // immediately respond with an error if any, or an empty object to indicate
      // success
      // then after some processing, it sends the classroom data to the client
      // via a "peek update" event
      clientSocket.emit('peek classroom', { id: 'test peek classroom' }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // test valid classroom id input
    it('valid classroom id input', (done) => {
      clientSocket.once('peek update', (data) => {
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.should.have.property('participantCount');
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
      // send the peek classroom request to server
      clientSocket.emit('peek classroom', { id: classroom.id }, (data) => { //
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('join classroom', () => {
    // test join a classroom with no input
    it('join a classroom with no input', (done) => {
      clientSocket.emit('join classroom', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // test join a non-existent classroom
    it('join a non-existent classroom', (done) => {
      clientSocket.emit('join classroom', { id: 'test join classroom' }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // test join a open classroom
    it('join a opened classroom', (done) => {
      clientSocket.once('catch up', (data) => { //
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.should.have.property('participants');
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
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });

    // test join a closed classroom
    it('join a closed classroom', (done) => {
      clientSocket.once('catch up', (data) => { //
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        data.should.have.property('name', 'New Classroom');
        data.should.have.property('host');
        data.should.have.property('participants');
        data.should.have.property('closedAt');
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
      // send the join classroom request to server
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the leave classroom request to server
      clientSocket.emit('leave classroom', {}, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('clean up classroom', () => {

  });

  describe('lost connection', () => {
    // test lost connection
    it('lost connection', (done) => {
      // send the classroom creation request to server
      clientSocket.emit('create classroom', { name: 'New Classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the join classroom request to server
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      //
    });
  });

  describe('leave classroom', () => {
    // test leave classroom successfully
    it('leave classroom', (done) => {
      // send the classroom creation request to server
      clientSocket.emit('create classroom', { name: 'New Classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the join classroom request to server
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the leave classroom request to server
      clientSocket.emit('leave classroom', {}, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  describe('kick participant', () => {
    // test kick someone successfully
    it('kick participants successfully', (done) => {
      clientSocket.once('kick', (data) => { //
        // verify the contents of the event
        // i.e. classroom data
        data.should.have.property('id');
        // tell mocha that this test is done
        done();
      });
      // send the classroom creation request to server
      clientSocket.emit('create classroom', { name: 'New Classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the join classroom request to server
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the kick participant request to server
      clientSocket.emit('kick participant', { id: '' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
    // test kick the user oneself
    it('kick the user oneself', (done) => {
      // send the classroom creation request to server
      clientSocket.emit('create classroom', { name: 'New Classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      // send the join classroom request to server
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      clientSocket.emit('kick participant', { id: user.id }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // test kick an instructor
  });
});
