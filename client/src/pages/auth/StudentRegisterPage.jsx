import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users,
  Mail,
  Lock,
  User,
  Hash,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { registerStudent, clearAuthError } from '../../redux/slices/authSlice';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const StudentRegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, registerSuccessMessage } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    password: '',
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerStudent(formData));
    if (registerStudent.fulfilled.match(res)) {
      setTimeout(() => {
        navigate('/auth/student/login');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
          <Users className="w-6 h-6" />
        </div>
        <Badge variant="emerald" size="sm">Student Registration</Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Student Account
        </h2>
        <p className="text-xs text-slate-500">
          Enter your student details to register with your roll number
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
                <p className="text-[11px] text-emerald-600 mt-0.5">Redirecting to student login...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              icon={User}
              placeholder="Rahul Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Student Email"
              type="email"
              required
              icon={Mail}
              placeholder="rahul.kumar@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Roll Number / Student ID"
              required
              icon={Hash}
              placeholder="BCA-2026-042"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />

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
              variant="success"
              isLoading={loading}
              className="w-full shadow-md shadow-emerald-200"
              icon={ArrowRight}
            >
              Complete Student Registration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have a student account?{' '}
              <Link
                to="/auth/student/login"
                className="font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                Student Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegisterPage;
