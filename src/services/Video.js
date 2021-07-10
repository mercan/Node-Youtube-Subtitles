const videoModel = require("../models/Video");
const addVideo = require("../utils/addVideo");
const xmlToJson = require("../utils/xmlToJson");

const Depenencies = {
  videoModel,
  addVideo,
  xmlToJson,
};

class VideoService {
  constructor({ videoModel, addVideo, xmlToJson }) {
    this.videoModel = videoModel;
    this.addVideo = addVideo;
    this.xmlToJson = xmlToJson;
  }

  async findOne(videoId, text, lang) {
    const exists = await this.videoModel.findOne({ id: videoId }, "_id");

    if (!exists) {
      const { error, message } = await this.add(videoId);

      if (message) {
        return { message };
      }

      if (error) {
        return { error };
      }
    }

    const regex = new RegExp(`\\b${text}\\b`, "i");
    const subtitles = await this.videoModel.aggregate([
      {
        $unwind: "$subtitles",
      },
      {
        $unwind: "$subtitles.subtitle",
      },
      {
        $match: {
          id: videoId,
          "subtitles.flag": lang,
          "subtitles.subtitle.text": { $regex: regex },
        },
      },
      {
        $project: {
          _id: 0,
          "subtitles.subtitle": 1,
        },
      },
    ]);

    return subtitles.map(({ subtitles }) => subtitles.subtitle);
  }

  async add(videoId) {
    try {
      await this.addVideo(videoId);
    } catch (err) {
      return { message: err.startsWith("ERROR: ") ? err.split("ERROR: ")[1].trim() : err.trim() };
    }

    const subtitles = await this.xmlToJson(videoId);

    if (!subtitles) {
      return { server: "Server error" };
    }

    try {
      await this.videoModel.create(subtitles);
    } catch (err) {
      return { error: { code: err.code, keyPattern: Object.keys(err.keyPattern) } };
    }

    return true;
  }
}

module.exports = new VideoService(Depenencies);
