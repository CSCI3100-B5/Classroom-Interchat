/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function externalListener(socket, io) {
  // TODO: verify access token on first connection
  console.log('Client connected');
  socket.onAny((...args) => console.log(args));
  socket.emit('hello world', { success: true });
};
