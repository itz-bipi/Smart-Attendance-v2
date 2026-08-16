const express = require("express");

const {
  startAttendanceSession,
  getActiveSession,
  closeAttendanceSession,
  getMyActiveSessions,
  generateStudentAttendanceToken,
  verifyStudentAttendanceToken
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

module.exports = router;