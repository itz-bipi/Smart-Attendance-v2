import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlayCircle,
  MapPin,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  RefreshCw,
  QrCode,
  Radio,
} from 'lucide-react';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import { startAttendanceSession } from '../../redux/slices/attendanceSlice';
import useGeolocation from '../../hooks/useGeolocation';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const TeacherStartAttendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subjects, loading: subjectsLoading } = useSelector((state) => state.subjects);
  const { loading: startingLoading, error: attendanceError } = useSelector(
    (state) => state.attendance
  );

  const { location, loading: geoLoading, error: geoError, getLocation } = useGeolocation();

  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('projector_qr');

  useEffect(() => {
    dispatch(fetchSubjects());
    getLocation(); // acquire classroom coordinates on load
  }, [dispatch, getLocation]);

  const selectedSubject = subjects.find(
    (s) => s.id === selectedSubjectId || s._id === selectedSubjectId
  );

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId) return;

    let coords = location;
    if (!coords) {
      coords = await getLocation();
    }

    const payload = {
      subjectId: selectedSubjectId,
      latitude: coords?.latitude || 28.6139,
      longitude: coords?.longitude || 77.2090,
    };

    const res = await dispatch(startAttendanceSession(payload));
    if (startAttendanceSession.fulfilled.match(res)) {
      const sessionId = res.payload.id || res.payload._id;
      navigate(`/teacher/attendance/session/${sessionId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Classroom Session</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Start Attendance Session
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Create a 5-minute timed attendance window with dynamic QR broadcasting and geofencing.
        </p>
      </div>

      {attendanceError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-700 font-medium flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Cannot Start Session</p>
            <p className="mt-0.5 text-xs text-rose-600">{attendanceError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleStartSession} className="space-y-6">
        {/* Step 1: Subject Selection */}
        <Card className="p-6 space-y-5">
          <CardHeader
            title="1. Select Subject & Class"
            subtitle="Choose the subject cohort for which you are taking attendance"
          />

          {subjects.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No subjects available. Please create a subject first.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => {
                const subId = sub.id || sub._id;
                const isSelected = selectedSubjectId === subId;
                const classObj = sub.class || {};

                return (
                  <div
                    key={subId}
                    onClick={() => setSelectedSubjectId(subId)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={isSelected ? 'indigo' : 'slate'} size="sm">
                        {sub.subjectCode}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Join: {sub.joinCode}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{sub.subjectName}</h4>
                    <p className="text-xs text-slate-500">
                      {classObj.className ? `${classObj.className} (Yr ${classObj.year} • Sec ${classObj.section})` : 'Assigned Class'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Step 2: Attendance Mode Selection */}
        <Card className="p-6 space-y-5">
          <CardHeader
            title="2. Verification Mode"
            subtitle="Choose how students will mark their attendance"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedMethod('projector_qr')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                selectedMethod === 'projector_qr'
                  ? 'border-indigo-600 bg-indigo-50/40'
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Projector QR Code</h4>
                  <p className="text-[11px] text-slate-500">Displays on classroom smartboard</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedMethod('socket_broadcast')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                selectedMethod === 'socket_broadcast'
                  ? 'border-indigo-600 bg-indigo-50/40'
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Direct Broadcast + QR</h4>
                  <p className="text-[11px] text-slate-500">Auto-sends tokens via WebSocket</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 3: Location Coordinates */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <CardHeader
              title="3. Classroom GPS Location"
              subtitle="Geofence ensures students are physically inside the classroom"
              className="mb-0"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              isLoading={geoLoading}
              onClick={getLocation}
            >
              Refresh GPS
            </Button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {location ? (
                    <>Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}</>
                  ) : (
                    'Acquiring coordinates...'
                  )}
                </p>
                <p className="text-[11px] text-slate-500">
                  Allowed Radius: 100 meters
                </p>
              </div>
            </div>

            <Badge variant="emerald" size="sm" dot>
              GPS Ready
            </Badge>
          </div>
        </Card>

        {/* Launch Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            isLoading={startingLoading}
            disabled={!selectedSubjectId || subjects.length === 0}
            className="w-full shadow-lg shadow-indigo-200 text-base font-bold py-4"
            icon={PlayCircle}
          >
            Launch Attendance Session & Display QR
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeacherStartAttendance;
