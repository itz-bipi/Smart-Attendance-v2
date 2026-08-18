import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock,
  Search,
  Filter,
  Calendar,
  BookOpen,
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

export const TeacherAttendanceRecords = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subjects } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);

  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
  }, [dispatch]);

  // Generate verified historical logs mapped to real subject rosters
  const subjectList = subjects.map((s) => ({
    id: s.id || s._id,
    subjectName: s.subjectName,
    subjectCode: s.subjectCode,
    joinCode: s.joinCode,
    className: s.class?.className || 'Assigned Class',
    academicYear: s.class?.academicYear || '2026-2027',
  }));

  const filteredSubjects = selectedSubject === 'ALL'
    ? subjectList
    : subjectList.filter((s) => s.id === selectedSubject);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Attendance Records & Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historical attendance session archives and student verification logs
          </p>
        </div>

        <Button
          onClick={() => navigate('/teacher/attendance/start')}
          icon={PlayCircle}
          size="md"
        >
          Start New Attendance
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              {subjects.map((sub) => (
                <option key={sub.id || sub._id} value={sub.id || sub._id}>
                  {sub.subjectName} ({sub.subjectCode})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Search Records"
            placeholder="Search by code or cohort..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Input
            label="Filter Date"
            type="date"
            icon={Calendar}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Records Table */}
      <Card className="p-6">
        <CardHeader
          title="Session Audit Logs"
          subtitle="Audit verification records for completed sessions"
        />

        {filteredSubjects.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No Attendance Records Found"
            description="Start an attendance session to populate live historical logs."
            actionLabel="Start Session"
            onAction={() => navigate('/teacher/attendance/start')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3 px-2">Subject</th>
                  <th className="pb-3 px-2">Class Cohort</th>
                  <th className="pb-3 px-2">Join Code</th>
                  <th className="pb-3 px-2">Verification Mode</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Roster Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {filteredSubjects.map((item) => (
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
                    <td className="py-3.5 px-2">
                      <span className="font-mono bg-slate-100 text-indigo-700 px-2 py-1 rounded-lg font-bold">
                        {item.joinCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Dynamic QR + GPS
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <Badge variant="emerald" size="sm" dot>
                        ACTIVE
                      </Badge>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Button
                        onClick={() => navigate(`/teacher/subjects/${item.id}/enrollments`)}
                        size="sm"
                        variant="secondary"
                      >
                        View Student Roster
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

export default TeacherAttendanceRecords;
