const { notifyEnrolledStudents } = require("../socket/attendanceSocket");

const {
  startAttendanceSession: startAttendanceSessionService,
  getActiveSession: getActiveSessionService,
  closeAttendanceSession: closeAttendanceSessionService,
  getMyActiveSessions: getMyActiveSessionsService,
  generateStudentAttendanceToken: generateStudentAttendanceTokenService,
  verifyStudentAttendanceToken:
    verifyStudentAttendanceTokenService,
  verifyStudentLocation:
    verifyStudentLocationService,  
   verifyStudentFace:
    verifyStudentFaceService,
    markAttendance:
    markAttendanceService,  
     getStudentAttendanceHistory:
    getStudentAttendanceHistoryService,
    getSessionAttendance:
    getSessionAttendanceService,
    getCompleteSessionAttendance:
    getCompleteSessionAttendanceService,
    getSubjectAttendanceStats:
    getSubjectAttendanceStatsService,
    getStudentAttendanceStats:
    getStudentAttendanceStatsService,
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

const verifyStudentLocation = async (
  req,
  res
) => {
  try {
    const {
      token,
      latitude,
      longitude,
    } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Attendance token is required",
      });
    }

    const result =
      await verifyStudentLocationService(
        token,
        latitude,
        longitude,
        req.user.id
      );

    res.status(200).json({
      success: true,
      message: "Student location verified successfully",

      location: {
        verified: result.verified,
        distance: Math.round(result.distance),
        allowedRadius: result.allowedRadius,
      },
    });
  } catch (error) {
    console.error(
      "Verify student location error:",
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

    if (
      error.message ===
        "Valid latitude and longitude are required" ||
      error.message === "Invalid latitude" ||
      error.message === "Invalid longitude"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
      "Student is outside the allowed attendance location"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to verify student location",
    });
  }
};

const verifyStudentFace = async (
  req,
  res
) => {
  try {
    const { faceDescriptor } = req.body;

    if (!faceDescriptor) {
      return res.status(400).json({
        success: false,
        message:
          "Face descriptor is required",
      });
    }

    const result =
      await verifyStudentFaceService(
        req.user.id,
        faceDescriptor
      );

    res.status(200).json({
      success: true,
      message: "Face verified successfully",
      faceVerification: {
        verified: result.verified,
        distance: result.distance,
        threshold: result.threshold,
      },
    });
  } catch (error) {
    console.error(
      "Face verification error:",
      error.message
    );

    if (
      error.message ===
        "Invalid student ID" ||
      error.message ===
        "Student not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "Face descriptor is required" ||
      error.message ===
        "Invalid face descriptor"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "Face is not registered for this student"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
      "Face verification failed"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to verify face",
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const {
      token,
      latitude,
      longitude,
      faceDescriptor,
    } = req.body;

    const result =
      await markAttendanceService({
        token,
        latitude,
        longitude,
        faceDescriptor,
        studentId: req.user.id,
      });

    res.status(201).json({
      success: true,
      message:
        "Attendance marked successfully",

      attendance: {
        id: result.attendanceRecord._id,
        sessionId:
          result.attendanceRecord.sessionId,
        studentId:
          result.attendanceRecord.studentId,
        subjectId:
          result.attendanceRecord.subjectId,
        classId:
          result.attendanceRecord.classId,
        status:
          result.attendanceRecord.status,
        markedAt:
          result.attendanceRecord.markedAt,
      },

      verification: {
        qr: true,
        geo: true,
        face: true,
        distance: Math.round(
          result.distance
        ),
        faceDistance:
          result.faceDistance,
      },
    });
  } catch (error) {
    console.error(
      "Mark attendance error:",
      error.message
    );

    // ------------------------------------------
    // 401
    // ------------------------------------------

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

    // ------------------------------------------
    // 404
    // ------------------------------------------

    if (
      error.message ===
        "Invalid student ID" ||
      error.message ===
        "Attendance session not found" ||
      error.message === "Student not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // ------------------------------------------
    // 403
    // ------------------------------------------

    if (
      error.message ===
        "Attendance token does not belong to this student" ||
      error.message ===
        "Student is not enrolled in this subject" ||
      error.message ===
        "Face verification failed" ||
      error.message ===
        "Student is outside the allowed attendance location"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    // ------------------------------------------
    // 400
    // ------------------------------------------

    if (
      error.message ===
        "Attendance session is not active" ||
      error.message ===
        "Attendance session has expired" ||
      error.message ===
        "Face descriptor is required" ||
      error.message ===
        "Valid latitude and longitude are required" ||
      error.message ===
        "Invalid latitude" ||
      error.message ===
        "Invalid longitude" ||
      error.message ===
        "Face is not registered for this student" ||
      error.message ===
        "Session location is not configured"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // ------------------------------------------
    // Duplicate attendance
    // ------------------------------------------

    if (
      error.message ===
      "Attendance already marked for this session"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    // ------------------------------------------
    // Server error
    // ------------------------------------------

    res.status(500).json({
      success: false,
      message:
        "Failed to mark attendance",
    });
  }
};

const getStudentAttendanceHistory = async (
  req,
  res
) => {
  try {
    const records =
      await getStudentAttendanceHistoryService(
        req.user.id
      );

    res.status(200).json({
      success: true,
      count: records.length,

      attendance: records.map((record) => ({
        id: record._id,

        session: record.sessionId
          ? {
              id: record.sessionId._id,
              sessionCode:
                record.sessionId.sessionCode,
              startedAt:
                record.sessionId.startedAt,
            }
          : null,

        subject: record.subjectId
          ? {
              id: record.subjectId._id,
              subjectName:
                record.subjectId.subjectName,
              subjectCode:
                record.subjectId.subjectCode,
            }
          : null,

        class: record.classId
          ? {
              id: record.classId._id,
              className:
                record.classId.className,
              year: record.classId.year,
              section:
                record.classId.section,
              academicYear:
                record.classId.academicYear,
            }
          : null,

        status: record.status,

        markedAt: record.markedAt,

        verification: record.verification,

        geoVerification:
          record.geoVerification,

        faceVerification:
          record.faceVerification,
      })),
    });
  } catch (error) {
    console.error(
      "Get student attendance history error:",
      error.message
    );

    if (error.message === "Invalid student ID") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch attendance history",
    });
  }
};

const getSessionAttendance = async (
  req,
  res
) => {
  try {
    const { sessionId } = req.params;

    const result =
      await getSessionAttendanceService(
        sessionId,
        req.user.id
      );

    res.status(200).json({
      success: true,

      session: {
        id: result.session._id,

        sessionCode:
          result.session.sessionCode,

        status:
          result.session.status,

        startedAt:
          result.session.startedAt,

        expiresAt:
          result.session.expiresAt,

        closedAt:
          result.session.closedAt,

        subject:
          result.session.subjectId
            ? {
                id:
                  result.session.subjectId._id,
                subjectName:
                  result.session.subjectId
                    .subjectName,
                subjectCode:
                  result.session.subjectId
                    .subjectCode,
              }
            : null,

        class:
          result.session.classId
            ? {
                id:
                  result.session.classId._id,
                className:
                  result.session.classId
                    .className,
                year:
                  result.session.classId.year,
                section:
                  result.session.classId.section,
                academicYear:
                  result.session.classId
                    .academicYear,
              }
            : null,
      },

      count: result.records.length,

      attendance: result.records.map(
        (record) => ({
          id: record._id,

          student:
            record.studentId
              ? {
                  id:
                    record.studentId._id,
                  name:
                    record.studentId.name,
                  rollNo:
                    record.studentId.rollNo,
                  email:
                    record.studentId.email,
                }
              : null,

          status: record.status,

          markedAt:
            record.markedAt,

          verification:
            record.verification,

          geoVerification:
            record.geoVerification,

          faceVerification:
            record.faceVerification,
        })
      ),
    });
  } catch (error) {
    console.error(
      "Get session attendance error:",
      error.message
    );

    // ==========================================
    // 400
    // ==========================================

    if (
      error.message ===
        "Invalid session ID" ||
      error.message ===
        "Invalid teacher ID"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // ==========================================
    // 403
    // ==========================================

    if (
      error.message ===
      "You are not authorized to view this session"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    // ==========================================
    // 404
    // ==========================================

    if (
      error.message ===
      "Attendance session not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // ==========================================
    // 500
    // ==========================================

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch session attendance",
    });
  }
};

const getCompleteSessionAttendance = async (
  req,
  res
) => {
  try {
    const { sessionId } = req.params;

    const result =
      await getCompleteSessionAttendanceService(
        sessionId,
        req.user.id
      );

    res.status(200).json({
      success: true,

      session: {
        id: result.session._id,

        sessionCode:
          result.session.sessionCode,

        status:
          result.session.status,

        startedAt:
          result.session.startedAt,

        expiresAt:
          result.session.expiresAt,

        closedAt:
          result.session.closedAt,

        subject:
          result.session.subjectId
            ? {
                id:
                  result.session.subjectId._id,
                subjectName:
                  result.session.subjectId
                    .subjectName,
                subjectCode:
                  result.session.subjectId
                    .subjectCode,
              }
            : null,

        class:
          result.session.classId
            ? {
                id:
                  result.session.classId._id,
                className:
                  result.session.classId
                    .className,
                year:
                  result.session.classId.year,
                section:
                  result.session.classId.section,
                academicYear:
                  result.session.classId
                    .academicYear,
              }
            : null,
      },

      summary: result.summary,

      attendance: result.attendance,
    });
  } catch (error) {
    console.error(
      "Get complete session attendance error:",
      error.message
    );

    if (
      error.message ===
        "Invalid session ID" ||
      error.message ===
        "Invalid teacher ID"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
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
      "You are not authorized to view this session"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch complete session attendance",
    });
  }
};

const getSubjectAttendanceStats = async (
  req,
  res
) => {
  try {
    const { subjectId } = req.params;

    const result =
      await getSubjectAttendanceStatsService(
        subjectId,
        req.user.id
      );

    res.status(200).json({
      success: true,

      subject: {
        id: result.subject._id,
        subjectName:
          result.subject.subjectName,
        subjectCode:
          result.subject.subjectCode,
        className:
          result.subject.className,
      },

      summary: result.summary,

      students: result.students,
    });
  } catch (error) {
    console.error(
      "Get subject attendance stats error:",
      error.message
    );

    // ==========================================
    // 400
    // ==========================================

    if (
      error.message ===
        "Invalid subject ID" ||
      error.message ===
        "Invalid teacher ID"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // ==========================================
    // 403
    // ==========================================

    if (
      error.message ===
      "You are not authorized to view this subject"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    // ==========================================
    // 404
    // ==========================================

    if (
      error.message ===
      "Subject not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // ==========================================
    // 500
    // ==========================================

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch subject attendance statistics",
    });
  }
};

const getStudentAttendanceStats = async (
  req,
  res
) => {
  try {
    const result =
      await getStudentAttendanceStatsService(
        req.user.id
      );

    res.status(200).json({
      success: true,

      summary: result.summary,

      subjects: result.subjects,

      lowAttendanceSubjects:
        result.lowAttendanceSubjects,
    });
  } catch (error) {
    console.error(
      "Get student attendance stats error:",
      error.message
    );

    if (
      error.message ===
      "Invalid student ID"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch attendance statistics",
    });
  }
};

module.exports = {
  startAttendanceSession,
  getActiveSession,
  closeAttendanceSession,
  getMyActiveSessions,
  generateStudentAttendanceToken,
  verifyStudentAttendanceToken,
  verifyStudentLocation,
  verifyStudentFace,
  markAttendance,
  getStudentAttendanceHistory,
  getSessionAttendance,
  getCompleteSessionAttendance,
  getSubjectAttendanceStats,
  getStudentAttendanceStats
};
