import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Plus, Key, Calendar, CheckCircle2, ScanLine } from 'lucide-react';
import { fetchMyEnrollments } from '../../redux/slices/enrollmentSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader, { CardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import JoinSubjectModal from '../../components/student/JoinSubjectModal';

export const StudentClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myEnrollments, loading } = useSelector((state) => state.enrollments);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Enrolled Classes & Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Subjects in which you are actively enrolled and authorized for attendance check-ins
          </p>
        </div>

        <Button
          onClick={() => setIsJoinOpen(true)}
          icon={Plus}
          size="md"
          variant="success"
        >
          Join New Subject
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : myEnrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Subjects Enrolled"
          description="Enter a join code provided by your instructor to enroll into your classes."
          actionLabel="Enter Join Code"
          onAction={() => setIsJoinOpen(true)}
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
                className="p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <Badge variant="emerald" size="sm" dot>
                      Enrolled
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {sub.subjectName || 'Subject Title'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Code: <span className="font-bold text-slate-700">{sub.subjectCode}</span>
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Cohort:</span>{' '}
                      {classObj.className ? `${classObj.className} (Yr ${classObj.year} • Sec ${classObj.section})` : 'Class Assigned'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Enrolled on: {new Date(enr.enrolledAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    onClick={() => navigate('/student/attendance')}
                    size="sm"
                    variant="secondary"
                  >
                    View Logs
                  </Button>
                  <Button
                    onClick={() => navigate('/student/scan')}
                    size="sm"
                    variant="success"
                    icon={ScanLine}
                  >
                    Scan QR
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Join Modal */}
      <JoinSubjectModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
      />
    </div>
  );
};

export default StudentClasses;
