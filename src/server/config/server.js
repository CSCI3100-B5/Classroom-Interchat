const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const { stringReplace } = require('string-replace-middleware');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const winstonInstance = require('./winston');
const routes = require('../index.route');
const events = require('../index.events');
const config = require('./config');
const APIError = require('../helpers/APIError');
const middlewareWrap = require('../helpers/middlewareWrap');
const { requireEmailVerified } = require('../helpers/requireAuth');

// initialize and set up Express and Socket.io

const app = express();
const server = http.Server(app);
const io = socketio(server, {
  cors: {
    origin: '*'
  }
});

// Reuse the express requireAccessToken middleware here
// for authenticating the user
// requireEmailVerified middleware also retrieves the user from database
// it can be accessed via socket.request.invoker
io.use(middlewareWrap(requireEmailVerified));
// move socket.request to socket.data for persistence
io.use((socket, next) => {
  socket.data.invoker = socket.request.invoker;
  next();
});

io.on('connection', (socket) => {
  events(socket, io);
});

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'"],
      'connect-src': ["'self'", "'unsafe-inline'", 'classroom-interchat-develop.herokuapp.com', 'classroom-interchat.herokuapp.com', '*']
    },
  }
}));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorize: true
  }));
}

// replace frontend API url with current server url
app.use(stringReplace({
  'http://localhost:8080/': config.baseUrl
}, {
  contentTypeFilterRegexp: /^text\/html/
}));

// serve frontend files
app.use(express.static('dist'));

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains details which contain errors in different parts
    const unifiedErrorMessage = Object.entries(err.details)
      .map(([key, value]) => value.map(error => `${key}: ${error.message}`).join('\n'))
      .join('\n');
    const error = new APIError(unifiedErrorMessage, err.statusCode ?? 500, true);
    return next(error);
  } if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status ?? err.statusCode ?? 500, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch all API 404 and forward to error handler
app.use('/api', (req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// catch all other 404 and server index.html instead
// This is needed because of how react router works
// URLs that do not exist should be handled client-side
// and it is react router's job to show the 404 page
app.use((req, res) => res.sendFile(path.join(__dirname, '../../../dist', 'index.html')));

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => res.status(err.status).json({ // eslint-disable-line no-unused-vars
  message: err.isPublic ? err.message : httpStatus[err.status],
  stack: config.env === 'development' ? err.stack : {}
}));


module.exports = { app, server, io };
