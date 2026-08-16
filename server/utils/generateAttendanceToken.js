const jwt = require("jsonwebtoken");

const generateAttendanceToken = ({
  sessionId,
  studentId,
  subjectId,
}) => {
  return jwt.sign(
    {
      sessionId,
      studentId,
      subjectId,
      type: "ATTENDANCE",
    },
    process.env.ATTENDANCE_JWT_SECRET,
    {
      expiresIn: "2m",
    }
  );
};

module.exports = generateAttendanceToken;