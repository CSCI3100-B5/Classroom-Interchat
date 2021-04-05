const httpStatus = require('http-status');
const APIError = require('./APIError');

module.exports = class SocketValidatedEvents {
  /**
   * @param {import('socket.io').Socket} socket
   * @param {import('socket.io').Server} io
   */
  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
    this.events = [];
  }

  on(event, validation, handler) {
    this.events.push({ event, validation, handler });
  }

  register() {
    this.socket.use((packet, next) => {
      const [event, data] = packet;
      const entry = this.events.find(x => x.event === event);
      if (!entry) return next();
      const { error, value } = entry.validation.validate(data);
      if (error) return next(new APIError(error, httpStatus.BAD_REQUEST, true));
      packet[1] = value;
      return next();
    });
    this.events.forEach(
      ({ event, handler }) => {
        this.socket.on(event, (...packet) => handler(packet, this.socket, this.io));
      }
    );
  }
};
