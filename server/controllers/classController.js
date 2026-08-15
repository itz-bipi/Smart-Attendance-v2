const {
  createClass: createClassService,
  getClasses: getClassesService,
  getClassById: getClassByIdService,
  updateClass: updateClassService,
  deleteClass: deleteClassService,
} = require("../services/classService");

const createClass = async (req, res) => {
  try {
    const newClass = await createClassService(
  req.body,
  req.user.id
);

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: {
        id: newClass._id,
        className: newClass.className,
        year: newClass.year,
        section: newClass.section,
        academicYear: newClass.academicYear,
        isActive: newClass.isActive,
      },
    });
  } catch (error) {
    console.error("Create class error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create class",
    });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await getClassesService();

    res.status(200).json({
      success: true,
      classes: classes.map((classItem) => ({
        id: classItem._id,
        className: classItem.className,
        year: classItem.year,
        section: classItem.section,
        academicYear: classItem.academicYear,
        isActive: classItem.isActive,
      })),
    });
  } catch (error) {
    console.error("Get classes error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
    });
  }
};

const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await getClassByIdService(classId);

    res.status(200).json({
      success: true,
      class: {
        id: classData._id,
        className: classData.className,
        year: classData.year,
        section: classData.section,
        academicYear: classData.academicYear,
        isActive: classData.isActive,
      },
    });
  } catch (error) {
    console.error("Get class error:", error.message);

    if (error.message === "Class not found" || error.message === "Invalid class ID") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch class",
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const updatedClass = await updateClassService(
      classId,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: {
        id: updatedClass._id,
        className: updatedClass.className,
        year: updatedClass.year,
        section: updatedClass.section,
        academicYear: updatedClass.academicYear,
        createdBy: updatedClass.createdBy,
        isActive: updatedClass.isActive,
      },
    });
  } catch (error) {
    console.error("Update class error:", error.message);

    if (
      error.message === "Invalid class ID" ||
      error.message === "Class not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
      "You are not authorized to update this class"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update class",
    });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    await deleteClassService(
      classId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Class deactivated successfully",
    });
  } catch (error) {
    console.error("Delete class error:", error.message);

    if (
      error.message === "Invalid class ID" ||
      error.message === "Class not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
        "You are not authorized to delete this class" ||
      error.message === "Class is already inactive"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to deactivate class",
    });
  }
};



module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};