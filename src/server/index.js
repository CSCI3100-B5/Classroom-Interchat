// Entry point to the server

const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const util = require('util');
const debug = require('debug')('classroom-interchat:index');

// config should be imported before importing any other file
const config = require('./config/config');
const { app, server } = require('./config/server');


// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.env === 'test' ? config.mongo.testHost : config.mongo.host;
mongoose.connect(mongoUri, { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// setup cachegoose
cachegoose(mongoose);

// listen on port config.port
server.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

// export the express app and the http server for testing
module.exports = { app, server };
