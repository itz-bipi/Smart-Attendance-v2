const mongoose = require("mongoose");

const attendanceSessionSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
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

    sessionCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    teacherLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    allowedRadius: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceSession = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema
);

module.exports = AttendanceSession;