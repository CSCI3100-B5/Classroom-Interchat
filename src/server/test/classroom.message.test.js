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






    });
  });


  
  // all tests related to sending message
  describe('send message', () => {
    








  });

  /*describe('resolveQuestion', () =>{

  });*/
});
