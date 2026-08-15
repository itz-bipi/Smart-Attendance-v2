const {
  createSubject: createSubjectService,
  getSubjectsForUser: getSubjectsForUserService,
} = require("../services/subjectService");

const createSubject = async (req, res) => {
  try {
    const subject = await createSubjectService(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject: {
        id: subject._id,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        joinCode: subject.joinCode,
        classId: subject.classId,
        teacherId: subject.teacherId,
        isActive: subject.isActive,
      },
    });
  } catch (error) {
    console.error("Create subject error:", error.message);

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
        "Cannot create subject for an inactive class" ||
      error.message ===
        "This subject code already exists for this class"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create subject",
    });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await getSubjectsForUserService(
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      subjects: subjects.map((subject) => ({
        id: subject._id,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        class: subject.classId,
        teacherId: subject.teacherId,
        isActive: subject.isActive,
      })),
    });
  } catch (error) {
    console.error("Get subjects error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
};