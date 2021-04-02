const external = require('./classroom/external.listener');

/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function indexListener(socket, io) {
  external(socket, io);
};
