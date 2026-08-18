const mongoose = require("mongoose");

const Enrollment = require("../models/Enrollment");
const AttendanceSession = require("../models/AttendanceSession");
const Subject = require("../models/Subject");
const Class = require("../models/Class");
const Student = require("../models/Student");
const AttendanceRecord = require(
  "../models/AttendanceRecord"
);


const verifyFace = require("../utils/verifyFace");
const generateSessionCode = require("../utils/generateSessionCode");
const generateAttendanceToken = require("../utils/generateAttendanceToken");
const verifyAttendanceToken = require("../utils/verifyAttendanceToken");
const calculateDistance = require("../utils/calculateDistance");

const startAttendanceSession = async (
  subjectId,
  teacherId,
  latitude,
  longitude,
) => {
  // Validate subject ID
  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new Error("Invalid subject ID");
  }

  // Validate location
  if (typeof latitude !== "number" || typeof longitude !== "number") {
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
  if (subject.teacherId.toString() !== teacherId.toString()) {
    throw new Error(
      "You are not authorized to start attendance for this subject",
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
  const existingSession = await AttendanceSession.findOne({
    subjectId,
    status: "ACTIVE",
  });

  if (existingSession) {
    throw new Error("An attendance session is already active for this subject");
  }

  const startedAt = new Date();

  // For now: session valid for 5 minutes
  const expiresAt = new Date(startedAt.getTime() + 5 * 60 * 1000);

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
  if (subject.teacherId.toString() !== teacherId.toString()) {
    throw new Error("You are not authorized to view this session");
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

const closeAttendanceSession = async (sessionId, teacherId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  const session = await AttendanceSession.findById(sessionId);

  if (!session) {
    throw new Error("Attendance session not found");
  }

  // Only the teacher who started the session can close it
  if (session.teacherId.toString() !== teacherId.toString()) {
    throw new Error("You are not authorized to close this session");
  }

  if (session.status !== "ACTIVE") {
    throw new Error(`Session is already ${session.status.toLowerCase()}`);
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

  const subjectIds = enrollments.map((enrollment) => enrollment.subjectId);

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

const generateStudentAttendanceToken = async (sessionId, studentId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  const session = await AttendanceSession.findById(sessionId);

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
    throw new Error("Student is not enrolled in this subject");
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

const verifyStudentAttendanceToken = async (token, studentId) => {
  if (!token) {
    throw new Error("Attendance token is required");
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  const decoded = verifyAttendanceToken(token);

  // Token must belong to the logged-in student
  if (decoded.studentId.toString() !== studentId.toString()) {
    throw new Error("Attendance token does not belong to this student");
  }

  const session = await AttendanceSession.findById(decoded.sessionId);

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

  const enrollment = await Enrollment.findOne({
    studentId,
    subjectId: session.subjectId,
    status: "active",
  });

  if (!enrollment) {
    throw new Error("Student is not enrolled in this subject");
  }

  return {
    valid: true,
    session,
    studentId,
  };
};

const verifyStudentLocation = async (
  token,
  studentLatitude,
  studentLongitude,
  studentId,
) => {
  // First verify the attendance token
  const result = await verifyStudentAttendanceToken(token, studentId);

  const session = result.session;

  // Validate coordinates
  if (
    typeof studentLatitude !== "number" ||
    typeof studentLongitude !== "number"
  ) {
    throw new Error("Valid latitude and longitude are required");
  }

  if (studentLatitude < -90 || studentLatitude > 90) {
    throw new Error("Invalid latitude");
  }

  if (studentLongitude < -180 || studentLongitude > 180) {
    throw new Error("Invalid longitude");
  }

  const teacherLatitude = session.teacherLocation.latitude;

  const teacherLongitude = session.teacherLocation.longitude;

  // Calculate distance in meters
  const distance = calculateDistance(
    teacherLatitude,
    teacherLongitude,
    studentLatitude,
    studentLongitude,
  );

  const allowedRadius = session.allowedRadius;

  const locationVerified = distance <= allowedRadius;

  if (!locationVerified) {
    throw new Error(`Student is outside the allowed attendance location`);
  }

  return {
    verified: true,
    distance,
    allowedRadius,
    session,
  };
};

const verifyStudentFace = async (studentId, submittedDescriptor) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  if (!Array.isArray(submittedDescriptor)) {
    throw new Error("Face descriptor is required");
  }

  const student = await Student.findById(studentId).select("faceDescriptor");

  if (!student) {
    throw new Error("Student not found");
  }

  if (!student.faceDescriptor || student.faceDescriptor.length === 0) {
    throw new Error("Face is not registered for this student");
  }

  const result = verifyFace(student.faceDescriptor, submittedDescriptor);

  if (!result.verified) {
    throw new Error("Face verification failed");
  }

  return result;
};

const markAttendance = async ({
  token,
  latitude,
  longitude,
  faceDescriptor,
  studentId,
}) => {
  // ==========================================
  // 1. Validate student ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  // ==========================================
  // 2. Validate request data
  // ==========================================

  if (!token) {
    throw new Error("Attendance token is required");
  }

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new Error(
      "Valid latitude and longitude are required"
    );
  }

  if (
    latitude < -90 ||
    latitude > 90
  ) {
    throw new Error("Invalid latitude");
  }

  if (
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid longitude");
  }

  if (!Array.isArray(faceDescriptor)) {
    throw new Error(
      "Face descriptor is required"
    );
  }

  // ==========================================
  // 3. Verify attendance token
  // ==========================================

  const decoded = verifyAttendanceToken(token);

  // Token must belong to logged-in student
  if (
    decoded.studentId.toString() !==
    studentId.toString()
  ) {
    throw new Error(
      "Attendance token does not belong to this student"
    );
  }

  // ==========================================
  // 4. Find attendance session
  // ==========================================

  const session =
    await AttendanceSession.findById(
      decoded.sessionId
    );

  if (!session) {
    throw new Error(
      "Attendance session not found"
    );
  }

  // ==========================================
  // 5. Verify session status
  // ==========================================

  if (session.status !== "ACTIVE") {
    throw new Error(
      "Attendance session is not active"
    );
  }

  // ==========================================
  // 6. Verify session expiry
  // ==========================================

  if (new Date() >= session.expiresAt) {
    session.status = "EXPIRED";

    await session.save();

    throw new Error(
      "Attendance session has expired"
    );
  }

  // ==========================================
  // 7. Verify enrollment
  // ==========================================

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

  // ==========================================
  // 8. Get student face
  // ==========================================

  const student =
    await Student.findById(studentId)
      .select("faceDescriptor");

  if (!student) {
    throw new Error("Student not found");
  }

  if (
    !student.faceDescriptor ||
    student.faceDescriptor.length === 0
  ) {
    throw new Error(
      "Face is not registered for this student"
    );
  }

  // ==========================================
  // 9. Verify face
  // ==========================================

  const faceResult = verifyFace(
    student.faceDescriptor,
    faceDescriptor
  );

  if (!faceResult.verified) {
    throw new Error(
      "Face verification failed"
    );
  }

  // ==========================================
  // 10. Verify location
  // ==========================================

  if (
    !session.teacherLocation ||
    typeof session.teacherLocation.latitude !==
      "number" ||
    typeof session.teacherLocation.longitude !==
      "number"
  ) {
    throw new Error(
      "Session location is not configured"
    );
  }

  const distance = calculateDistance(
    session.teacherLocation.latitude,
    session.teacherLocation.longitude,
    latitude,
    longitude
  );

  const allowedRadius =
    session.allowedRadius;

  if (distance > allowedRadius) {
    throw new Error(
      "Student is outside the allowed attendance location"
    );
  }

  // ==========================================
  // 11. Check duplicate attendance
  // ==========================================

  const existingRecord =
    await AttendanceRecord.findOne({
      sessionId: session._id,
      studentId,
    });

  if (existingRecord) {
    throw new Error(
      "Attendance already marked for this session"
    );
  }

  // ==========================================
  // 12. Create attendance record
  // ==========================================

  const attendanceRecord =
    await AttendanceRecord.create({
      sessionId: session._id,
      studentId,
      subjectId: session.subjectId,
      classId: session.classId,

      status: "PRESENT",

      verification: {
        qr: true,
        geo: true,
        face: true,
      },

      geoVerification: {
        distanceFromSession: distance,
        latitude,
        longitude,
      },

      faceVerification: {
        matchScore: faceResult.distance,
      },
    });

  return {
    attendanceRecord,
    distance,
    faceDistance: faceResult.distance,
  };
};

const getStudentAttendanceHistory = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  const records = await AttendanceRecord.find({
    studentId,
  })
    .populate({
      path: "subjectId",
      select: "subjectName subjectCode",
    })
    .populate({
      path: "classId",
      select: "className year section academicYear",
    })
    .populate({
      path: "sessionId",
      select: "sessionCode startedAt",
    })
    .sort({
      markedAt: -1,
    });

  return records;
};

const getSessionAttendance = async (
  sessionId,
  teacherId
) => {
  // ==========================================
  // 1. Validate IDs
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new Error("Invalid teacher ID");
  }

  // ==========================================
  // 2. Find the attendance session
  // ==========================================

  const session =
    await AttendanceSession.findById(sessionId)
      .populate({
        path: "subjectId",
        select: "subjectName subjectCode",
      })
      .populate({
        path: "classId",
        select:
          "className year section academicYear",
      });

  if (!session) {
    throw new Error(
      "Attendance session not found"
    );
  }

  // ==========================================
  // 3. Verify session ownership
  // ==========================================

  if (
    session.teacherId.toString() !==
    teacherId.toString()
  ) {
    throw new Error(
      "You are not authorized to view this session"
    );
  }

  // ==========================================
  // 4. Find attendance records
  // ==========================================

  const records =
    await AttendanceRecord.find({
      sessionId,
    })
      .populate({
        path: "studentId",
        select:
          "name rollNo email",
      })
      .sort({
        markedAt: 1,
      });

  return {
    session,
    records,
  };
};

const getCompleteSessionAttendance = async (
  sessionId,
  teacherId
) => {
  // ==========================================
  // 1. Validate IDs
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session ID");
  }

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new Error("Invalid teacher ID");
  }

  // ==========================================
  // 2. Find session
  // ==========================================

  const session =
    await AttendanceSession.findById(sessionId)
      .populate({
        path: "subjectId",
        select: "subjectName subjectCode",
      })
      .populate({
        path: "classId",
        select:
          "className year section academicYear",
      });

  if (!session) {
    throw new Error(
      "Attendance session not found"
    );
  }

  // ==========================================
  // 3. Verify teacher owns session
  // ==========================================

  if (
    session.teacherId.toString() !==
    teacherId.toString()
  ) {
    throw new Error(
      "You are not authorized to view this session"
    );
  }

  // ==========================================
  // 4. Find all active enrollments
  // ==========================================

  const enrollments =
    await Enrollment.find({
      subjectId: session.subjectId._id,
      status: "active",
    }).populate({
      path: "studentId",
      select: "name rollNo email",
    });

  // ==========================================
  // 5. Find attendance records
  // ==========================================

  const records =
    await AttendanceRecord.find({
      sessionId: session._id,
    });

  // ==========================================
  // 6. Create quick lookup map
  // ==========================================

  const attendanceMap = new Map();

  records.forEach((record) => {
    attendanceMap.set(
      record.studentId.toString(),
      record
    );
  });

  // ==========================================
  // 7. Combine enrollment + attendance
  // ==========================================

  const attendance = enrollments.map(
    (enrollment) => {
      const student = enrollment.studentId;

      const record =
        attendanceMap.get(
          student._id.toString()
        );

      if (record) {
        return {
          student: {
            id: student._id,
            name: student.name,
            rollNo: student.rollNo,
            email: student.email,
          },

          status: "PRESENT",

          markedAt: record.markedAt,

          verification:
            record.verification,

          geoVerification:
            record.geoVerification,

          faceVerification:
            record.faceVerification,
        };
      }

      return {
        student: {
          id: student._id,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
        },

        status: "ABSENT",

        markedAt: null,

        verification: {
          qr: false,
          geo: false,
          face: false,
        },

        geoVerification: null,

        faceVerification: null,
      };
    }
  );

  // ==========================================
  // 8. Calculate summary
  // ==========================================

  const totalStudents =
    attendance.length;

  const presentStudents =
    attendance.filter(
      (student) =>
        student.status === "PRESENT"
    ).length;

  const absentStudents =
    totalStudents - presentStudents;

  const attendancePercentage =
    totalStudents > 0
      ? (
          (presentStudents /
            totalStudents) *
          100
        ).toFixed(2)
      : "0.00";

  return {
    session,
    attendance,

    summary: {
      totalStudents,
      presentStudents,
      absentStudents,
      attendancePercentage:
        Number(attendancePercentage),
    },
  };
};

const getSubjectAttendanceStats = async (
  subjectId,
  teacherId
) => {
  // ==========================================
  // 1. Validate IDs
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    throw new Error("Invalid subject ID");
  }

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new Error("Invalid teacher ID");
  }

  // ==========================================
  // 2. Find subject
  // ==========================================

  const subject = await Subject.findById(
    subjectId
  ).select(
    "subjectName subjectCode teacherId className"
  );

  if (!subject) {
    throw new Error("Subject not found");
  }

  // ==========================================
  // 3. Verify teacher owns subject
  // ==========================================

  if (
    subject.teacherId.toString() !==
    teacherId.toString()
  ) {
    throw new Error(
      "You are not authorized to view this subject"
    );
  }

  // ==========================================
  // 4. Find all active enrollments
  // ==========================================

  const enrollments =
    await Enrollment.find({
      subjectId,
      status: "active",
    }).populate({
      path: "studentId",
      select: "name rollNo email",
    });

  // ==========================================
  // 5. Find all sessions for this subject
  // ==========================================

  const sessions =
    await AttendanceSession.find({
      subjectId,
      teacherId,
    }).select("_id status startedAt");

  const totalSessions = sessions.length;

  const sessionIds = sessions.map(
    (session) => session._id
  );

  // ==========================================
  // 6. Find all attendance records
  // ==========================================

  const records =
    await AttendanceRecord.find({
      subjectId,
      sessionId: {
        $in: sessionIds,
      },
      status: "PRESENT",
    }).select(
      "studentId sessionId markedAt"
    );

  // ==========================================
  // 7. Create attendance lookup
  // ==========================================

  const attendanceMap = new Map();

  records.forEach((record) => {
    const studentId =
      record.studentId.toString();

    if (!attendanceMap.has(studentId)) {
      attendanceMap.set(studentId, []);
    }

    attendanceMap
      .get(studentId)
      .push(record);
  });

  // ==========================================
  // 8. Calculate statistics per student
  // ==========================================

  const students = enrollments.map(
    (enrollment) => {
      const student =
        enrollment.studentId;

      const studentRecords =
        attendanceMap.get(
          student._id.toString()
        ) || [];

      const present =
        studentRecords.length;

      const absent =
        Math.max(
          totalSessions - present,
          0
        );

      const percentage =
        totalSessions > 0
          ? Number(
              (
                (present /
                  totalSessions) *
                100
              ).toFixed(2)
            )
          : 0;

      return {
        student: {
          id: student._id,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
        },

        totalSessions,

        present,

        absent,

        attendancePercentage:
          percentage,
      };
    }
  );

  // ==========================================
  // 9. Overall subject statistics
  // ==========================================

  const totalStudents =
    students.length;

  const totalPossibleAttendances =
    totalStudents * totalSessions;

  const totalPresent =
    students.reduce(
      (sum, student) =>
        sum + student.present,
      0
    );

  const overallPercentage =
    totalPossibleAttendances > 0
      ? Number(
          (
            (totalPresent /
              totalPossibleAttendances) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    subject,
    summary: {
      totalStudents,
      totalSessions,
      totalPresent,
      overallAttendancePercentage:
        overallPercentage,
    },
    students,
  };
};

const getStudentAttendanceStats = async (studentId) => {
  // ==========================================
  // 1. Validate student ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student ID");
  }

  // ==========================================
  // 2. Find student's active enrollments
  // ==========================================

  const enrollments = await Enrollment.find({
    studentId,
    status: "active",
  }).populate({
    path: "subjectId",
    select: "subjectName subjectCode teacherId",
  });

  // ==========================================
  // 3. Find all attendance records
  // ==========================================

  const records = await AttendanceRecord.find({
    studentId,
    status: "PRESENT",
  }).populate({
    path: "subjectId",
    select: "subjectName subjectCode",
  });

  // ==========================================
  // 4. Find sessions for enrolled subjects
  // ==========================================

  const subjectIds = enrollments.map(
    (enrollment) => enrollment.subjectId._id
  );

  const sessions = await AttendanceSession.find({
    subjectId: {
      $in: subjectIds,
    },
  }).select("_id subjectId status");

  // ==========================================
  // 5. Create total session count by subject
  // ==========================================

  const totalSessionsMap = new Map();

  sessions.forEach((session) => {
    const subjectId =
      session.subjectId.toString();

    totalSessionsMap.set(
      subjectId,
      (totalSessionsMap.get(subjectId) || 0) + 1
    );
  });

  // ==========================================
  // 6. Create present count by subject
  // ==========================================

  const presentMap = new Map();

  records.forEach((record) => {
    const subjectId =
      record.subjectId._id.toString();

    presentMap.set(
      subjectId,
      (presentMap.get(subjectId) || 0) + 1
    );
  });

  // ==========================================
  // 7. Calculate subject-wise statistics
  // ==========================================

  const subjects = enrollments.map(
    (enrollment) => {
      const subject = enrollment.subjectId;

      const subjectId =
        subject._id.toString();

      const totalSessions =
        totalSessionsMap.get(subjectId) || 0;

      const present =
        presentMap.get(subjectId) || 0;

      const absent =
        Math.max(
          totalSessions - present,
          0
        );

      const percentage =
        totalSessions > 0
          ? Number(
              (
                (present /
                  totalSessions) *
                100
              ).toFixed(2)
            )
          : 0;

      return {
        subject: {
          id: subject._id,
          subjectName:
            subject.subjectName,
          subjectCode:
            subject.subjectCode,
        },

        totalSessions,

        present,

        absent,

        attendancePercentage:
          percentage,

        lowAttendance:
          percentage < 75,
      };
    }
  );

  // ==========================================
  // 8. Overall statistics
  // ==========================================

  const totalSessions =
    subjects.reduce(
      (sum, subject) =>
        sum + subject.totalSessions,
      0
    );

  const totalPresent =
    subjects.reduce(
      (sum, subject) =>
        sum + subject.present,
      0
    );

  const totalAbsent =
    subjects.reduce(
      (sum, subject) =>
        sum + subject.absent,
      0
    );

  const overallPercentage =
    totalSessions > 0
      ? Number(
          (
            (totalPresent /
              totalSessions) *
            100
          ).toFixed(2)
        )
      : 0;

  // ==========================================
  // 9. Low attendance subjects
  // ==========================================

  const lowAttendanceSubjects =
    subjects.filter(
      (subject) =>
        subject.lowAttendance
    );

  return {
    summary: {
      totalSubjects: subjects.length,
      totalSessions,
      totalPresent,
      totalAbsent,
      attendancePercentage:
        overallPercentage,
    },

    subjects,

    lowAttendanceSubjects,
  };
};

module.exports = {
  startAttendanceSession,
  getActiveSession,
  closeAttendanceSession,
  getMyActiveSessions,
  generateStudentAttendanceToken,
  verifyStudentAttendanceToken,
  verifyStudentLocation,
  verifyStudentFace,
  markAttendance,
  getStudentAttendanceHistory,
  getSessionAttendance,
  getCompleteSessionAttendance,
  getSubjectAttendanceStats,
  getStudentAttendanceStats,
};
