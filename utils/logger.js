// var winston = require("winston");
// var morgan = require("morgan");
// var path = require("path");

// const customFormat = winston.format.printf(({ source = "" }) => `${source}`);

// // created separate httpLogger because we want to log express request separatly
// const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     customFormat,
//     winston.format.json()
//   ),

//   defaultMeta: { service: "app-service" },
//   transports: [
//     new winston.transports.File({
//       filename: "./logs/combine.log",
//       level: "info",
//       json: true,
//       maxsize: 5242880,
//       colorize: false,
//     }),
//     new winston.transports.File({
//       filename: "./logs/error.log",
//       level: "error",
//       json: false,
//       maxsize: 5242880,
//       colorize: true,
//     }),
//     new winston.transports.File({
//       filename: "./logs/debug.log",
//       level: "debug",
//       json: false,
//       maxsize: 5242880,
//       colorize: true,
//     }),
//   ],
//   exceptionHandlers: [
//     new winston.transports.File({
//       filename: "logs/exceptions.log",
//       json: true,
//       maxsize: 5242880,
//       colorize: false,
//     }),
//   ],
//   exitOnError: false,
// });

// var httpLogger = winston.createLogger({
//   transports: [
//     new winston.transports.File({
//       filename: "logs/http.log",
//       json: true,
//       maxsize: 5242880,
//       maxFiles: 5,
//       colorize: false,
//     }),
//   ],
//   exitOnError: false,
// });


// // appender function to use winston file transport
// var stream = {
//     write: function (message, encoding) {
//       httpLogger.info(message);
//     }
//   };
  
//   // morgan is used to capture http log
//   morgan.format('full', ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] | :response-time ms ":referrer" ":user-agent"')
//   // wrapper function act as middleware for express
//   logger.startHttpLogger = function () {
//     return morgan('full', {
//       stream: stream
//     });
//   };
  
//   module.exports = logger;