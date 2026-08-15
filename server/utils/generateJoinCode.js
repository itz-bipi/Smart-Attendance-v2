const crypto = require("crypto");

const generateJoinCode = () => {
  return crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();
};

module.exports = generateJoinCode;