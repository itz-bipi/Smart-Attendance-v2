const {
  registerStudent: registerStudentService,
  loginStudent: loginStudentService,
  registerTeacher: registerTeacherService,
  loginTeacher: loginTeacherService,
} = require("../services/authService");

const { generateToken } = require("../utils/jwt");

const registerTeacher = async (req, res) => {
  try {
    const teacher = await registerTeacherService(req.body);

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        employeeId: teacher.employeeId,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const teacher = await loginTeacherService(
      email,
      password
    );

    const token = generateToken({
      id: teacher._id,
      role: "teacher",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        employeeId: teacher.employeeId,
        role: "teacher",
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const registerStudent = async (req, res) => {
  try {
    const student = await registerStudentService(req.body);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const student = await loginStudentService(
      email,
      password
    );

    const token = generateToken({
      id: student._id,
      role: "student",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        role: "student",
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: req.user,
  });
};


const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};




module.exports = {
  registerStudent,
  loginStudent,
  getCurrentUser,
  registerTeacher,
  loginTeacher,
  logout
};