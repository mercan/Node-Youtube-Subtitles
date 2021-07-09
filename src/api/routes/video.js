const videoController = require("../controllers/video.controller");

const routes = [
  {
    method: "GET",
    url: "/search",
    handler: videoController.searchText,
  },
];

module.exports = routes;
