require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser")

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



const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


//routes
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/enrollments", enrollmentRoutes);






app.get("/", (req, res) => {
    res.json({
        message: "Smart Attendance API is running"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();