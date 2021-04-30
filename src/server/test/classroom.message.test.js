const mongoose = require('mongoose');
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { cli } = require('winston/lib/winston/config');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Classroom = require('../models/classroom.model');
const { Message } = require('../models/message.model');
const server = require('../index');

// this describe block contains all tests related to /src/server/classroom/external
describe('Classroom.Message', () => {
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
      await User.deleteMany({}).exec();
      await Classroom.deleteMany({}).exec();
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

      clientSocket.once('catch up', async (data) => {
        data.should.have.property('id');
        classroom = await Classroom.get(data.id);
        done();
      });
      clientSocket.emit('create classroom', { name: 'Test classroom' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    })();
  });

  // all tests related to sending message
  describe('send message', () => {
    it('empty message', (done) => {
      clientSocket.emit('send message', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('message with content but no type', (done) => {
      clientSocket.emit('send message', { message: 'message' }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('text message', (done) => {
      clientSocket.once('new message', (data) => {
        data.should.have.property('id');
        data.should.have.property('content', 'message');
        data.should.have.property('sender');
        data.should.have.property('type', 'text');
        done();
      });
      clientSocket.emit('send message', { message: 'message', information: { type: 'text' } }, (data) => {
        // we expect the server to respond with an error
        data.should.eql({});
      });
    });

    it('question message', (done) => {
      clientSocket.once('new message', (data) => {
        data.should.have.property('id');
        data.should.have.property('content');
        data.content.should.eql({ content: 'message', isResolved: false });
        data.should.have.property('sender');
        data.should.have.property('type', 'question');
        done();
      });
      clientSocket.emit('send message', { message: 'message', information: { type: 'question' } }, (data) => {
        // we expect the server to respond with an error
        data.should.eql({});
      });
    });

    it('reply message with non-existing message id', (done) => {
      clientSocket.emit('send message', {
        message: 'message',
        information: { type: 'reply', qMessageId: '123456789012345678901234' }
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        done();
      });
    });

    it('reply message with existing message id', (done) => {
      clientSocket.once('new message', (data) => {
        data.should.have.property('id');
        data.should.have.property('type', 'question');
        clientSocket.once('new message', (data2) => {
          data2.should.have.property('id');
          data2.should.have.property('content');
          data2.content.should.eql({ content: 'message2', replyTo: data.id });
          data2.should.have.property('sender');
          data2.should.have.property('type', 'reply');
          done();
        });
        clientSocket.emit('send message', {
          message: 'message2',
          information: { type: 'reply', qMessageId: data.id }
        }, (data2) => {
          // we expect the server to respond with an error
          data2.should.eql({});
        });
      });
      clientSocket.emit('send message', { message: 'message', information: { type: 'question' } }, (data) => {
        // we expect the server to respond with an error
        data.should.eql({});
      });
    });
  });

  describe('resolve question', () => {
    // test resolve a question successfully
    it('resolve a question successfully', (done) => {
      clientSocket.once('new message', (data) => {
        data.should.have.property('id');
        data.should.have.property('type', 'question');
        clientSocket.once('question resolved', (data2) => {
          // verify the contents of the event
          // i.e. question data
          data2.should.have.property('content');
          data2.content.should.have.property('isResolved', true);
          data2.content.should.have.property('content', 'message');
          // tell mocha that this test is done
          done();
        });
        // send the resolve question request to server
        clientSocket.emit('resolve question', { messageId: data.id }, (data2) => {
          // this is the immediate response from server
          // we expect this to be empty to indicate success
          data2.should.eql({});
        });
      });
      clientSocket.emit('send message', { message: 'message', information: { type: 'question' } }, (data) => {
        // we expect the server to respond with an error
        data.should.eql({});
      });
    });

    // test resolve a resolved question
    it('resolve a resolved question', (done) => {
      clientSocket.once('new message', (data) => {
        data.should.have.property('id');
        data.should.have.property('type', 'question');
        clientSocket.once('question resolved', (data2) => {
          // verify the contents of the event
          // i.e. question data
          data2.content.should.have.property('isResolved', true);
          // send the resolve question request to server
          clientSocket.emit('resolve question', { messageId: data.id }, (data3) => {
            // this is the immediate response from server
            // we expect this to be empty to indicate success
            data3.should.have.property('error');
            done();
          });
        });
        // send the resolve question request to server
        clientSocket.emit('resolve question', { messageId: data.id }, (data2) => {
          // this is the immediate response from server
          // we expect this to be empty to indicate success
          data2.should.eql({});
        });
      });
      clientSocket.emit('send message', { message: 'message', information: { type: 'question' } }, (data) => {
        // we expect the server to respond with an error
        data.should.eql({});
      });
    });
  });
});
