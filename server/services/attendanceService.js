const mongoose = require("mongoose");



const Enrollment = require("../models/Enrollment");
const AttendanceSession = require("../models/AttendanceSession");
const Subject = require("../models/Subject");
const Class = require("../models/Class");


const generateSessionCode = require("../utils/generateSessionCode");
const generateAttendanceToken = require(
    "../utils/generateAttendanceToken"
);
const verifyAttendanceToken = require(
  "../utils/verifyAttendanceToken"
);

const startAttendanceSession = async (
  subjectId,
  teacherId,
  latitude,
  longitude
) => {
  // Validate subject ID
  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new Error("Invalid subject ID");
  }

  // Validate location
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new Error("Valid latitude and longitude are required");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude");
  }

  // Find subject
  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Only subject owner can start attendance
  if (
    subject.teacherId.toString() !== teacherId.toString()
  ) {
    throw new Error(
      "You are not authorized to start attendance for this subject"
    );
  }

  // Subject must be active
  if (!subject.isActive) {
    throw new Error("Subject is inactive");
  }

  // Find class
  const classData = await Class.findById(subject.classId);

  if (!classData) {
    throw new Error("Class not found");
  }

  if (!classData.isActive) {
    throw new Error("Class is inactive");
  }

  // Prevent multiple active sessions for same subject
  const existingSession =
    await AttendanceSession.findOne({
      subjectId,
      status: "ACTIVE",
    });

  if (existingSession) {
    throw new Error(
      "An attendance session is already active for this subject"
    );
  }

  const startedAt = new Date();

  // For now: session valid for 5 minutes
  const expiresAt = new Date(
    startedAt.getTime() + 5 * 60 * 1000
  );

  const sessionCode = generateSessionCode();

  const session = await AttendanceSession.create({
    teacherId,
    subjectId,
    classId: subject.classId,
    sessionCode,
    status: "ACTIVE",
    startedAt,
    expiresAt,
    teacherLocation: {
      latitude,
      longitude,
    },
    allowedRadius: 100,
  });

  return session;
};

const getActiveSession = async (subjectId, teacherId) => {
  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new Error("Invalid subject ID");
  }

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Only the subject owner can view its active session
  if (
    subject.teacherId.toString() !== teacherId.toString()
  ) {
    throw new Error(
      "You are not authorized to view this session"
    );
  }

  const session = await AttendanceSession.findOne({
    subjectId,
    teacherId,
    status: "ACTIVE",
  });

  if (!session) {
    throw new Error("No active attendance session found");
  }

  // Automatically detect expiry
  if (new Date() >= session.expiresAt) {
    session.status = "EXPIRED";
    await session.save();

    throw new Error("Attendance session has expired");
  }

  return session;
};

const closeAttendanceSession = async (
  sessionId,
  teacherId
) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  const session = await AttendanceSession.findById(
    sessionId
  );

  if (!session) {
    throw new Error("Attendance session not found");
  }

  // Only the teacher who started the session can close it
  if (
    session.teacherId.toString() !== teacherId.toString()
  ) {
    throw new Error(
      "You are not authorized to close this session"
    );
  }

  if (session.status !== "ACTIVE") {
    throw new Error(
      `Session is already ${session.status.toLowerCase()}`
    );
  }

  session.status = "CLOSED";
  session.closedAt = new Date();

  await session.save();

  return session;
};

const getMyActiveSessions = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  // Find student's active enrollments
  const enrollments = await Enrollment.find({
    studentId,
    status: "active",
  }).select("subjectId");

  const subjectIds = enrollments.map(
    (enrollment) => enrollment.subjectId
  );

  if (subjectIds.length === 0) {
    return [];
  }

  // Find active attendance sessions for those subjects
  const sessions = await AttendanceSession.find({
    subjectId: {
      $in: subjectIds,
    },
    status: "ACTIVE",
    expiresAt: {
      $gt: new Date(),
    },
  })
    .populate({
      path: "subjectId",
      select: "subjectName subjectCode",
    })
    .populate({
      path: "classId",
      select: "className year section academicYear",
    })
    .sort({
      startedAt: -1,
    });

  return sessions;
};


const generateStudentAttendanceToken = async (
  sessionId,
  studentId
) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  const session = await AttendanceSession.findById(
    sessionId
  );

  if (!session) {
    throw new Error("Attendance session not found");
  }

  if (session.status !== "ACTIVE") {
    throw new Error("Attendance session is not active");
  }

  if (new Date() >= session.expiresAt) {
    session.status = "EXPIRED";
    await session.save();

    throw new Error("Attendance session has expired");
  }

  // Verify that this student is enrolled
  const enrollment = await Enrollment.findOne({
    studentId,
    subjectId: session.subjectId,
    status: "active",
  });

  if (!enrollment) {
    throw new Error(
      "Student is not enrolled in this subject"
    );
  }

  const token = generateAttendanceToken({
    sessionId: session._id.toString(),
    studentId: studentId.toString(),
    subjectId: session.subjectId.toString(),
  });

  return {
    token,
    expiresAt: session.expiresAt,
  };
};

const verifyStudentAttendanceToken = async (
  token,
  studentId
) => {
  if (!token) {
    throw new Error("Attendance token is required");
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  const decoded = verifyAttendanceToken(token);

  // Token must belong to the logged-in student
  if (
    decoded.studentId.toString() !==
    studentId.toString()
  ) {
    throw new Error(
      "Attendance token does not belong to this student"
    );
  }

  const session =
    await AttendanceSession.findById(
      decoded.sessionId
    );

  if (!session) {
    throw new Error(
      "Attendance session not found"
    );
  }

  if (session.status !== "ACTIVE") {
    throw new Error(
      "Attendance session is not active"
    );
  }

  if (new Date() >= session.expiresAt) {
    session.status = "EXPIRED";
    await session.save();

    throw new Error(
      "Attendance session has expired"
    );
  }

  const enrollment =
    await Enrollment.findOne({
      studentId,
      subjectId: session.subjectId,
      status: "active",
    });

  if (!enrollment) {
    throw new Error(
      "Student is not enrolled in this subject"
    );
  }

  return {
    valid: true,
    session,
    studentId,
  };
};

module.exports = {
  startAttendanceSession,
  getActiveSession,
  closeAttendanceSession,
  getMyActiveSessions,
  generateStudentAttendanceToken,
  verifyStudentAttendanceToken,
};