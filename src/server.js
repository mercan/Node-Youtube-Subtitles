const config = require("./config/index");
const server = require("./app")({
  logger: {
    level: config.logger.level,
    prettyPrint: {
      colorize: true,
    },
  },
  trustProxy: true,
});

server.listen(config.port, "0.0.0.0", (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log(`Server listening on ${address}`);
  server.log.info(`Server listening on ${address}`);
});
