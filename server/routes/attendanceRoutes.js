const express = require("express");

const {
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
   getStudentAttendanceStats,
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/sessions",
  authMiddleware,
  roleMiddleware("teacher"),
  startAttendanceSession
);

router.get(
  "/sessions/active/:subjectId",
  authMiddleware,
  roleMiddleware("teacher"),
  getActiveSession
);

router.post(
  "/sessions/:sessionId/close",
  authMiddleware,
  roleMiddleware("teacher"),
  closeAttendanceSession
);

router.get(
  "/sessions/my-active",
  authMiddleware,
  roleMiddleware("student"),
  getMyActiveSessions
);

router.post(
  "/sessions/:sessionId/token",
  authMiddleware,
  roleMiddleware("student"),
  generateStudentAttendanceToken
);

router.post(
  "/verify-token",
  authMiddleware,
  roleMiddleware("student"),
  verifyStudentAttendanceToken
);

router.post(
  "/verify-location",
  authMiddleware,
  roleMiddleware("student"),
  verifyStudentLocation
);

router.post(
  "/verify-face",
  authMiddleware,
  roleMiddleware("student"),
  verifyStudentFace
);

router.post(
  "/mark",
  authMiddleware,
  roleMiddleware("student"),
  markAttendance
);

router.get(
  "/student/history",
  authMiddleware,
  roleMiddleware("student"),
  getStudentAttendanceHistory
);

router.get(
  "/session/:sessionId",
  authMiddleware,
  roleMiddleware("teacher"),
  getSessionAttendance
);

router.get(
  "/session/:sessionId/complete",
  authMiddleware,
  roleMiddleware("teacher"),
  getCompleteSessionAttendance
);

router.get(
  "/subject/:subjectId/stats",
  authMiddleware,
  roleMiddleware("teacher"),
  getSubjectAttendanceStats
);

router.get(
  "/student/stats",
  authMiddleware,
  roleMiddleware("student"),
  getStudentAttendanceStats
);

module.exports = router;