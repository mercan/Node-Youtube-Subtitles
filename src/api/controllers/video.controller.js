const VideoService = require("../../services/Video");

const searchText = async (req, res) => {
  const { url, text, lang = "tr" } = req.query;

  const youtube = "https://www.youtube.com";
  const youtubeURL = new URL(url.length !== 11 ? url : `${youtube}/watch?v=${url}`);
  const videoId = youtubeURL.searchParams.get("v") ?? youtubeURL.pathname.slice(1);
  const regex = /^[a-zA-Z0-9_-]{11}$/;

  if (!regex.test(videoId)) {
    return res.code(400).send({
      status: 400,
    });
  }

  const subtitles = await VideoService.findOne(videoId, text.trim(), lang);
  return res.code(200).send({ status: 200, subtitles });
};

module.exports = { searchText };
