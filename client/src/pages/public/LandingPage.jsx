import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  GraduationCap,
  Users,
  BarChart3,
  History,
  ArrowRight,
  Sparkles,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Dynamic QR Generation',
      desc: 'High-contrast, rotating cryptographically signed QR codes displayed on classroom projectors for rapid student check-in.',
      icon: QrCode,
      tag: 'Core Engine',
      color: 'indigo',
    },
    {
      title: 'Secure Authentication',
      desc: 'Role-segregated JWT authorization with httpOnly cookies protecting faculty administrative tools and student portals.',
      icon: ShieldCheck,
      tag: 'Security',
      color: 'emerald',
    },
    {
      title: 'Class & Subject Structure',
      desc: 'Create academic years, sections, and subjects with automatic 8-character unique join codes for seamless onboarding.',
      icon: GraduationCap,
      tag: 'Academic',
      color: 'sky',
    },
    {
      title: 'Student Self-Enrollment',
      desc: 'Students join subjects directly using subject join codes with instant verification against classroom rosters.',
      icon: Users,
      tag: 'Enrollment',
      color: 'amber',
    },
    {
      title: 'Real-time WebSocket Sync',
      desc: 'Live attendance feeds update immediately without page refresh as soon as students scan and verify their tokens.',
      icon: Zap,
      tag: 'Real-time',
      color: 'rose',
    },
    {
      title: 'Analytics & Audit Trail',
      desc: 'Deep subject-level attendance analytics, present vs absent distributions, and complete historical timestamps.',
      icon: BarChart3,
      tag: 'Insights',
      color: 'indigo',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Teacher Creates Class',
      desc: 'Faculty initializes academic year, section, and subjects with auto-generated join codes.',
    },
    {
      num: '02',
      title: 'Teacher Starts Session',
      desc: 'One click launches a 5-minute timed attendance window with GPS geofencing verification.',
    },
    {
      num: '03',
      title: 'QR Code Generated',
      desc: 'High-definition QR code broadcasts to classroom screen and connected student devices.',
    },
    {
      num: '04',
      title: 'Student Scans & Verifies',
      desc: 'Student camera scans QR, backend validates enrollment and signs attendance record.',
    },
    {
      num: '05',
      title: 'Live Attendance Recorded',
      desc: 'Dashboard reflects marked student instantly with complete audit logs and summary analytics.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl opacity-70" />
          <div className="w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-3xl opacity-60 ml-32 -mt-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Next-Gen Smart Attendance Platform v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Smart Attendance for <span className="text-indigo-600">Smarter Classrooms</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate manual roll calls, stop proxy attendance, and unlock live classroom verification. Fast, secure, and synchronized in real-time across your institution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              onClick={() => navigate('/auth/role')}
              size="lg"
              icon={ArrowRight}
              className="w-full sm:w-auto shadow-lg shadow-indigo-200"
            >
              Get Started Now
            </Button>
            <Button
              onClick={() => navigate('/features')}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Explore Features
            </Button>
          </div>

          {/* Quick Access Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dynamic 2-Min Tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Anti-Proxy Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Live WebSocket Feed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Card */}
          <Card
            hover
            className="p-8 border-2 border-indigo-100 hover:border-indigo-400 bg-gradient-to-b from-white to-indigo-50/20 space-y-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <Badge variant="indigo" size="sm" className="mb-2">For Faculty & Instructors</Badge>
              <h3 className="text-2xl font-bold text-slate-900">Teacher Portal</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Create subjects, manage enrolled rosters, initiate live projector attendance sessions, and export comprehensive analytics.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Button
                onClick={() => navigate('/auth/teacher/login')}
                size="md"
                className="flex-1"
              >
                Teacher Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth/teacher/register')}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                Register
              </Button>
            </div>
          </Card>

          {/* Student Card */}
          <Card
            hover
            className="p-8 border-2 border-emerald-100 hover:border-emerald-400 bg-gradient-to-b from-white to-emerald-50/20 space-y-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <Badge variant="emerald" size="sm" className="mb-2">For Enrolled Students</Badge>
              <h3 className="text-2xl font-bold text-slate-900">Student Portal</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Join classes via subject join codes, open camera scanner, verify attendance in under 3 seconds, and track attendance metrics.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Button
                onClick={() => navigate('/auth/student/login')}
                variant="success"
                size="md"
                className="flex-1"
              >
                Student Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth/student/register')}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                Register
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <Badge variant="indigo" size="sm">Engineered For Reliability</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything Required for Modern Attendance
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Built with strict security guardrails, cryptographic tokens, and role-based permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} hover className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {f.tag}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{f.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Smart Attendance Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              From classroom session start to verified attendance record in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((s, idx) => (
              <div
                key={s.num}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3 relative flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-indigo-400 font-mono">
                    {s.num}
                  </span>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl shadow-indigo-300">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your classroom attendance?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto leading-relaxed">
            Select your role and start experiencing instant, proxy-proof classroom attendance management today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/auth/role')}
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto font-bold text-indigo-700 bg-white hover:bg-indigo-50 border-0"
              icon={ArrowRight}
            >
              Choose Role & Begin
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
