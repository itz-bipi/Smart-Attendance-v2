import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
          <QrCode className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Attendance System
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Please choose your institutional role to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Teacher Option */}
          <Card
            hover
            className="p-8 border-2 border-slate-100 hover:border-indigo-500 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="indigo" size="sm" className="mb-2">Faculty</Badge>
                <h3 className="text-xl font-bold text-slate-900">Teacher Portal</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Start live sessions, manage classes and subjects, monitor attendance rosters, and review audit charts.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Button
                onClick={() => navigate('/auth/teacher/login')}
                className="w-full"
                icon={ArrowRight}
              >
                Teacher Login
              </Button>
              <Button
                onClick={() => navigate('/auth/teacher/register')}
                variant="ghost"
                className="w-full text-xs"
              >
                Register as New Teacher
              </Button>
            </div>
          </Card>

          {/* Student Option */}
          <Card
            hover
            className="p-8 border-2 border-slate-100 hover:border-emerald-500 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="emerald" size="sm" className="mb-2">Enrolled</Badge>
                <h3 className="text-xl font-bold text-slate-900">Student Portal</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Scan classroom attendance QR codes, verify active tokens, join subjects, and review personal percentages.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Button
                onClick={() => navigate('/auth/student/login')}
                variant="success"
                className="w-full"
                icon={ArrowRight}
              >
                Student Login
              </Button>
              <Button
                onClick={() => navigate('/auth/student/register')}
                variant="ghost"
                className="w-full text-xs"
              >
                Register as New Student
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
