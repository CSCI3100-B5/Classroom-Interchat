// converts an express middleware to a socket.io middleware
module.exports = middleware => (socket, next) => middleware(socket.request, {}, next);
