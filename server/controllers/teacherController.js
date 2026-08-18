const Teacher = require("../models/Teacher");

const getTeacherProfile = async (
  req,
  res
) => {
  try {
    const teacher =
      await Teacher.findById(
        req.user.id
      ).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error(
      "Get teacher profile error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch teacher profile",
    });
  }
};

const updateTeacherProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      department,
    } = req.body;

    const teacher =
      await Teacher.findById(
        req.user.id
      );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (name !== undefined) {
      teacher.name = name;
    }

    if (email !== undefined) {
      teacher.email = email;
    }

    if (department !== undefined) {
      teacher.department =
        department;
    }

    await teacher.save();

    res.status(200).json({
      success: true,
      message:
        "Teacher profile updated successfully",

      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        department:
          teacher.department,
        role: teacher.role,
      },
    });
  } catch (error) {
    console.error(
      "Update teacher profile error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update teacher profile",
    });
  }
};

module.exports = {
  // existing controllers...

  getTeacherProfile,
  updateTeacherProfile,
};