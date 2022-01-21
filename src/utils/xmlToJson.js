const parser = require("fast-xml-parser");
const fs = require("fs");

module.exports = (videoId) => {
  const prefix = ">";
  const files = fs.readdirSync(`${__dirname}/../subtitles`);
  const selectedFiles = files.filter((file) => file.startsWith(videoId));

  if (!selectedFiles.length) {
    return null;
  }

  const [, title] = selectedFiles[0].split(prefix);

  const options = {
    attrNodeName: "attr",
    textNodeName: "text",
    attributeNamePrefix: "",
    arrayMode: "false",
    ignoreAttributes: false,
    parseAttributeValue: true,
  };

  const xmlDataTR = fs.readFileSync(
    `${__dirname}/../subtitles/${videoId}>${title}>.tr.ttml`,
    {
      encoding: "utf-8",
    }
  );
  const xmlDataEN = fs.readFileSync(
    `${__dirname}/../subtitles/${videoId}>${title}>.en.ttml`,
    {
      encoding: "utf-8",
    }
  );

  const jsonDataTR = parser.parse(xmlDataTR, options, true);
  const jsonDataEN = parser.parse(xmlDataEN, options, true);

  const subtitles = [
    {
      flag: "tr",
      subtitle: jsonDataTR.tt.body.div.p,
    },
    {
      flag: "en",
      subtitle: jsonDataEN.tt.body.div.p,
    },
  ];

  for (const index in subtitles) {
    subtitles[index].subtitle = subtitles[index].subtitle.flatMap(
      ({ text, attr }) => {
        const { begin: start, end } = attr;

        return text
          ? { text: String(text).replace(/&#39;/g, "'"), start, end }
          : [];
      }
    );
  }

  selectedFiles.forEach((file) =>
    fs.unlinkSync(`${__dirname}/../subtitles/${file}`)
  );

  return { id: videoId, title, subtitles };
};
