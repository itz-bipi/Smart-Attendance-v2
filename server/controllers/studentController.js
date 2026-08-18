const Student = require("../models/Student");

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(
      req.user.id
    ).select(
      "-password -faceDescriptor"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error(
      "Get student profile error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch student profile",
    });
  }
};


const updateStudentProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
    } = req.body;

    const student =
      await Student.findById(
        req.user.id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update only fields that were provided
    if (name !== undefined) {
      student.name = name;
    }

    if (email !== undefined) {
      student.email = email;
    }

    await student.save();

    res.status(200).json({
      success: true,
      message:
        "Student profile updated successfully",

      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
        faceRegistered:
          !!student.faceDescriptor &&
          student.faceDescriptor.length > 0,
      },
    });
  } catch (error) {
    console.error(
      "Update student profile error:",
      error.message
    );

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update student profile",
    });
  }
};

module.exports = {
  // existing controllers...

  getStudentProfile,
  updateStudentProfile,
};