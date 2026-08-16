const Enrollment = require("../models/Enrollment");
const generateAttendanceToken = require(
  "../utils/generateAttendanceToken"
);

const {
  getUserSockets,
} = require("./socketRegistry");

const notifyEnrolledStudents = async (io, session) => {
  // Find all active students enrolled in this subject
  const enrollments = await Enrollment.find({
    subjectId: session.subjectId,
    status: "active",
  }).select("studentId");

  console.log(
    `Found ${enrollments.length} enrolled students`
  );

  for (const enrollment of enrollments) {
    const studentId =
      enrollment.studentId.toString();

    // Find student's connected sockets
    const studentSockets =
      getUserSockets(studentId);

    if (studentSockets.size === 0) {
      console.log(
        `Student ${studentId} is not connected`
      );

      continue;
    }

    // Generate a unique token for this student
    const token = generateAttendanceToken({
      sessionId: session._id.toString(),
      studentId,
      subjectId: session.subjectId.toString(),
    });

    // Send to every active socket of this student
    studentSockets.forEach((socketId) => {
      io.to(socketId).emit(
        "attendance-session-started",
        {
          sessionId: session._id,
          subjectId: session.subjectId,
          classId: session.classId,

          token,

          startedAt: session.startedAt,
          expiresAt: session.expiresAt,

          allowedRadius:
            session.allowedRadius,
        }
      );
    });

    console.log(
      `Attendance session sent to student ${studentId}`
    );
  }
};

module.exports = {
  notifyEnrolledStudents,
};