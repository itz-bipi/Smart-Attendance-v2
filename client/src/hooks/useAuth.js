import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated, loading, sessionChecking, error, registerSuccessMessage } =
    useSelector((state) => state.auth);

  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    role,
    isAuthenticated,
    isTeacher,
    isStudent,
    loading,
    sessionChecking,
    error,
    registerSuccessMessage,
    logout: handleLogout,
  };
};

export default useAuth;
