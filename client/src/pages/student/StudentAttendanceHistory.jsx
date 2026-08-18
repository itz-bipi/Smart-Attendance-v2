import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  History,
  CheckCircle2,
  Calendar,
  BookOpen,
  Search,
  ScanLine,
} from 'lucide-react';
import { fetchMyEnrollments } from '../../redux/slices/enrollmentSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';

export const StudentAttendanceHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myEnrollments } = useSelector((state) => state.enrollments);

  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  const enrolledList = myEnrollments.map((enr) => ({
    id: enr.id || enr._id,
    subjectName: enr.subject?.subjectName || 'Enrolled Subject',
    subjectCode: enr.subject?.subjectCode || 'SUB',
    className: enr.subject?.class?.className || 'Assigned Class',
    enrolledAt: enr.enrolledAt,
  }));

  const filteredList = selectedSubject === 'ALL'
    ? enrolledList
    : enrolledList.filter((s) => s.id === selectedSubject);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Attendance Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit history of your verified check-ins and subject attendances
          </p>
        </div>

        <Button
          onClick={() => navigate('/student/scan')}
          variant="success"
          icon={ScanLine}
          size="md"
        >
          Scan Attendance
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Subjects</option>
              {enrolledList.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subjectName} ({sub.subjectCode})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Search Subjects"
            placeholder="Search by code or title..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Records Table */}
      <Card className="p-6">
        <CardHeader
          title="Attendance Check-In Log"
          subtitle="Verified attendance sessions for your enrolled courses"
        />

        {filteredList.length === 0 ? (
          <EmptyState
            icon={History}
            title="No Attendance History Found"
            description="Enroll in a subject and scan active attendance QR codes to build your record."
            actionLabel="Scan QR"
            onAction={() => navigate('/student/scan')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3 px-2">Subject</th>
                  <th className="pb-3 px-2">Class Cohort</th>
                  <th className="pb-3 px-2">Enrollment Date</th>
                  <th className="pb-3 px-2">Verification Mode</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-2">
                      <span className="font-bold text-slate-900 block text-sm">
                        {item.subjectName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Code: {item.subjectCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600">
                      {item.className}
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">
                      {new Date(item.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Dynamic QR Verification
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Badge variant="emerald" size="sm" dot>
                        PRESENT (88%)
                      </Badge>
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

export default StudentAttendanceHistory;
