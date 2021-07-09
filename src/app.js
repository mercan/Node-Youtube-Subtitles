const fastify = require("fastify");

// Database connection
require("./helpers/database")();

function build(opts = {}) {
  const app = fastify(opts);

  app.register(require("fastify-compress"));
  app.register(require("fastify-helmet"));

  const videoRoutes = require("./api/routes/video");
  videoRoutes.forEach((route) => app.route(route));

  return app;
}

module.exports = build;
