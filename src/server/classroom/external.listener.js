/**
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
module.exports = function externalListener(socket, io) {
  socket.onAny((...args) => console.log(args));
  socket.emit('hello world', { success: true, userId: socket.request.invoker.id });
};
