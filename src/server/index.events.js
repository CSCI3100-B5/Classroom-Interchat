const externalEvents = require('./classroom/external.events');
const User = require('./models/user.model');
const Classroom = require('./models/classroom.model');
const config = require('./config/config');

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function indexEvents(socket, io) {
  // Add a metadata object to the packet
  socket.use(async (event, next) => {
    event.push({});
    next();
  });
  // Fetch the user from database
  socket.use(async (event, next) => {
    // TODO: remember to invalidate cache when user is changed
    event[event.length - 1].invoker = await User.getCached(socket.request.invoker.id);
    next();
  });
  // Fetch the classroom that the user is in from database
  // TODO: NOTE: this middleware assumes that the classroom is stored in
  // socket.request.invokerClassroom
  socket.use(async (event, next) => {
    if (!socket.request.invokerClassroom) return next();
    event[event.length - 1].invokerClassroom = await Classroom.getCached(
      socket.request.invokerClassroom.id
    );
    return next();
  });
  if (config.env === 'development') socket.onAny((...args) => console.log(args));

  // TODO: GUIDE: register all listeners here
  externalEvents(socket, io);
};
