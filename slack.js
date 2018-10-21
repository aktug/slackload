const request = require("request");
const fs = require("fs");
const nodePath = require("path");
const os = require("os");
const compression = require("./compression");
require("dotenv").config();

let options = file => ({
  hostname: "slack.com",
  port: 443,
  url: process.env.API_URL,
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data"
  },
  formData: {
    token: process.env.API_TOKEN,
    channels: process.env.FILE_UPLOAD_CHANNELS,
    pretty: 1,
    file: fs.createReadStream(file)
  }
});

let inputGlob = {
  pattern: process.env.GLOB_PATTERN,
  options: process.env.GLOB_OPTIONS && JSON.parse(process.env.GLOB_OPTIONS)
};

const outputFile = nodePath.join(
  os.tmpdir(),
  new Date().toLocaleString() + ".zip"
);


compression.exec(inputGlob, outputFile).then(() => {
  console.log("Folder archived and size is", fs.statSync(outputFile).size);

  request(options(outputFile), (err, res, body) => {
    if (err) console.error(err);
    try {
      if (JSON.parse(body).ok === true) {
        console.log("UPLOADED OK");
        fs.unlink(outputFile, (err) => {
          if(err) console.error(err);
        });
      }
    } catch (err) {
      console.error("ERROR:", err);
    }
  });
});
