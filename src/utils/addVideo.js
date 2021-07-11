const { exec } = require("child_process");

module.exports = (videoId) => {
  const query = `youtube-dl --no-check-certificate --skip-download --write-auto-sub --sub-lang=tr,en --sub-format=ttml -o "src/subtitles/%(id)s>%(title)s>.%(ext)s" -- "${videoId}"`;

  return new Promise((resolve, reject) => {
    exec(query, { shell: "/bin/sh" }, (err, stdout, stderr) => {
      if (stderr || err) {
        return reject(stderr || err);
      }

      console.log(stdout);
      return resolve(true);
    });
  });
};
