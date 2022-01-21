const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Video = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
      maxlength: 11,
      minlength: 11,
      validate: /^[a-zA-Z0-9_-]{11}$/,
    },

    title: {
      type: String,
      required: true,
    },

    subtitles: [
      {
        _id: false,
        flag: {
          type: String,
          required: true,
          enum: ["tr", "en"],
        },

        subtitle: [
          {
            _id: false,
            text: {
              type: String,
              required: true,
            },

            start: {
              type: String,
              required: true,
            },

            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

Video.index({ "subtitles.subtitle.text": 1 });
module.exports = mongoose.model("video", Video);
