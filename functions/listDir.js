const fs = require("fs");

async function listDir(path) {
  try {
    return await fs.promises.readdir(path);
  } catch (err) {
    console.error("Error occurred while reading directory!", err);
  }
}

module.exports = listDir;
