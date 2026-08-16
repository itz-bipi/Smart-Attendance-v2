const jwt = require("jsonwebtoken");

const verifyAttendanceToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.ATTENDANCE_JWT_SECRET
    );

    if (decoded.type !== "ATTENDANCE") {
      throw new Error("Invalid attendance token");
    }

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired attendance token");
  }
};

module.exports = verifyAttendanceToken;