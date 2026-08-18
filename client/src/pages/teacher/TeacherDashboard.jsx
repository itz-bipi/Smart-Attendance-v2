import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  GraduationCap,
  BookOpen,
  Users,
  PlayCircle,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Key,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import CreateClassModal from '../../components/teacher/CreateClassModal';
import CreateSubjectModal from '../../components/teacher/CreateSubjectModal';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { classes, loading: classesLoading } = useSelector((state) => state.classes);
  const { subjects, loading: subjectsLoading } = useSelector((state) => state.subjects);
  const { activeTeacherSession } = useSelector((state) => state.attendance);

  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const activeClassesCount = classes?.length || 0;
  const activeSubjectsCount = subjects?.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Faculty Portal v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Professor'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-lg">
            Department of {user?.department || 'Academic Affairs'} • Employee ID: {user?.employeeId || 'N/A'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Button
            onClick={() => navigate('/teacher/attendance/start')}
            size="md"
            className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold shadow-md"
            icon={PlayCircle}
          >
            Start Attendance
          </Button>
          <Button
            onClick={() => setIsCreateSubjectOpen(true)}
            size="md"
            variant="secondary"
            className="bg-indigo-700/80 text-white hover:bg-indigo-700 border-indigo-600 font-semibold"
            icon={Plus}
          >
            New Subject
          </Button>
        </div>
      </div>

      {/* Active Session Alert Banner (if running) */}
      {activeTeacherSession && (
        <Card className="p-6 border-2 border-indigo-500 bg-indigo-50/50 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl animate-pulse">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="indigo" size="sm">Active Attendance Session</Badge>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Session #{activeTeacherSession.sessionCode} is currently live
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast active until {new Date(activeTeacherSession.expiresAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/teacher/attendance/session/${activeTeacherSession.id || activeTeacherSession._id}`)}
              icon={ArrowRight}
            >
              Open Projector View
            </Button>
          </div>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Subjects
            </p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {subjectsLoading ? '...' : activeSubjectsCount}
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Classes
            </p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {classesLoading ? '...' : activeClassesCount}
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Department
            </p>
            <h4 className="text-lg font-bold text-slate-900 mt-0.5 truncate max-w-[140px]">
              {user?.department || 'General'}
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Status
            </p>
            <h4 className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </h4>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Quick Faculty Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setIsCreateClassOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Create Class</p>
              <p className="text-[10px] text-slate-400">Add cohort or batch</p>
            </div>
          </button>

          <button
            onClick={() => setIsCreateSubjectOpen(true)}
            className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Create Subject</p>
              <p className="text-[10px] text-slate-400">Get student join code</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/attendance/start')}
            className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlayCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Start Attendance</p>
              <p className="text-[10px] text-slate-400">Projector QR session</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/attendance')}
            className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-sm transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">View Records</p>
              <p className="text-[10px] text-slate-400">Check session logs</p>
            </div>
          </button>
        </div>
      </div>

      {/* Your Subjects List */}
      <Card className="p-6">
        <CardHeader
          title="Assigned Subjects"
          subtitle="Subjects registered under your faculty profile with student join codes"
          action={
            <Button
              onClick={() => setIsCreateSubjectOpen(true)}
              size="sm"
              icon={Plus}
            >
              Add Subject
            </Button>
          }
        />

        {subjectsLoading ? (
          <SkeletonLoader count={3} height="h-14" />
        ) : subjects.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Subjects Created Yet"
            description="Create your first subject to generate a join code and start taking classroom attendance."
            actionLabel="Create Subject"
            onAction={() => setIsCreateSubjectOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3 px-2">Subject</th>
                  <th className="pb-3 px-2">Code</th>
                  <th className="pb-3 px-2">Class Cohort</th>
                  <th className="pb-3 px-2">Join Code</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {subjects.map((sub) => {
                  const classObj = sub.class || {};
                  return (
                    <tr key={sub.id || sub._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2">
                        <span className="font-bold text-slate-900 block text-sm">
                          {sub.subjectName}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <Badge variant="indigo" size="sm">{sub.subjectCode}</Badge>
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">
                        {classObj.className ? `${classObj.className} (Yr ${classObj.year}-${classObj.section})` : 'Class Assigned'}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-mono bg-slate-100 text-indigo-700 px-2 py-1 rounded-lg font-bold">
                          {sub.joinCode || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right space-x-2">
                        <Button
                          onClick={() => navigate(`/teacher/subjects/${sub.id || sub._id}/enrollments`)}
                          size="sm"
                          variant="secondary"
                          className="text-xs"
                        >
                          Roster
                        </Button>
                        <Button
                          onClick={() => navigate('/teacher/attendance/start')}
                          size="sm"
                          variant="primary"
                          className="text-xs"
                        >
                          Start Attendance
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <CreateClassModal
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
      />
      <CreateSubjectModal
        isOpen={isCreateSubjectOpen}
        onClose={() => setIsCreateSubjectOpen(false)}
        classes={classes}
      />
    </div>
  );
};

export default TeacherDashboard;
