const express = require("express");

const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("teacher"),
  createClass
);

router.get(
  "/",
  authMiddleware,
  getClasses
);

router.get(
  "/:classId",
  authMiddleware,
  getClassById
);

router.put(
  "/:classId",
  authMiddleware,
  roleMiddleware("teacher"),
  updateClass
);

router.delete(
  "/:classId",
  authMiddleware,
  roleMiddleware("teacher"),
  deleteClass
);

module.exports = router;