const { notifyEnrolledStudents } = require("../socket/attendanceSocket");

const {
  startAttendanceSession: startAttendanceSessionService,
  getActiveSession: getActiveSessionService,
  closeAttendanceSession: closeAttendanceSessionService,
  getMyActiveSessions: getMyActiveSessionsService,
  generateStudentAttendanceToken: generateStudentAttendanceTokenService,
   verifyStudentAttendanceToken:
    verifyStudentAttendanceTokenService,
} = require("../services/attendanceService");

const startAttendanceSession = async (req, res) => {
  try {
    const { subjectId, latitude, longitude } = req.body;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required",
      });
    }

    const session = await startAttendanceSessionService(
      subjectId,
      req.user.id,
      latitude,
      longitude,
    );

    const io = req.app.get("io");

    try {
      await notifyEnrolledStudents(io, session);
    } catch (socketError) {
      console.error("Failed to notify enrolled students:", socketError.message);
    }

    res.status(201).json({
      success: true,
      message: "Attendance session started successfully",

      session: {
        id: session._id,
        subjectId: session.subjectId,
        classId: session.classId,
        sessionCode: session.sessionCode,
        status: session.status,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
        teacherLocation: session.teacherLocation,
        allowedRadius: session.allowedRadius,
      },
    });
  } catch (error) {
    console.error("Start attendance session error:", error.message);

    if (
      error.message === "Invalid subject ID" ||
      error.message === "Subject not found" ||
      error.message === "Class not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "You are not authorized to start attendance for this subject" ||
      error.message === "Subject is inactive" ||
      error.message === "Class is inactive"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "An attendance session is already active for this subject" ||
      error.message === "Valid latitude and longitude are required" ||
      error.message === "Invalid latitude" ||
      error.message === "Invalid longitude"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to start attendance session",
    });
  }
};

const getActiveSession = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const session = await getActiveSessionService(subjectId, req.user.id);

    res.status(200).json({
      success: true,
      session: {
        id: session._id,
        subjectId: session.subjectId,
        classId: session.classId,
        sessionCode: session.sessionCode,
        status: session.status,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
        teacherLocation: session.teacherLocation,
        allowedRadius: session.allowedRadius,
      },
    });
  } catch (error) {
    console.error("Get active session error:", error.message);

    if (
      error.message === "Invalid subject ID" ||
      error.message === "Subject not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "You are not authorized to view this session") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "No active attendance session found" ||
      error.message === "Attendance session has expired"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch active session",
    });
  }
};

const closeAttendanceSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await closeAttendanceSessionService(sessionId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Attendance session closed successfully",
      session: {
        id: session._id,
        subjectId: session.subjectId,
        classId: session.classId,
        status: session.status,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
        closedAt: session.closedAt,
      },
    });
  } catch (error) {
    console.error("Close attendance session error:", error.message);

    if (
      error.message === "Invalid session ID" ||
      error.message === "Attendance session not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "You are not authorized to close this session") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.startsWith("Session is already")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to close attendance session",
    });
  }
};

const getMyActiveSessions = async (req, res) => {
  try {
    const sessions = await getMyActiveSessionsService(req.user.id);

    res.status(200).json({
      success: true,
      sessions: sessions.map((session) => ({
        id: session._id,

        subject: session.subjectId
          ? {
              id: session.subjectId._id,
              subjectName: session.subjectId.subjectName,
              subjectCode: session.subjectId.subjectCode,
            }
          : null,

        class: session.classId
          ? {
              id: session.classId._id,
              className: session.classId.className,
              year: session.classId.year,
              section: session.classId.section,
              academicYear: session.classId.academicYear,
            }
          : null,

        status: session.status,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,

        // Don't expose teacher's exact location
        // to the student.
        allowedRadius: session.allowedRadius,
      })),
    });
  } catch (error) {
    console.error("Get my active sessions error:", error.message);

    if (error.message === "Invalid student ID") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch active sessions",
    });
  }
};

const generateStudentAttendanceToken = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await generateStudentAttendanceTokenService(
      sessionId,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Attendance token generated successfully",
      token: result.token,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("Generate attendance token error:", error.message);

    if (
      error.message === "Invalid session ID" ||
      error.message === "Invalid student ID" ||
      error.message === "Attendance session not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Attendance session is not active" ||
      error.message === "Attendance session has expired"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Student is not enrolled in this subject") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate attendance token",
    });
  }
};

const verifyStudentAttendanceToken = async (
  req,
  res
) => {
  try {
    const { token } = req.body;

    const result =
      await verifyStudentAttendanceTokenService(
        token,
        req.user.id
      );

    res.status(200).json({
      success: true,
      message: "Attendance token is valid",

      session: {
        id: result.session._id,
        subjectId: result.session.subjectId,
        classId: result.session.classId,
        startedAt: result.session.startedAt,
        expiresAt: result.session.expiresAt,
        allowedRadius:
          result.session.allowedRadius,
      },
    });
  } catch (error) {
    console.error(
      "Verify attendance token error:",
      error.message
    );

    if (
      error.message ===
        "Attendance token is required" ||
      error.message ===
        "Invalid or expired attendance token"
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Invalid student ID" ||
      error.message ===
        "Attendance session not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "Attendance token does not belong to this student" ||
      error.message ===
        "Student is not enrolled in this subject"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "Attendance session is not active" ||
      error.message ===
        "Attendance session has expired"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to verify attendance token",
    });
  }
};

module.exports = {
  startAttendanceSession,
  getActiveSession,
  closeAttendanceSession,
  getMyActiveSessions,
  generateStudentAttendanceToken,
  verifyStudentAttendanceToken
};
