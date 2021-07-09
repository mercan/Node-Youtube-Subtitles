const config = require("../config/index");
const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("open", () => console.log("MongoDB: Connected"));
  mongoose.connection.on("error", (error) => console.error("MongoDB: Error ", error));
};
