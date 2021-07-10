const VideoService = require("../../services/Video");

const searchText = async (req, res) => {
  let { url, text, lang = "tr", trim = false } = req.query;

  const youtube = "https://www.youtube.com/watch?v=";
  const youtubeUrlRegex =
    /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;

  if (!youtubeUrlRegex.test(url)) {
    if (url.length === 11) {
      url = `${youtube}${url}`;
    } else {
      return res.code(400).send({
        statusCode: 400,
        message: "Invalid url",
      });
    }
  }

  const youtubeURL = new URL(url);
  const videoId = youtubeURL.searchParams.get("v") ?? youtubeURL.pathname.slice(1);

  if (videoId.length !== 11) {
    return res.code(400).send({
      statusCode: 400,
      message: "Invalid url",
    });
  }
  const subtitles = await VideoService.findOne(videoId, trim == "true" ? text.trim() : text, lang);

  if (subtitles.server) {
    return res.code(500).send({ statusCode: 500, message: subtitles.server });
  }

  if (subtitles.message) {
    return res.code(404).send({ statusCode: 404, message: subtitles.message });
  }

  if (subtitles.error) {
    return res.code(400).send({ statusCode: 400, message: subtitles.error });
  }

  return res.code(200).send({ statusCode: 200, subtitles });
};

module.exports = { searchText };
