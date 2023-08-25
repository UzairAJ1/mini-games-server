const ServiceBase = require("./base");

/* eslint-disable no-console */
class Logger extends ServiceBase {
  async _initialize() {
    return true;
  }
  debug(...params) {
    console.log(...params);
  }
  log(...params) {
    console.log(...params);
  }
  error(...params) {
    console.error(...params);
  }
}

module.exports = new Logger();
