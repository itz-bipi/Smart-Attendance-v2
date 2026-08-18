import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { fetchMyEnrollments } from '../../redux/slices/enrollmentSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const StudentAnalytics = () => {
  const dispatch = useDispatch();
  const { myEnrollments } = useSelector((state) => state.enrollments);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  const subjectChartData = myEnrollments.map((enr, i) => ({
    name: enr.subject?.subjectCode || `Course ${i + 1}`,
    attendance: 82 + (i * 5) % 15,
  }));

  const pieData = [
    { name: 'Present Classes', value: 88, color: '#10b981' },
    { name: 'Absent / Leaves', value: 12, color: '#f1f5f9' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Personal Attendance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed metrics, subject-wise percentages, and institutional compliance checks
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Percentage
            </span>
            <Badge variant="emerald" size="sm">Good Standing</Badge>
          </div>
          <h3 className="text-4xl font-black text-emerald-600 mt-3">88.5%</h3>
          <p className="text-xs text-slate-500 mt-1">
            Minimum required threshold is 75.0%
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Enrolled
            </span>
            <Badge variant="indigo" size="sm">{myEnrollments.length} Active</Badge>
          </div>
          <h3 className="text-4xl font-black text-slate-900 mt-3">
            {myEnrollments.length} Subjects
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Across all enrolled academic modules
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Classes Attended
            </span>
            <Badge variant="emerald" size="sm">28 Attended</Badge>
          </div>
          <h3 className="text-4xl font-black text-slate-900 mt-3">28 / 32</h3>
          <p className="text-xs text-slate-500 mt-1">
            Only 4 classes missed this semester
          </p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Subject-wise Bar Chart */}
        <Card className="lg:col-span-8 p-6 space-y-6">
          <CardHeader
            title="Subject-wise Attendance Breakdown (%)"
            subtitle="Your current attendance rate for each enrolled subject"
          />

          <div className="h-72 w-full">
            {subjectChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Enroll in subjects to view individual performance bars
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(val) => [`${val}%`, 'Attendance']}
                  />
                  <Bar dataKey="attendance" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="lg:col-span-4 p-6 space-y-6">
          <CardHeader
            title="Semester Attendance"
            subtitle="Present vs Absent distribution"
          />

          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">88.5%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Present</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Present (88.5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span>Missed (11.5%)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentAnalytics;
