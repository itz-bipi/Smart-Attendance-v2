import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import {
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  StopCircle,
  Maximize2,
  Minimize2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  closeAttendanceSession,
  clearClosedSessionSummary,
} from '../../redux/slices/attendanceSlice';
import { fetchSubjectEnrollments } from '../../redux/slices/enrollmentSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export const TeacherLiveSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeTeacherSession, liveAttendees, closedSessionSummary, loading } =
    useSelector((state) => state.attendance);
  const { subjectEnrollments } = useSelector((state) => state.enrollments);
  const { subjects } = useSelector((state) => state.subjects);

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [isConfirmEndOpen, setIsConfirmEndOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Subject and class metadata
  const currentSession = activeTeacherSession;
  const currentSubjectId = currentSession?.subjectId;
  const subjectObj = subjects.find(
    (s) => (s.id || s._id) === currentSubjectId
  );

  useEffect(() => {
    if (subjects.length === 0) {
      dispatch(fetchSubjects());
    }
    if (currentSubjectId) {
      dispatch(fetchSubjectEnrollments(currentSubjectId));
    }
  }, [currentSubjectId, dispatch, subjects.length]);

  // Real-time Countdown Timer calculation
  useEffect(() => {
    if (!currentSession?.expiresAt) return;

    const interval = setInterval(() => {
      const remainingMs = new Date(currentSession.expiresAt).getTime() - Date.now();
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeft(remainingSec);

      if (remainingSec === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession?.expiresAt]);

  // Format time mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // QR Code Payload structure
  const qrPayload = useMemo(() => {
    return JSON.stringify({
      type: 'SMART_ATTENDANCE_V2',
      sessionId: sessionId || currentSession?.id || currentSession?._id,
      sessionCode: currentSession?.sessionCode,
      subjectId: currentSubjectId,
      expiresAt: currentSession?.expiresAt,
    });
  }, [sessionId, currentSession, currentSubjectId]);

  const totalEnrolled = subjectEnrollments?.length || 0;
  const presentCount = liveAttendees?.length || 0;
  const attendanceRate =
    totalEnrolled > 0 ? Math.round((presentCount / totalEnrolled) * 100) : 100;

  const handleEndSession = async () => {
    setIsConfirmEndOpen(false);
    await dispatch(closeAttendanceSession(sessionId || currentSession?.id));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Projector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <Badge variant="emerald" size="sm">LIVE ATTENDANCE IN PROGRESS</Badge>
            <span className="text-xs text-slate-400 font-mono">
              Code: #{currentSession?.sessionCode || 'ACTIVE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {subjectObj?.subjectName || 'Classroom Attendance'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {subjectObj?.subjectCode ? `Subject: ${subjectObj.subjectCode}` : ''} • Allowed Distance: {currentSession?.allowedRadius || 100}m
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            icon={isFullscreen ? Minimize2 : Maximize2}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Projector View'}
          </Button>

          <Button
            onClick={() => setIsConfirmEndOpen(true)}
            variant="danger"
            size="md"
            icon={StopCircle}
          >
            End Session
          </Button>
        </div>
      </div>

      {/* Main Classroom Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Huge High-Resolution QR Display */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <Card className="p-8 sm:p-12 w-full flex flex-col items-center justify-center text-center space-y-6 border-2 border-indigo-100 shadow-2xl shadow-indigo-100/50 bg-white">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Scan with Student Portal
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Point Camera at QR Code
              </h3>
            </div>

            {/* High Contrast QR Code Container */}
            <div className="p-6 bg-white rounded-3xl border-4 border-slate-900 shadow-inner inline-block">
              <QRCodeSVG
                value={qrPayload}
                size={280}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Instructions */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Geofence Protected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Anti-Proxy 2m Token</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Statistics & Newly Marked Attendee Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live 5-Minute Timer Card */}
          <Card className="p-6 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  Time Remaining
                </span>
              </div>
              <Badge variant="amber" size="sm">
                5-Min Expiry
              </Badge>
            </div>

            <div className="text-center py-2">
              <span className={`text-6xl font-black font-mono tracking-tight ${timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
              <p className="text-xs text-indigo-300 mt-2 font-medium">
                Session automatically closes when timer reaches 00:00
              </p>
            </div>
          </Card>

          {/* Real-time Attendees Counter */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Present
              </span>
              <h4 className="text-3xl font-black text-emerald-600 mt-1">
                {presentCount}
              </h4>
            </Card>

            <Card className="p-5 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Enrolled
              </span>
              <h4 className="text-3xl font-black text-slate-900 mt-1">
                {totalEnrolled}
              </h4>
            </Card>
          </div>

          {/* Live Student Feed */}
          <Card className="p-6 space-y-4">
            <CardHeader
              title="Live Student Check-Ins"
              subtitle="Real-time WebSocket attendee log"
              action={
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </span>
              }
            />

            {liveAttendees.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2 border border-dashed border-slate-100 rounded-2xl">
                <Users className="w-6 h-6 mx-auto text-slate-300" />
                <p>Waiting for students to scan QR...</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 divide-y divide-slate-50">
                {liveAttendees.map((att, idx) => (
                  <div
                    key={att.id || att.studentId || idx}
                    className="pt-2 flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-150"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{att.name || 'Verified Student'}</p>
                        <p className="text-[10px] text-slate-400">{att.rollNo || 'Enrolled'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(att.markedAt || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation Modal to End Session */}
      <Modal
        isOpen={isConfirmEndOpen}
        onClose={() => setIsConfirmEndOpen(false)}
        title="End Attendance Session?"
        subtitle="Confirm closing active attendance window"
      >
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">This will stop student check-ins immediately.</p>
              <p className="mt-1">
                The session will be marked CLOSED and a final summary report will be generated.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsConfirmEndOpen(false)}
            >
              Keep Session Open
            </Button>
            <Button
              variant="danger"
              isLoading={loading}
              onClick={handleEndSession}
              icon={StopCircle}
            >
              Confirm & End Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* Session Summary Dialog after Closing */}
      <Modal
        isOpen={!!closedSessionSummary}
        onClose={() => {
          dispatch(clearClosedSessionSummary());
          navigate('/teacher/dashboard');
        }}
        title="Session Summary Report"
        subtitle="Attendance session concluded successfully"
      >
        <div className="space-y-6 text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <Badge variant="emerald" size="sm" className="mb-2">Session Completed</Badge>
            <h3 className="text-xl font-extrabold text-slate-900">
              {subjectObj?.subjectName || 'Attendance Recorded'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Closed at: {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Total Roster
              </span>
              <span className="text-xl font-black text-slate-900">
                {totalEnrolled}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Present
              </span>
              <span className="text-xl font-black text-emerald-600">
                {presentCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Turnout
              </span>
              <span className="text-xl font-black text-indigo-600">
                {attendanceRate}%
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              onClick={() => {
                dispatch(clearClosedSessionSummary());
                navigate('/teacher/attendance');
              }}
              variant="secondary"
              className="flex-1"
            >
              View Records
            </Button>
            <Button
              onClick={() => {
                dispatch(clearClosedSessionSummary());
                navigate('/teacher/dashboard');
              }}
              className="flex-1"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherLiveSession;
