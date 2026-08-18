import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookOpen,
  ScanLine,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
  BarChart2,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { fetchMyEnrollments } from '../../redux/slices/enrollmentSlice';
import { getMyActiveSessions } from '../../redux/slices/attendanceSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader, { CardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import JoinSubjectModal from '../../components/student/JoinSubjectModal';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { myEnrollments, loading: enrollmentsLoading } = useSelector(
    (state) => state.enrollments
  );
  const { activeStudentSessions } = useSelector((state) => state.attendance);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
    dispatch(getMyActiveSessions());
  }, [dispatch]);

  const totalEnrolled = myEnrollments?.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Student Portal v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-lg">
            Roll Number: <span className="font-mono font-bold text-white">{user?.rollNo || 'N/A'}</span> • {user?.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Button
            onClick={() => navigate('/student/scan')}
            size="md"
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold shadow-md"
            icon={ScanLine}
          >
            Open QR Scanner
          </Button>
          <Button
            onClick={() => setIsJoinModalOpen(true)}
            size="md"
            variant="secondary"
            className="bg-emerald-700/80 text-white hover:bg-emerald-700 border-emerald-600 font-semibold"
            icon={Plus}
          >
            Join Subject
          </Button>
        </div>
      </div>

      {/* Active Attendance Session Banner */}
      {activeStudentSessions && activeStudentSessions.length > 0 && (
        <Card className="p-6 border-2 border-emerald-500 bg-emerald-50/50 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl animate-pulse">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="emerald" size="sm">Active Session in Progress</Badge>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Attendance is active for your enrolled subject!
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast expires soon • Scan now before timer runs out
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/student/scan')}
              variant="success"
              icon={ArrowRight}
            >
              Verify Attendance Now
            </Button>
          </div>
        </Card>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Enrolled Subjects
            </p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              {enrollmentsLoading ? '...' : totalEnrolled}
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Attendance
            </p>
            <h4 className="text-2xl font-black text-indigo-600 mt-0.5">
              88.5%
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Classes Attended
            </p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">
              28 / 32
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Compliance Status
            </p>
            <h4 className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Above Threshold (75%)
            </h4>
          </div>
        </Card>
      </div>

      {/* Enrolled Subjects List */}
      <Card className="p-6">
        <CardHeader
          title="My Enrolled Subjects"
          subtitle="All academic courses you are actively registered in"
          action={
            <Button
              onClick={() => setIsJoinModalOpen(true)}
              size="sm"
              variant="secondary"
              icon={Plus}
            >
              Join Another Subject
            </Button>
          }
        />

        {enrollmentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : myEnrollments.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Subjects Enrolled"
            description="Use the join code provided by your instructor to enroll into your first subject."
            actionLabel="Join Subject"
            onAction={() => setIsJoinModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEnrollments.map((enr) => {
              const sub = enr.subject || {};
              const classObj = sub.class || {};

              return (
                <Card
                  key={enr.id || enr._id}
                  hover
                  className="p-6 border border-slate-100 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <Badge variant="emerald" size="sm">
                        {sub.subjectCode || 'SUB'}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {sub.subjectName || 'Enrolled Subject'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {classObj.className ? `${classObj.className} (Yr ${classObj.year}-${classObj.section})` : 'Class Cohort'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      88% Attendance
                    </span>
                    <Button
                      onClick={() => navigate('/student/attendance')}
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                    >
                      History
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Join Subject Modal */}
      <JoinSubjectModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};

export default StudentDashboard;
