const winston = require('winston');

// configure the winston logger
const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      )
    })
  ]
});

module.exports = logger;
