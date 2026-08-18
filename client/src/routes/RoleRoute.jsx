import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const RoleRoute = ({ allowedRoles = [], children }) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/role" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // If student tries to visit teacher route, redirect to student dashboard
    if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    // If teacher tries to visit student route, redirect to teacher dashboard
    if (role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
