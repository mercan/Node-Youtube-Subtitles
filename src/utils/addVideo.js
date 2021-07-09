const { exec } = require("child_process");

module.exports = (videoId) => {
  const query = `youtube-dl --skip-download --write-auto-sub --no-check-certificate --sub-lang=tr,en --sub-format=ttml -o "src/subtitles/%(id)s>%(title)s>.%(ext)s"  "${videoId}"`;

  return new Promise((resolve, reject) => {
    exec(query, (err, stdout, stderr) => {
      if (err || stderr) {
        console.error(err || stderr);
        return reject(false);
      }

      console.log(stdout);
      resolve(true);
    });
  });
};
