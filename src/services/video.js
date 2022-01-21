const videoModel = require("../models/video");
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

    return subtitles.map(({ subtitles }) => {
      let { start, end, text } = subtitles.subtitle;

      start = start.split(".")[0];
      end = end.split(".")[0];
      const startTime = start.split(":");
      const endTime = end.split(":");

      const startTimes = {
        hours: parseInt(startTime[0]),
        minutes: parseInt(startTime[1]),
        seconds: parseInt(startTime[2]),
      };

      const endTimes = {
        hours: parseInt(endTime[0]),
        seconds: parseInt(endTime[2]),
        minutes: parseInt(endTime[1]),
      };

      return {
        text,
        start: {
          hours: startTimes.hours,
          minutes: startTimes.minutes,
          seconds: startTimes.seconds,
        },
        end: {
          hours: endTimes.hours,
          minutes: endTimes.minutes,
          seconds: endTimes.seconds,
        },
        videoURL: `https://www.youtube.com/embed/${videoId}?start=${
          startTimes.hours * 3600 + startTimes.minutes * 60 + startTimes.seconds
        }&end=${
          endTimes.hours * 3600 + endTimes.minutes * 60 + endTimes.seconds
        }`,
      };
    });
  }

  async add(videoId) {
    try {
      await this.addVideo(videoId);
    } catch (err) {
      return { error: err };
    }

    const subtitles = await this.xmlToJson(videoId);

    if (!subtitles) {
      return {
        error: "No subtitles found",
      };
    }

    try {
      await this.videoModel.create(subtitles);
    } catch (err) {
      return {
        error: { code: err.code, keyPattern: Object.keys(err.keyPattern) },
      };
    }

    return true;
  }
}

module.exports = new VideoService(Depenencies);
