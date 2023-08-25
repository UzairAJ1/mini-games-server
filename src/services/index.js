const connectToDB = require("./db-connection");
const logger = require("./logger");

exports.logger = logger;
exports.connectToDB = connectToDB;

module.exports = async function initialize({ loggerConfig }) {
  await logger.initialize(loggerConfig);
  connectToDB();
};

// export { logger, connectToDB };
