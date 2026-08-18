import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users,
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Hash,
  Mail,
  Camera,
} from 'lucide-react';
import {
  fetchSubjectEnrollments,
  updateEnrollmentStatus,
} from '../../redux/slices/enrollmentSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import SkeletonLoader, { TableSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

export const TeacherSubjectEnrollments = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subjectEnrollments, loading, actionSuccessMessage } = useSelector(
    (state) => state.enrollments
  );
  const { subjects } = useSelector((state) => state.subjects);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (subjectId) {
      dispatch(fetchSubjectEnrollments(subjectId));
      if (subjects.length === 0) {
        dispatch(fetchSubjects());
      }
    }
  }, [subjectId, dispatch, subjects.length]);

  const currentSubject = subjects.find(
    (s) => s.id === subjectId || s._id === subjectId
  );

  const handleToggleStatus = async (enrollmentId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await dispatch(updateEnrollmentStatus({ enrollmentId, status: nextStatus }));
  };

  const filteredEnrollments = subjectEnrollments.filter((enrollment) => {
    const student = enrollment.student || {};
    const term = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(term) ||
      student.rollNo?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/teacher/subjects')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Subjects
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentSubject?.subjectName || 'Enrolled Student Roster'}
              </h1>
              {currentSubject?.subjectCode && (
                <Badge variant="indigo" size="md">
                  {currentSubject.subjectCode}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Join Code: <span className="font-mono font-bold text-indigo-600">{currentSubject?.joinCode || 'N/A'}</span> • {subjectEnrollments.length} Total Enrolled Students
            </p>
          </div>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium animate-in fade-in">
          {actionSuccessMessage}
        </div>
      )}

      {/* Roster Table Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Enrolled Students</h3>
            <p className="text-xs text-slate-500">
              Students who registered to this subject with the join code
            </p>
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by name, roll no..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : filteredEnrollments.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Enrolled Students"
            description="Give students the subject join code so they can self-enroll into this subject."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3 px-2">Student Name</th>
                  <th className="pb-3 px-2">Roll Number</th>
                  <th className="pb-3 px-2">Email Address</th>
                  <th className="pb-3 px-2">Enrolled Date</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {filteredEnrollments.map((enr) => {
                  const enrId = enr.id || enr._id;
                  const student = enr.student || {};
                  const isActive = enr.status === 'active';

                  return (
                    <tr key={enrId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                            {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <span className="font-bold text-slate-900">{student.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 font-mono font-semibold text-slate-600">
                        {student.rollNo || 'N/A'}
                      </td>

                      <td className="py-3.5 px-2 text-slate-500">
                        {student.email || 'N/A'}
                      </td>

                      <td className="py-3.5 px-2 text-slate-500">
                        {new Date(enr.enrolledAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-2">
                        <Badge variant={isActive ? 'emerald' : 'slate'} size="sm" dot>
                          {enr.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-2 text-right">
                        <Button
                          onClick={() => handleToggleStatus(enrId, enr.status)}
                          size="sm"
                          variant={isActive ? 'secondary' : 'primary'}
                          className="text-xs"
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
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
    </div>
  );
};

export default TeacherSubjectEnrollments;
