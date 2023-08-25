// NO ES6 HERE as it's used by several binaries not using babel
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), "./.env") });

const environment = process.env.NODE_ENV || "development";
const isLocal = !!process.env.NODE_ENV;
const port = parseInt(process.env.PORT) || 3333;
module.exports = {
  APP_SECRET: process.env.APP_SECRET,
  ENVIRONMENT: environment,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  IS_PRODUCTION: environment === "production",
  IS_STAGING: environment === "staging",
  IS_DEVELOPMENT: environment === "development",
  IS_TEST: environment === "test",
  PORT: port,
  KILL_TIMEOUT: parseInt(process.env.KILL_TIMEOUT) || 5 * 1000,
  NODE_APP_INSTANCE: parseInt(process.env.NODE_APP_INSTANCE) || 0,
  IS_LOCAL: isLocal,
  SITE_URL: process.env.SITE_URL || `http://localhost:${port}`,
  DATABASE: {
    HOST: process.env.DATABASE__HOST,
    PORT: process.env.DATABASE__PORT || 5432,
    NAME: process.env.DATABASE__NAME,
    USER: process.env.DATABASE__USER,
    PASSWORD: process.env.DATABASE__PASSWORD,
  },
  DEFAULT_PAGINATION_LIMIT: 100,
};
