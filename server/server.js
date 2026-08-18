require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const registerSocketHandlers = require("./socket/socketHandler");

const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Class = require("./models/Class");
const Subject = require("./models/Subject");
const Enrollment = require("./models/Enrollment");
const AttendanceSession = require("./models/AttendanceSession");
const AttendanceRecord = require("./models/AttendanceRecord");

//routes import
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

const httpServer = http.createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.set("io", io);
registerSocketHandlers(io);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Smart Attendance API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
