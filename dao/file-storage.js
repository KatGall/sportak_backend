const fs = require("fs");

function readJson(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, defaultValue);
    return defaultValue;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  if (!content) {
    return defaultValue;
  }

  return JSON.parse(content);
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readJson,
  writeJson,
};
