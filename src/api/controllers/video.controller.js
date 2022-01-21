const VideoService = require("../../services/video");

const searchText = async (req, res) => {
  let { url, text, lang = "tr" } = req.query;

  const youtube = "https://www.youtube.com/watch?v=";
  const youtubeUrlRegex =
    /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;

  if (!youtubeUrlRegex.test(url)) {
    if (url.length === 11) {
      url = `${youtube}${url}`;
    } else {
      return res.code(400).send({
        statusCode: 400,
        message: "Invalid URL",
      });
    }
  }

  const youtubeURL = new URL(url);
  const videoId =
    youtubeURL.searchParams.get("v") ?? youtubeURL.pathname.slice(1);

  if (videoId.length !== 11) {
    return res.code(400).send({
      statusCode: 400,
      message: "Invalid URL",
    });
  }

  const subtitles = await VideoService.findOne(videoId, text, lang);

  if (subtitles.error) {
    return res.code(400).send({ statusCode: 400, message: subtitles.error });
  }

  return res.code(200).send({ statusCode: 200, subtitles });
};

module.exports = { searchText };
