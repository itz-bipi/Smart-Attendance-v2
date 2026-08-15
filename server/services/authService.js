const bcrypt = require("bcryptjs");

const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

const registerTeacher = async (teacherData) => {
  const {
    name,
    email,
    password,
    department,
    employeeId,
  } = teacherData;

  // Check email
  const existingEmail = await Teacher.findOne({ email });

  if (existingEmail) {
    throw new Error("Teacher with this email already exists");
  }

  // Check employee ID
  const existingEmployee = await Teacher.findOne({
    employeeId,
  });

  if (existingEmployee) {
    throw new Error(
      "Teacher with this employee ID already exists"
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create teacher
  const teacher = await Teacher.create({
    name,
    email,
    password: hashedPassword,
    department,
    employeeId,
  });

  return teacher;
};

const loginTeacher = async (email, password) => {
  const teacher = await Teacher.findOne({ email });

  if (!teacher) {
    throw new Error("Invalid email or password");
  }

  if (!teacher.isActive) {
    throw new Error("Teacher account is inactive");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    teacher.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  return teacher;
};

const registerStudent = async (studentData) => {
  const { name, email, password, rollNo } = studentData;

  // Check whether email already exists
  const existingEmail = await Student.findOne({ email });

  if (existingEmail) {
    throw new Error("Student with this email already exists");
  }

  // Check whether roll number already exists
  const existingRollNo = await Student.findOne({ rollNo });

  if (existingRollNo) {
    throw new Error("Student with this roll number already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create student
  const student = await Student.create({
    name,
    email,
    password: hashedPassword,
    rollNo,
  });

  return student;
};

const loginStudent = async (email, password) => {
  const student = await Student.findOne({ email });

  if (!student) {
    throw new Error("Invalid email or password");
  }

  if (!student.isActive) {
    throw new Error("Student account is inactive");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    student.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  return student;
};

module.exports = {
  registerStudent,
  loginStudent,
  registerTeacher,
  loginTeacher,
};