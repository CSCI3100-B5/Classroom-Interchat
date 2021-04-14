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

  on(event, validationOrHandler, handler) {
    if (handler === undefined) {
      this.events.push({
        event,
        handler: validationOrHandler
      });
    } else {
      this.events.push({
        event,
        validation: validationOrHandler,
        handler
      });
    }
  }

  register() {
    this.socket.use((packet, next) => {
      const [event, data, callback] = packet;
      const entry = this.events.find(x => x.event === event);
      if (!entry) return next();
      if (!entry.validation) return next();
      const { error, value } = entry.validation.validate(data);
      if (error) {
        if (callback) return callback({ error: error.details[0].message });
        return next(new APIError(error, httpStatus.BAD_REQUEST, true));
      }
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
