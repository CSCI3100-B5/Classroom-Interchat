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
      await QuizAnswer.deleteMany({}).exec();

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

  // all tests related to sending quiz
  describe('send quiz', () => {
    it('send an empty quiz', (done) => {
      clientSocket.emit('send quiz', {}, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz without choices', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: []
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz with 1 choice only', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1']
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz without a prompt', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        choices: ['choice1', 'choice2']
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz with duplicate choices', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice1']
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz with invalid correct answers', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0, 2],
        multiSelect: true
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz with empty correct answers', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [],
        multiSelect: true
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz with too many correct answers and no multi-select', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0, 1],
        multiSelect: false
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    it('send an MCQuiz with too many correct answers and multi-select', (done) => {
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0, 1, 1],
        multiSelect: true
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
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        data.content.should.have.property('choices');
        data.content.should.have.property('multiSelect', true);
        // tell mocha that this test is done
        done();
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0, 1],
        multiSelect: true
      }, (data) => {
        data.should.eql({});
      });
    });

    it('send an empty SAQuiz', (done) => {
      clientSocket.emit('send quiz', {
        type: 'SAQ'
      }, (data) => {
        // we expect the server to respond with an error
        data.should.have.property('error');
        // tell mocha that this test is done
        done();
      });
    });

    // send a valid SAQuiz
    it('send a valid SAQuiz', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'saq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        // tell mocha that this test is done
        done();
      });
      clientSocket.emit('send quiz', {
        type: 'SAQ',
        prompt: 'test quiz'
      }, (data) => {
        data.should.eql({});
      });
    });
  });

  // all tests related to ending quiz
  describe('end quiz', () => {
    it('end quiz with non-existing message id', (done) => {
      clientSocket.emit('end quiz', { messageId: '123456789012345678901234' }, (data) => {
        data.should.have.property('error');
        done();
      });
    });

    it('successfully end quiz', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('id');
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        clientSocket.once('end quiz', (data2) => {
          data.should.have.property('content');
          data.content.should.have.property('closedAt');
          done();
        });
        clientSocket.emit('end quiz', { messageId: data.id }, (data2) => {
          data2.should.eql({});
        });
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0, 1],
        multiSelect: true
      }, (data) => {
        data.should.eql({});
      });
    });
  });

  // all tests related to releasing result
  describe('release results', () => {
    it('release results with non-existing message id', (done) => {
      clientSocket.emit('end quiz', { messageId: '123456789012345678901234' }, (data) => {
        data.should.have.property('error');
        done();
      });
    });

    it('successfully release results', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('id');
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        clientSocket.once('update quiz', (data2) => {
          data.should.have.property('content');
          data.content.should.have.property('results');
          done();
        });
        // Note: although currently disallowed in front end, it is actually
        // possible to release quiz results before the quiz has ended.
        // In this case, the server will continue to post quiz updates
        // to everyone when new quiz answers are submitted.
        // This is why we don't need to end quiz before releasing results here
        clientSocket.emit('release results', { messageId: data.id }, (data2) => {
          data2.should.eql({});
        });
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0, 1],
        multiSelect: true
      }, (data) => {
        data.should.eql({});
      });
    });
  });

  // all tests related to ansSAQuiz
  describe('ansSAQuiz', () => {
    it('empty SAQ answer', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'saq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        clientSocket.emit('saq answer', {
          messageId: data.id
        }, (data2) => {
          data2.should.have.property('error');
          done();
        });
      });
      clientSocket.emit('send quiz', {
        type: 'SAQ',
        prompt: 'test quiz'
      }, (data) => {
        data.should.eql({});
      });
    });

    it('non-existing message id', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'saq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        clientSocket.emit('saq answer', {
          content: 'saq answer',
          messageId: '123456789012345678901234'
        }, (data2) => {
          data2.should.have.property('error');
          done();
        });
      });
      clientSocket.emit('send quiz', {
        type: 'SAQ',
        prompt: 'test quiz'
      }, (data) => {
        data.should.eql({});
      });
    });

    it('successfully answer SAQuiz', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'saq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');

        clientSocket.once('new quiz result', (data2) => {
          data2.should.have.property('result');
          data2.result.should.have.property('content', 'saq answer');
          // tell mocha that this test is done
          done();
        });
        clientSocket.emit('saq answer', {
          content: 'saq answer',
          messageId: data.id
        }, (data2) => {
          data2.should.eql({});
        });
      });
      clientSocket.emit('send quiz', {
        type: 'SAQ',
        prompt: 'test quiz'
      }, (data) => {
        data.should.eql({});
      });
    });
  });

  // all tests related to ansMCQuiz
  describe('ansMCQuiz', () => {
    it('answer MCQuiz with no choices', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        data.content.should.have.property('choices');
        data.content.should.have.property('multiSelect', true);

        clientSocket.emit('mcq answer', {
          content: [],
          messageId: data.id
        }, (data2) => {
          data2.should.have.property('error');
          done();
        });
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0],
        multiSelect: true
      }, (data) => {
        data.should.eql({});
      });
    });

    it('answer MCQuiz with an invalid choice', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        data.content.should.have.property('choices');
        data.content.should.have.property('multiSelect', true);

        clientSocket.emit('mcq answer', {
          content: [3],
          messageId: data.id
        }, (data2) => {
          data2.should.have.property('error');
          done();
        });
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0],
        multiSelect: true
      }, (data) => {
        data.should.eql({});
      });
    });

    it('answer MCQuiz with too many choices', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        data.content.should.have.property('choices');
        data.content.should.have.property('multiSelect', false);

        clientSocket.emit('mcq answer', {
          content: [0, 1],
          messageId: data.id
        }, (data2) => {
          data2.should.have.property('error');
          done();
        });
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0],
        multiSelect: false
      }, (data) => {
        data.should.eql({});
      });
    });

    it('successfully answer non-multiSelect MCQuiz', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        data.content.should.have.property('choices');
        data.content.should.have.property('multiSelect', false);

        clientSocket.once('new quiz result', (data2) => {
          data2.should.have.property('result');
          data2.result.should.have.property('content');
          data2.result.content.should.eql([1]);
          // tell mocha that this test is done
          done();
        });
        clientSocket.emit('mcq answer', {
          content: [1],
          messageId: data.id
        }, (data2) => {
          data2.should.eql({});
        });
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0],
        multiSelect: false
      }, (data) => {
        data.should.eql({});
      });
    });

    it('successfully answer multiSelect MCQuiz', (done) => {
      clientSocket.once('new quiz', (data) => {
        // verify the contents of the event
        data.should.have.property('type', 'mcq');
        data.should.have.property('content');
        data.content.should.have.property('prompt', 'test quiz');
        data.content.should.have.property('choices');
        data.content.should.have.property('multiSelect', true);

        clientSocket.once('new quiz result', (data2) => {
          data2.should.have.property('result');
          data2.result.should.have.property('content');
          data2.result.content.should.eql([0, 1]);
          // tell mocha that this test is done
          done();
        });
        clientSocket.emit('mcq answer', {
          content: [0, 1],
          messageId: data.id
        }, (data2) => {
          data2.should.eql({});
        });
      });
      clientSocket.emit('send quiz', {
        type: 'MCQ',
        prompt: 'test quiz',
        choices: ['choice1', 'choice2'],
        correct: [0, 1],
        multiSelect: true
      }, (data) => {
        data.should.eql({});
      });
    });
  });
});
