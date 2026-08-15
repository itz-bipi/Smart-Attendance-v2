const express = require("express");

const {
  joinSubject,
  getMyEnrollments,
  getSubjectEnrollments,
  updateEnrollmentStatus,
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/join",
  authMiddleware,
  roleMiddleware("student"),
  joinSubject
);


router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  getMyEnrollments
);

router.get(
  "/subject/:subjectId",
  authMiddleware,
  roleMiddleware("teacher"),
  getSubjectEnrollments
);

router.patch(
  "/:enrollmentId/status",
  authMiddleware,
  roleMiddleware("teacher"),
  updateEnrollmentStatus
);


module.exports = router;