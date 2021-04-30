const mongoose = require('mongoose');
const {
  describe, beforeEach, it, before
} = require('mocha');
const Client = require('socket.io-client');
const { should, chai } = require('./setup');
const User = require('../models/user.model');
const Classroom = require('../models/classroom.model');
const server = require('../index');

// This describe block wraps all tests related to the initial socket connection
// with our server
describe('Classroom.Connection', () => {
  // variables set up by "before" blocks
  // put them here for use in actual tests
  let classroom;
  let user;
  let port;

  // this is executed once before all tests in this "describe" block are run
  before(() => {
    ({ port } = server.server.address());
  });

  // this is executed before every test
  beforeEach(async () => {
    // Before each test we empty the database
    await User.deleteMany({}).exec();
    await Classroom.deleteMany({}).exec();
    // then add back some default values for testing
    user = await User.create({
      name: 'test user',
      email: 'test@default.com',
      isAdmin: false,
      password: 'none'
    });
    await user.setPassword('password');
    classroom = await Classroom.create({
      name: 'Test classroom',
      host: user.id,
    });
  });

  // the server should reject our connection if we are not logged in
  it('connect without credentials', async () => {
    // create a client and attempt to connect directly
    const clientSocket = new Client(`http://localhost:${port}`);
    // use a Promise here because we need to wait for the server to respond
    return (new Promise((resolve, reject) => {
      // if the server allow us to connect, fulfill the promise (resolve)
      clientSocket.once('connect', resolve);
      // if the server returns an error, reject the promise (reject)
      clientSocket.once('connect_error', reject);
    })).should.be.rejected; // we tell chai that the promise should be rejected
    // because we are not logged in
  });

  // same as above, but we provide incorrect access token
  it('connect with wrong credentials', async () => {
    const clientSocket = new Client(`http://localhost:${port}`, {
      extraHeaders: {
        Authorization: 'Bearer invalidaccesstoken'
      }
    });
    return (new Promise((resolve, reject) => {
      clientSocket.once('connect', resolve);
      clientSocket.once('connect_error', reject);
    })).should.be.rejected; // again, the promise "should.be.rejected", simple english
  });

  // this time, we log in, then attempt to connect
  // but because we haven't verified our email yet, the server should still
  // reject our connection
  it('connect with correct credentials but unverified email', async () => {
    // tell chai to send a log in request to our server (same as in auth.test.js)
    const res = await chai.request(server.app)
      .post('/api/auth/login')
      .set('content-type', 'application/json')
      .send({ email: 'test@default.com', password: 'password' });
    // make sure that the log in request is accepted first
    res.should.have.status(200);
    // accessToken is the data we want
    res.body.should.have.property('accessToken');
    // connect to server, providing the correct access token
    const clientSocket = new Client(`http://localhost:${port}`, {
      extraHeaders: {
        Authorization: `Bearer ${res.body.accessToken}`
      }
    });
    return (new Promise((resolve, reject) => {
      clientSocket.once('connect', resolve);
      clientSocket.once('connect_error', reject);
    })).should.be.rejected; // still expect the connection to fail
  });

  // set our email to be verified in the database, then attempt to connect
  it('connect with correct credentials and verified email', async () => {
    // just forcibly set our verified email to be email
    user.lastVerifiedEmail = user.email;
    await user.save();
    // send a log in request to server
    const res = await chai.request(server.app)
      .post('/api/auth/login')
      .set('content-type', 'application/json')
      .send({ email: 'test@default.com', password: 'password' });
    // make sure the log in request is accepted
    res.should.have.status(200);
    res.body.should.have.property('accessToken');
    // attempt to connect
    const clientSocket = new Client(`http://localhost:${port}`, {
      extraHeaders: {
        Authorization: `Bearer ${res.body.accessToken}`
      }
    });
    return (new Promise((resolve, reject) => {
      clientSocket.once('connect', resolve);
      clientSocket.once('connect_error', reject);
    })).should.be.fulfilled; // this time we expect the connection to be accepted
    // therefore the promise "should.be.filfilled"
  });
});
