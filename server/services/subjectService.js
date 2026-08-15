const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Subject = require("../models/Subject");
const Class = require("../models/Class");
const generateJoinCode = require("../utils/generateJoinCode");


const createSubject = async (subjectData, teacherId) => {
  const {
    subjectName,
    subjectCode,
    classId,
  } = subjectData;

  // Validate class ID
  if (!mongoose.Types.ObjectId.isValid(classId)) {
    throw new Error("Invalid class ID");
  }

  // Check whether class exists
  const existingClass = await Class.findById(classId);

  if (!existingClass) {
    throw new Error("Class not found");
  }

  // Subject can only be created for an active class
  if (!existingClass.isActive) {
    throw new Error("Cannot create subject for an inactive class");
  }

  // Check duplicate subject in the same class
  const existingSubject = await Subject.findOne({
    classId,
    subjectCode: subjectCode.toUpperCase(),
  });

  if (existingSubject) {
    throw new Error(
      "This subject code already exists for this class"
    );
  }

  const joinCode = generateJoinCode();

const subject = await Subject.create({
  subjectName,
  subjectCode,
  joinCode,
  classId,
  teacherId,
});

  return subject;
};

const getSubjectsForUser = async (userId, role) => {
  if (role === "teacher") {
    const subjects = await Subject.find({
      teacherId: userId,
      isActive: true,
    })
      .populate("classId", "className year section academicYear")
      .sort({ subjectName: 1 });

    return subjects;
  }

  if (role === "student") {
    const enrollments = await Enrollment.find({
      studentId: userId,
      status: "active",
    }).select("subjectId");

    const subjectIds = enrollments.map(
      (enrollment) => enrollment.subjectId
    );

    const subjects = await Subject.find({
      _id: { $in: subjectIds },
      isActive: true,
    })
      .populate("classId", "className year section academicYear")
      .sort({ subjectName: 1 });

    return subjects;
  }

  throw new Error("Invalid user role");
};

module.exports = {
  createSubject,
  getSubjectsForUser,
};