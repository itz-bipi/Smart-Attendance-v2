import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { loginTeacher, clearAuthError } from '../../redux/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const TeacherLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated && role === 'teacher') {
      navigate('/teacher/dashboard');
    }
  }, [isAuthenticated, role, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    const res = await dispatch(loginTeacher(formData));
    if (loginTeacher.fulfilled.match(res)) {
      navigate('/teacher/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <GraduationCap className="w-6 h-6" />
        </div>
        <Badge variant="indigo" size="sm">Faculty Portal</Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Teacher Sign In
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to manage classes and start attendance sessions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-8 shadow-xl shadow-slate-200/50">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Institutional Email"
              type="email"
              required
              icon={Mail}
              placeholder="prof.sharma@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Button
              type="submit"
              size="md"
              isLoading={loading}
              className="w-full shadow-md shadow-indigo-200"
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-500">
              New faculty member?{' '}
              <Link
                to="/auth/teacher/register"
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Register Teacher Account
              </Link>
            </p>
            <div>
              <Link
                to="/auth/role"
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                ← Switch to Student Login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherLoginPage;
