const express = require("express");

const {
  createSubject,
  getSubjects,
} = require("../controllers/subjectController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("teacher"),
  createSubject
);

router.get(
  "/",
  authMiddleware,
  getSubjects
);

module.exports = router;