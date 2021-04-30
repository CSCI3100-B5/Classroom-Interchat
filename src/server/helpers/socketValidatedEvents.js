const httpStatus = require('http-status');
const APIError = require('./APIError');
/**
 * Helper class to subscribe to socket.io events and validate each event using
 * a Joi schema in a socket.io middleware
 */
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

  /**
   * Register an event for the socket
   * @param {string} event name of the socket.io event
   * @param {import('joi').Schema|(packet:any[],socket:import('socket.io').Socket,io:import('socket.io').Server) => void} validationOrHandler Joi validation schema or the event handler
   * @param {(packet:any[],socket:import('socket.io').Socket,io:import('socket.io').Server) => void} handler event handler
   */
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

  /**
   * Subscribe to all the registered events and initialize the validation middleware
   */
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
