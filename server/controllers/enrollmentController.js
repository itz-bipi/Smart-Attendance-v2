const {
  joinSubject: joinSubjectService,
  getMyEnrollments: getMyEnrollmentsService,
  getSubjectEnrollments: getSubjectEnrollmentsService,
  updateEnrollmentStatus: updateEnrollmentStatusService,
} = require("../services/enrollmentService");

const joinSubject = async (req, res) => {
  try {
    const { joinCode } = req.body;

    if (!joinCode) {
      return res.status(400).json({
        success: false,
        message: "Join code is required",
      });
    }

    const enrollment = await joinSubjectService(
      joinCode,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Subject joined successfully",
      enrollment: {
        id: enrollment._id,
        studentId: enrollment.studentId,
        subjectId: enrollment.subjectId,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
      },
    });
  } catch (error) {
    console.error("Join subject error:", error.message);

    if (
      error.message === "Invalid student ID" ||
      error.message === "Student not found" ||
      error.message === "Class not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Invalid join code" ||
      error.message === "Subject is inactive" ||
      error.message === "Class is inactive" ||
      error.message === "Student account is inactive" ||
      error.message === "Student does not belong to this class"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Student is already enrolled"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to join subject",
    });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await getMyEnrollmentsService(
      req.user.id
    );

    res.status(200).json({
      success: true,
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment._id,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,

        subject: enrollment.subjectId
          ? {
              id: enrollment.subjectId._id,
              subjectName: enrollment.subjectId.subjectName,
              subjectCode: enrollment.subjectId.subjectCode,
              teacherId: enrollment.subjectId.teacherId,
              isActive: enrollment.subjectId.isActive,

              class: enrollment.subjectId.classId
                ? {
                    id: enrollment.subjectId.classId._id,
                    className:
                      enrollment.subjectId.classId.className,
                    year: enrollment.subjectId.classId.year,
                    section:
                      enrollment.subjectId.classId.section,
                    academicYear:
                      enrollment.subjectId.classId.academicYear,
                    isActive:
                      enrollment.subjectId.classId.isActive,
                  }
                : null,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error(
      "Get my enrollments error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
};

const getSubjectEnrollments = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const enrollments =
      await getSubjectEnrollmentsService(
        subjectId,
        req.user.id
      );

    res.status(200).json({
      success: true,
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment._id,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,

        student: enrollment.studentId
          ? {
              id: enrollment.studentId._id,
              name: enrollment.studentId.name,
              email: enrollment.studentId.email,
              rollNo: enrollment.studentId.rollNo,
              classId: enrollment.studentId.classId,
              isActive: enrollment.studentId.isActive,
              faceRegistered:
                enrollment.studentId.faceRegistered,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error(
      "Get subject enrollments error:",
      error.message
    );

    if (
      error.message === "Invalid subject ID" ||
      error.message === "Subject not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
      "You are not authorized to view these enrollments"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch subject enrollments",
    });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const enrollment =
      await updateEnrollmentStatusService(
        enrollmentId,
        status,
        req.user.id
      );

    res.status(200).json({
      success: true,
      message: "Enrollment status updated successfully",
      enrollment: {
        id: enrollment._id,
        studentId: enrollment.studentId,
        subjectId: enrollment.subjectId,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
      },
    });
  } catch (error) {
    console.error(
      "Update enrollment status error:",
      error.message
    );

    if (
      error.message === "Invalid enrollment ID" ||
      error.message === "Enrollment not found" ||
      error.message === "Subject not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Invalid enrollment status"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
      "You are not authorized to update this enrollment"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update enrollment status",
    });
  }
};

module.exports = {
  joinSubject,
  getMyEnrollments,
  getSubjectEnrollments,
  updateEnrollmentStatus,
};