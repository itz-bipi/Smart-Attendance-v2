const express = require("express");

const {
  registerStudent,
  loginStudent,
  getCurrentUser,
  registerTeacher,
  loginTeacher,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);

router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

router.get("/me", authMiddleware, getCurrentUser);


module.exports = router;