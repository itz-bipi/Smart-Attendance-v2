const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceSession",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    markedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["PRESENT"],
      default: "PRESENT",
    },

    verification: {
      qr: {
        type: Boolean,
        default: false,
      },

      geo: {
        type: Boolean,
        default: false,
      },

      face: {
        type: Boolean,
        default: false,
      },
    },

    geoVerification: {
      distanceFromSession: {
        type: Number,
        default: null,
      },

      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    faceVerification: {
      matchScore: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// One student can attend a particular session only once.
attendanceRecordSchema.index(
  { sessionId: 1, studentId: 1 },
  { unique: true }
);

const AttendanceRecord = mongoose.model(
  "AttendanceRecord",
  attendanceRecordSchema
);

module.exports = AttendanceRecord;