const crypto = require("crypto");

const generateSessionCode = () => {
  return crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase();
};

module.exports = generateSessionCode;