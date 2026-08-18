const express = require("express")

const router = express.Router();

const {getTeacherProfile,
  updateTeacherProfile,} = require("../controllers/teacherController");

  const authMiddleware = require("../middleware/authMiddleware");
  const roleMiddleware = require("../middleware/roleMiddleware")

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("teacher"),
  getTeacherProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("teacher"),
  updateTeacherProfile
);

module.exports = router;

