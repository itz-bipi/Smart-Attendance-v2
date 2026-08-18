import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Building,
  BadgeCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { registerTeacher, clearAuthError } from '../../redux/slices/authSlice';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const TeacherRegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, registerSuccessMessage } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    employeeId: '',
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerTeacher(formData));
    if (registerTeacher.fulfilled.match(res)) {
      setTimeout(() => {
        navigate('/auth/teacher/login');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <GraduationCap className="w-6 h-6" />
        </div>
        <Badge variant="indigo" size="sm">Faculty Registration</Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Teacher Account
        </h2>
        <p className="text-xs text-slate-500">
          Enter your academic details to register as a verified instructor
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

          {registerSuccessMessage && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700 font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <span>{registerSuccessMessage}</span>
                <p className="text-[11px] text-emerald-600 mt-0.5">Redirecting to login...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              icon={User}
              placeholder="Dr. Rajesh Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Institutional Email"
              type="email"
              required
              icon={Mail}
              placeholder="rajesh.sharma@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department"
                required
                icon={Building}
                placeholder="Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />

              <Input
                label="Employee ID"
                required
                icon={BadgeCheck}
                placeholder="EMP-1042"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
            </div>

            <Input
              label="Password (min 6 characters)"
              type="password"
              required
              minLength={6}
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
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/auth/teacher/login"
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Teacher Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherRegisterPage;
