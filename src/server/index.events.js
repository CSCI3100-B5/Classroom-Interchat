const external = require('./classroom/external.events');
const User = require('./models/user.model');
const Classroom = require('./models/classroom.model');
const config = require('./config/config');

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function indexListener(socket, io) {
  // Wrap the event data in an object
  socket.use(async (event, next) => {
    event[1] = { payload: event[1] };
    next();
  });
  // Fetch the user from database
  socket.use(async (event, next) => {
    // TODO: remember to invalidate cache when user is changed
    event[1].invoker = await User.getCached(socket.request.invoker.id);
    next();
  });
  // Fetch the classroom that the user is in from database
  // TODO: NOTE: this middleware assumes that the classroom is stored in
  // socket.request.invokerClassroom
  socket.use(async (event, next) => {
    if (!socket.request.invokerClassroom) return next();
    event[1].invokerClassroom = await Classroom.getCached(socket.request.invokerClassroom.id);
    next();
  });
  if (config.env === 'development') socket.onAny((...args) => console.log(args));

  // TODO: GUIDE: register all listeners here
  external(socket, io);
};
