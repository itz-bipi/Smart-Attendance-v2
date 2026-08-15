const mongoose = require("mongoose");

const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Class = require("../models/Class");

const joinSubject = async (joinCode, studentId) => {
  // Validate student ID
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  // Find student
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  if (!student.isActive) {
    throw new Error("Student account is inactive");
  }

  // Find subject using join code
  const subject = await Subject.findOne({
    joinCode: joinCode.toUpperCase(),
  });

  if (!subject) {
    throw new Error("Invalid join code");
  }

  if (!subject.isActive) {
    throw new Error("Subject is inactive");
  }

  // Check class
  const classData = await Class.findById(subject.classId);

  if (!classData) {
    throw new Error("Class not found");
  }

  if (!classData.isActive) {
    throw new Error("Class is inactive");
  }

  // Student must belong to the same class
  if (
    student.classId &&
    student.classId.toString() !== subject.classId.toString()
  ) {
    throw new Error(
      "Student does not belong to this class"
    );
  }

  // Check duplicate enrollment
  const existingEnrollment = await Enrollment.findOne({
    studentId,
    subjectId: subject._id,
  });

  if (existingEnrollment) {
    if (existingEnrollment.status === "active") {
      throw new Error("Student is already enrolled");
    }

    // Reactivate previous enrollment
    existingEnrollment.status = "active";
    existingEnrollment.enrolledAt = new Date();

    await existingEnrollment.save();

    return existingEnrollment;
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    studentId,
    subjectId: subject._id,
    status: "active",
  });

  return enrollment;
};

const getMyEnrollments = async (studentId) => {
  const enrollments = await Enrollment.find({
    studentId,
    status: "active",
  })
    .populate({
      path: "subjectId",
      select: "subjectName subjectCode classId teacherId isActive",
      populate: {
        path: "classId",
        select: "className year section academicYear isActive",
      },
    })
    .sort({
      enrolledAt: -1,
    });

  return enrollments;
};

const getSubjectEnrollments = async (
  subjectId,
  teacherId
) => {
  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new Error("Invalid subject ID");
  }

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Only the teacher who owns the subject can view enrollments
  if (subject.teacherId.toString() !== teacherId.toString()) {
    throw new Error(
      "You are not authorized to view these enrollments"
    );
  }

  const enrollments = await Enrollment.find({
    subjectId,
    status: "active",
  })
    .populate({
      path: "studentId",
      select: "name email rollNo classId isActive faceRegistered",
    })
    .sort({
      enrolledAt: 1,
    });

  return enrollments;
};

const updateEnrollmentStatus = async (
  enrollmentId,
  status,
  teacherId
) => {
  if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
    throw new Error("Invalid enrollment ID");
  }

  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid enrollment status");
  }

  const enrollment = await Enrollment.findById(
    enrollmentId
  );

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const subject = await Subject.findById(
    enrollment.subjectId
  );

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Only the teacher who owns the subject can modify enrollment
  if (
    subject.teacherId.toString() !==
    teacherId.toString()
  ) {
    throw new Error(
      "You are not authorized to update this enrollment"
    );
  }

  enrollment.status = status;

  await enrollment.save();

  return enrollment;
};

module.exports = {
  joinSubject,
  getMyEnrollments,
  getSubjectEnrollments,
  updateEnrollmentStatus,
};