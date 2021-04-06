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
  const addObject = async (event, next) => {
    event.push({});
    next();
  };
  socket.use(addObject);
  // Fetch the user from database
  const addUser = async (event, next) => {
    // TODO: remember to invalidate cache when user is changed
    event[event.length - 1].invoker = await User.getCached(socket.data.invoker.id);
    next();
  };
  socket.use(addUser);
  // Fetch the classroom that the user is in from database
  // TODO: NOTE: this middleware assumes that the classroom is stored in
  // socket.data.invokerClassroom
  const addClassroom = async (event, next) => {
    if (!socket.data.invokerClassroom) return next();
    event[event.length - 1].invokerClassroom = await Classroom.getCached(
      socket.data.invokerClassroom.id
    );
    return next();
  };
  socket.use(addClassroom);

  if (config.env === 'development') {
    const log = (...args) => console.log(args);
    log('connect');
    socket.onAny(log);
    socket.on('disconnect', (...args) => log('disconnect', ...args));
  }

  // join the user's own "room"
  socket.join(socket.data.invoker.id);

  // TODO: GUIDE: register all listeners here
  externalEvents(socket, io);
};
