const express = require("express");

const {
  // existing controllers...

  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("student"),
  getStudentProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("student"),
  updateStudentProfile
);

module.exports = router;