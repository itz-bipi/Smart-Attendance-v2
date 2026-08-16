const socketAuth = require("./socketAuth");

const mongoose = require("mongoose");

const AttendanceSession = require("../models/AttendanceSession");
const Enrollment = require("../models/Enrollment");
const { addSocket, removeSocket, getUserSockets } = require("./socketRegistry");

const registerSocketHandlers = (io) => {
  // ==========================================
  // SOCKET AUTHENTICATION
  // ==========================================

  io.use(socketAuth);

  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  io.on("connection", (socket) => {
    console.log("Authenticated socket connected:", socket.id);

    console.log("User:", socket.user);
    addSocket(socket.user.id, socket.id);

    // ==========================================
    // STUDENT JOINS ATTENDANCE SESSION
    // ==========================================

    socket.on("join-attendance-session", async ({ sessionId }) => {
      try {
        // --------------------------------------
        // 1. Check user role
        // --------------------------------------

        if (socket.user.role !== "student") {
          return socket.emit("attendance-error", {
            message: "Only students can join attendance sessions",
          });
        }

        // --------------------------------------
        // 2. Validate session ID
        // --------------------------------------

        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
          return socket.emit("attendance-error", {
            message: "Invalid session ID",
          });
        }

        // --------------------------------------
        // 3. Find attendance session
        // --------------------------------------

        const session = await AttendanceSession.findById(sessionId);

        if (!session) {
          return socket.emit("attendance-error", {
            message: "Attendance session not found",
          });
        }

        // --------------------------------------
        // 4. Check session status
        // --------------------------------------

        if (session.status !== "ACTIVE") {
          return socket.emit("attendance-error", {
            message: "Attendance session is not active",
          });
        }

        // --------------------------------------
        // 5. Check session expiry
        // --------------------------------------

        if (new Date() >= session.expiresAt) {
          session.status = "EXPIRED";

          await session.save();

          return socket.emit("attendance-error", {
            message: "Attendance session has expired",
          });
        }

        // --------------------------------------
        // 6. Check student enrollment
        // --------------------------------------

        const enrollment = await Enrollment.findOne({
          studentId: socket.user.id,
          subjectId: session.subjectId,
          status: "active",
        });

        if (!enrollment) {
          return socket.emit("attendance-error", {
            message: "You are not enrolled in this subject",
          });
        }

        // --------------------------------------
        // 7. Create private room
        // --------------------------------------

        const roomName = `attendance:${sessionId}`;

        // --------------------------------------
        // 8. Join room
        // --------------------------------------

        socket.join(roomName);

        console.log(
          `Student ${socket.user.id} joined attendance room ${roomName}`,
        );

        // --------------------------------------
        // 9. Confirm to student
        // --------------------------------------

        socket.emit("attendance-room-joined", {
          sessionId,
          room: roomName,
          message: "Successfully joined attendance session",
        });
      } catch (error) {
        console.error("Join attendance session error:", error.message);

        socket.emit("attendance-error", {
          message: "Failed to join attendance session",
        });
      }
    });

    // socket.on("test-send-to-student", ({ studentId }) => {
    //   try {
    //     if (!studentId) {
    //       return socket.emit("attendance-error", {
    //         message: "Student ID is required",
    //       });
    //     }

    //     const studentSockets = getUserSockets(studentId);

    //     if (studentSockets.size === 0) {
    //       return socket.emit("attendance-error", {
    //         message: "Student is not connected",
    //       });
    //     }

    //     studentSockets.forEach((socketId) => {
    //       io.to(socketId).emit("test-student-message", {
    //         message: "Hello! This message was sent directly to you.",
    //         sentAt: new Date(),
    //       });
    //     });

    //     console.log(`Test event sent to student ${studentId}`);
    //   } catch (error) {
    //     console.error("Test socket event error:", error.message);
    //   }
    // });

    // ==========================================
    // SOCKET DISCONNECT
    // ==========================================

    socket.on("disconnect", (reason) => {
      removeSocket(socket.user.id, socket.id);

      console.log(`Socket disconnected: ${socket.id}`);

      console.log("Disconnect reason:", reason);
    });
  });
};

module.exports = registerSocketHandlers;
