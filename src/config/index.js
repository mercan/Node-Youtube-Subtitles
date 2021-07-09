require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.MONGODB_URI,
  logger: {
    level: process.env.LOG_LEVEL || "error",
  },
};
