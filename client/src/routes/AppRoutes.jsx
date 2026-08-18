import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import TeacherLayout from '../components/layout/TeacherLayout';
import StudentLayout from '../components/layout/StudentLayout';

// Protection
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import RoleSelectionPage from '../pages/auth/RoleSelectionPage';
import TeacherLoginPage from '../pages/auth/TeacherLoginPage';
import TeacherRegisterPage from '../pages/auth/TeacherRegisterPage';
import StudentLoginPage from '../pages/auth/StudentLoginPage';
import StudentRegisterPage from '../pages/auth/StudentRegisterPage';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherClasses from '../pages/teacher/TeacherClasses';
import TeacherClassDetails from '../pages/teacher/TeacherClassDetails';
import TeacherSubjects from '../pages/teacher/TeacherSubjects';
import TeacherSubjectEnrollments from '../pages/teacher/TeacherSubjectEnrollments';
import TeacherStartAttendance from '../pages/teacher/TeacherStartAttendance';
import TeacherLiveSession from '../pages/teacher/TeacherLiveSession';
import TeacherAttendanceRecords from '../pages/teacher/TeacherAttendanceRecords';
import TeacherAnalytics from '../pages/teacher/TeacherAnalytics';
import TeacherProfile from '../pages/teacher/TeacherProfile';
import TeacherSettings from '../pages/teacher/TeacherSettings';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentClasses from '../pages/student/StudentClasses';
import StudentScanAttendance from '../pages/student/StudentScanAttendance';
import StudentAttendanceHistory from '../pages/student/StudentAttendanceHistory';
import StudentAnalytics from '../pages/student/StudentAnalytics';
import StudentFaceRegistration from '../pages/student/StudentFaceRegistration';
import StudentProfile from '../pages/student/StudentProfile';
import StudentSettings from '../pages/student/StudentSettings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Authentication Pages */}
      <Route path="/auth/role" element={<RoleSelectionPage />} />
      <Route path="/auth/teacher/login" element={<TeacherLoginPage />} />
      <Route path="/auth/teacher/register" element={<TeacherRegisterPage />} />
      <Route path="/auth/student/login" element={<StudentLoginPage />} />
      <Route path="/auth/student/register" element={<StudentRegisterPage />} />

      {/* Protected Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['teacher']}>
              <TeacherLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="classes/:classId" element={<TeacherClassDetails />} />
        <Route path="subjects" element={<TeacherSubjects />} />
        <Route path="subjects/:subjectId/enrollments" element={<TeacherSubjectEnrollments />} />
        <Route path="attendance" element={<TeacherAttendanceRecords />} />
        <Route path="attendance/start" element={<TeacherStartAttendance />} />
        <Route path="attendance/session/:sessionId" element={<TeacherLiveSession />} />
        <Route path="analytics" element={<TeacherAnalytics />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>

      {/* Protected Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['student']}>
              <StudentLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="scan" element={<StudentScanAttendance />} />
        <Route path="attendance" element={<StudentAttendanceHistory />} />
        <Route path="analytics" element={<StudentAnalytics />} />
        <Route path="face-registration" element={<StudentFaceRegistration />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
