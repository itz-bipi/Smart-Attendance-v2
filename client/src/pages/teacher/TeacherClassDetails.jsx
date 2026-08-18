import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  ArrowLeft,
  PlayCircle,
} from 'lucide-react';
import { fetchClassById } from '../../redux/slices/classSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

export const TeacherClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentClass, loading: classLoading } = useSelector((state) => state.classes);
  const { subjects, loading: subjectsLoading } = useSelector((state) => state.subjects);

  useEffect(() => {
    if (classId) {
      dispatch(fetchClassById(classId));
      dispatch(fetchSubjects());
    }
  }, [classId, dispatch]);

  const classSubjects = subjects.filter((s) => {
    const sClassId = s.class?._id || s.class?.id || s.classId;
    return sClassId === classId;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/teacher/classes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Classes
        </button>

        {classLoading ? (
          <SkeletonLoader count={1} height="h-10" width="w-64" />
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentClass?.className}
                </h1>
                <Badge variant="indigo" size="md">
                  Section {currentClass?.section}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Year {currentClass?.year} • Academic Year {currentClass?.academicYear}
              </p>
            </div>

            <Button
              onClick={() => navigate('/teacher/attendance/start')}
              icon={PlayCircle}
              size="md"
            >
              Start Class Attendance
            </Button>
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Year & Section
            </p>
            <h4 className="text-xl font-bold text-slate-900 mt-0.5">
              Year {currentClass?.year || '1'} - {currentClass?.section || 'A'}
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Session Term
            </p>
            <h4 className="text-xl font-bold text-slate-900 mt-0.5">
              {currentClass?.academicYear || '2026-2027'}
            </h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Assigned Subjects
            </p>
            <h4 className="text-xl font-bold text-slate-900 mt-0.5">
              {classSubjects.length} Registered
            </h4>
          </div>
        </Card>
      </div>

      {/* Subjects under this class */}
      <Card className="p-6">
        <CardHeader
          title="Subjects in this Class"
          subtitle="All academic subjects registered for this class cohort"
        />

        {subjectsLoading ? (
          <SkeletonLoader count={3} height="h-12" />
        ) : classSubjects.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Subjects Assigned to this Class"
            description="Go to Subjects page to add subjects under this class cohort."
            actionLabel="Manage Subjects"
            onAction={() => navigate('/teacher/subjects')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3 px-2">Subject Name</th>
                  <th className="pb-3 px-2">Code</th>
                  <th className="pb-3 px-2">Student Join Code</th>
                  <th className="pb-3 px-2 text-right">Roster & Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {classSubjects.map((sub) => (
                  <tr key={sub.id || sub._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 text-sm">
                      {sub.subjectName}
                    </td>
                    <td className="py-3.5 px-2">
                      <Badge variant="indigo" size="sm">{sub.subjectCode}</Badge>
                    </td>
                    <td className="py-3.5 px-2 font-mono font-bold text-indigo-600">
                      {sub.joinCode}
                    </td>
                    <td className="py-3.5 px-2 text-right space-x-2">
                      <Button
                        onClick={() => navigate(`/teacher/subjects/${sub.id || sub._id}/enrollments`)}
                        size="sm"
                        variant="secondary"
                      >
                        View Enrolled Students
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeacherClassDetails;
