const mongoose = require('mongoose');
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const { QuizAnswer } = require('../models/quizanswer.model');
const Classroom = require('../models/classroom.model');
const server = require('../index');

// this describe block contains all tests related to /src/server/classroom/external
describe('Classroom.Quiz', () => {
  // variables for all tests to use
  let message; // message object in the database
  let quizAnswer;
  let classroom; // classroom object in the database
  let user; // user object in the database
  let clientSocket; // the connection to the server

  // here we are not testing whether the connection works. It is assumed to work.
  // Therefore we are connecting to the server before the tests, and running the
  // tests while being connected to the server
  beforeEach(async () => {
    (async () => {
      // Before each test we always empty the database
      await User.remove({}).exec();
      await Classroom.remove({}).exec();
      await Message.remove({}).exec();
      await QuizAnswer.remove({}).exec();

      user = await User.create({
        name: 'test user',
        email: 'test@default.com',
        isAdmin: false,
        password: 'none',
        lastVerifiedEmail: 'test@default.com' // directly sets our email to be verified
      });
      await user.setPassword('password');

      message = await Message.create({
        type: 'mcq|saq'
      });
      quizAnswer = await QuizAnswer.create({
        content: 'test'
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

      clientSocket.once('catch up', async (data) => {
        data.should.have.property('id');
        classroom = await Classroom.get(data.id);
        done();
      });
      // send the classroom creation request to server
      clientSocket.emit('create classroom', { name: 'Test Classroom' }, (data) => {
        data.should.eql({});
      });
      // send the join classroom request to server
      clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
        data.should.eql({});
      });
    })();
  });

  // all tests related to sending quiz
  describe('send quiz', () => {
    // send an empty quiz
    it('send an empty quiz', (done) => {
      // socket.emit(eventName, data, callback)
      clientSocket.emit('send quiz', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // send an invalid MCQuiz
    it('send an invalid MCQuiz', (done) => {
      // socket.emit(eventName, data, callback)
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: '1',
        multiSelect: false
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // send a valid MCQuiz
    it('send a valid MCQuiz', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'MCQ');
        data.should.have.property('prompt', 'test quiz');
        data.should.have.property('choices');
        data.should.have.property('multiselect', false);
        // tell mocha that this test is done
        done();
      });
      clientSocket.emit('send quiz', {
        prompt: 'test quiz',
        type: 'MCQ',
        choices: '4',
        multiSelect: false
        // TODO: add more quiz data here
      }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });

    // send a valid SAQuiz
    it('send a valid SAQuiz', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'SAQ');
        data.should.have.property('prompt', 'test quiz');
        // tell mocha that this test is done
        done();
      });
      clientSocket.emit('send quiz', { prompt: 'test quiz', type: 'SAQ' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  // all tests related to ending quiz
  describe('end quiz', () => {
    // successfully end quiz
    it('end quiz', (done) => {
      clientSocket.emit('send quiz', { prompt: 'test quiz', type: 'SAQ' }, (data) => {
        data.should.eql({});
      });
      clientSocket.emit('end quiz', { id: message.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  // all tests related to releasing result
  describe('release results', () => {
    it('release results', (done) => {
      // TODO: send a quiz before testing the release result function
      clientSocket.emit('send quiz', { prompt: 'test quiz', type: 'SAQ' }, (data) => {
        data.should.eql({});
      });
      clientSocket.emit('end quiz', { id: message.id }, (data) => {
        data.should.eql({});
      });
      clientSocket.emit('release results', { id: message.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  // all tests related to ansSAQuiz
  describe('ansSAQuiz', () => {
    it('answer SAQuiz', (done) => {
      clientSocket.once('new quiz result', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'SAQ');
        data.should.have.property('prompt', 'test quiz');
        // tell mocha that this test is done
        done();
      });
      clientSocket.emit('send quiz', { prompt: 'test quiz', type: 'SAQ' }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      clientSocket.emit('saq answer', { content: 'test', id: message.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });

  // all tests related to ansMCQuiz
  describe('ansMCQuiz', () => {
    it('answer MCQuiz', (done) => {
      clientSocket.once('new quiz result', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'MCQ');
        data.should.have.property('prompt', 'test quiz');
        data.should.have.property('choices');
        data.should.have.property('multiselect', false);
        // tell mocha that this test is done
        done();
      });
      clientSocket.emit('send quiz', {
        prompt: 'test quiz',
        type: 'MCQ',
        choices: '4',
        multiSelect: false
        // TODO: add more quiz data here
      }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
      clientSocket.emit('mcq answer', { content: 1, id: message.id }, (data) => {
        // this is the immediate response from server
        // we expect this to be empty to indicate success
        data.should.eql({});
      });
    });
  });
});
