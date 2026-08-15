const mongoose = require("mongoose");
const Class = require("../models/Class");

const createClass = async (classData, teacherId) => {
  const {
    className,
    year,
    section,
    academicYear,
  } = classData;

  const newClass = await Class.create({
    className,
    year,
    section,
    academicYear,
    createdBy: teacherId,
  });

  return newClass;
};

const getClasses = async () => {
  const classes = await Class.find({
    isActive: true,
  }).sort({
    year: 1,
    section: 1,
  });

  return classes;
};

const getClassById = async (classId) => {
  if (!mongoose.Types.ObjectId.isValid(classId)) {
    throw new Error("Invalid class ID");
  }

  const classData = await Class.findById(classId);

  if (!classData) {
    throw new Error("Class not found");
  }

  return classData;
};

const updateClass = async (classId, classData, teacherId) => {
  if (!mongoose.Types.ObjectId.isValid(classId)) {
    throw new Error("Invalid class ID");
  }

  const existingClass = await Class.findById(classId);

  if (!existingClass) {
    throw new Error("Class not found");
  }

  // Only the teacher who created the class can update it
  if (existingClass.createdBy.toString() !== teacherId.toString()) {
    throw new Error(
      "You are not authorized to update this class"
    );
  }

  const {
    className,
    year,
    section,
    academicYear,
  } = classData;

  existingClass.className = className ?? existingClass.className;
  existingClass.year = year ?? existingClass.year;
  existingClass.section = section ?? existingClass.section;
  existingClass.academicYear =
    academicYear ?? existingClass.academicYear;

  await existingClass.save();

  return existingClass;
};


const deleteClass = async (classId, teacherId) => {
  if (!mongoose.Types.ObjectId.isValid(classId)) {
    throw new Error("Invalid class ID");
  }

  const existingClass = await Class.findById(classId);

  if (!existingClass) {
    throw new Error("Class not found");
  }

  if (existingClass.createdBy.toString() !== teacherId.toString()) {
    throw new Error(
      "You are not authorized to delete this class"
    );
  }

  if (!existingClass.isActive) {
    throw new Error("Class is already inactive");
  }

  existingClass.isActive = false;

  await existingClass.save();

  return existingClass;
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};