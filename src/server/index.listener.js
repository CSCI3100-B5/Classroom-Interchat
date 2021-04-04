const external = require('./classroom/external.listener');
const User = require('./models/user.model');

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function indexListener(socket, io) {
  // TODO: any more efficient way to do this?
  // Right now a middleware query the database for every event sent by client
  // to get an up-to-date version of the User document
  socket.use(async (event, next) => {
    event[1].invoker = await User.findById(socket.request.invoker.id).exec();
    next();
  });
  external(socket, io);
};
