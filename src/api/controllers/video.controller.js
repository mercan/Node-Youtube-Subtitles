const VideoService = require("../../services/Video");

const searchText = async (req, res) => {
  const { url, text, lang = "tr", trim = false } = req.query;

  const youtube = "https://www.youtube.com";
  const youtubeURL = new URL(url.length !== 11 ? url : `${youtube}/watch?v=${url}`);
  const videoId = youtubeURL.searchParams.get("v") ?? youtubeURL.pathname.slice(1);
  const regex = /^[a-zA-Z0-9_-]{11}$/;

  if (!regex.test(videoId)) {
    return res.code(400).send({
      status: 400,
    });
  }

  const subtitles = await VideoService.findOne(videoId, trim ? text.trim() : text, lang);

  if (subtitles.message) {
    return res.code(404).send({ status: 404, message: subtitles.message });
  }

  if (subtitles.error) {
    return res.code(400).send({ status: 400, message: subtitles.error });
  }

  return res.code(200).send({ status: 200, subtitles });
};

module.exports = { searchText };
