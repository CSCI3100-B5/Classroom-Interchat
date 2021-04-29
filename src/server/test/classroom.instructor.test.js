const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../../models/classroom.model');
const User = require('../models/user.model');
const APIError = require('../../helpers/APIError');

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
    clientSocket.emit('join classroom', { id: classroom.id }, (data) => {
      // this is the immediate response from server
      // we expect this to be empty to indicate success
      data.should.eql({});
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
  
