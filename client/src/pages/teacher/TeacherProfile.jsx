import React from 'react';
import {
  GraduationCap,
  Mail,
  Building,
  BadgeCheck,
  Shield,
  Calendar,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card, { CardHeader } from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const TeacherProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Faculty Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Registered faculty credentials and academic department assignments
        </p>
      </div>

      {/* Main Profile Card */}
      <Card className="p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-indigo-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <Badge variant="indigo" size="sm">Verified Faculty</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{user?.email}</p>
            <p className="text-xs text-indigo-600 font-semibold">
              Department of {user?.department || 'Academic Affairs'}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-slate-600 shadow-xs">
              <BadgeCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Employee ID</p>
              <p className="text-sm font-bold text-slate-800">{user?.employeeId || 'N/A'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-slate-600 shadow-xs">
              <Building className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
              <p className="text-sm font-bold text-slate-800">{user?.department || 'N/A'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-slate-600 shadow-xs">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Registered Email</p>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{user?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-slate-600 shadow-xs">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Account Status</p>
              <p className="text-sm font-bold text-emerald-600">Active & Authorized</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeacherProfile;
