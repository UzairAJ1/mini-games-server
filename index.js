// const StartAPI = require("./src/server.js");
// module.exports = StartAPI;

/**
 * Module dependencies.
 */
const http = require("http");

const terminus = require("@godaddy/terminus");

const servicesInitializer = require("./src/services");
const logger = require("./src/services/logger");
const connectToDB = require("./src/services");
const app = require("./src/app");
const config = require("./configurations.js");

/**
 * Get port from environment and store in Express.
 */
const port = config.PORT;
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

servicesInitializer({});
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

terminus.createTerminus(server, {
  healthChecks: {
    "/health": healthCheck, // a promise returning function indicating service health
  },
  timeout: config.KILL_TIMEOUT,
  signals: ["SIGTERM", "SIGINT"],
  onSignal,
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1); // eslint-disable-line no-process-exit
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1); // eslint-disable-line no-process-exit
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  logger.log("Listening on " + bind);
}

async function healthCheck() {
  return Promise.resolve(true);
}

async function onSignal() {
  return Promise.all([connectToDB.destroy()]);
}
