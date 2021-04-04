const external = require('./classroom/external.listener');
const User = require('./models/user.model');
const Classroom = require('./models/classroom.model');

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function indexListener(socket, io) {
  // Fetch the user from database
  socket.use(async (event, next) => {
    // TODO: remember to invalidate cache when user is changed
    event[1].invoker = await User.getCached(socket.request.invoker.id);
    next();
  });
  // Fetch the classroom that the user is in from database
  socket.use(async (event, next) => {
    if (!socket.request.invokerClassroom) return next();
    event[1].invokerClassroom = await Classroom.getCached(socket.request.invokerClassroom.id);
    next();
  });
  external(socket, io);
};
