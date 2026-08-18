import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ScanLine,
  Camera,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  getMyActiveSessions,
  generateStudentAttendanceToken,
  verifyStudentAttendanceToken,
  clearAttendanceError,
} from '../../redux/slices/attendanceSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const StudentScanAttendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeStudentSessions, lastVerificationResult, loading, error } =
    useSelector((state) => state.attendance);

  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    dispatch(getMyActiveSessions());
  }, [dispatch]);

  const startScanner = async () => {
    setCameraError(null);
    setScannerActive(true);

    try {
      const qrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = qrCode;

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          console.log('QR Decoded text:', decodedText);
          handleQRDecoded(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // ignore parsing frame errors
        }
      );
    } catch (err) {
      console.warn('Camera start error:', err);
      setCameraError(
        'Camera permission was denied or no camera device found. You can verify active sessions directly using the One-Click verification button below.'
      );
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Stop scanner error:', e);
      }
    }
    setScannerActive(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const handleQRDecoded = async (qrContent) => {
    setIsVerifying(true);
    try {
      let payload;
      try {
        payload = JSON.parse(qrContent);
      } catch {
        payload = { token: qrContent };
      }

      if (payload.token) {
        await dispatch(verifyStudentAttendanceToken(payload.token));
      } else if (payload.sessionId) {
        const tokenRes = await dispatch(generateStudentAttendanceToken(payload.sessionId));
        if (generateStudentAttendanceToken.fulfilled.match(tokenRes)) {
          await dispatch(verifyStudentAttendanceToken(tokenRes.payload.token));
        }
      } else {
        await dispatch(verifyStudentAttendanceToken(qrContent));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Direct 1-Click Verification for detected active sessions (Socket/API broadcast)
  const handleDirectSessionVerify = async (session) => {
    setIsVerifying(true);
    try {
      const sessionId = session.id || session._id;
      // Step 1: Generate attendance token for this session
      const tokenRes = await dispatch(generateStudentAttendanceToken(sessionId));
      if (generateStudentAttendanceToken.fulfilled.match(tokenRes)) {
        // Step 2: Verify the attendance token
        await dispatch(verifyStudentAttendanceToken(tokenRes.payload.token));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    dispatch(clearAttendanceError());
    dispatch(getMyActiveSessions());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mobile-First Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Classroom Attendance Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Scan the projector QR code or verify active attendance directly
        </p>
      </div>

      {/* Success Result Card */}
      {lastVerificationResult?.success && (
        <Card className="p-8 text-center space-y-6 border-2 border-emerald-500 bg-emerald-50/40 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <Badge variant="emerald" size="md" className="mb-2">
              VERIFIED & RECORDED
            </Badge>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Attendance Marked Successfully!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Marked at: {new Date(lastVerificationResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 text-xs text-slate-700 space-y-2">
            <p className="font-semibold flex items-center justify-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-4 h-4" /> Cryptographically Signed & Confirmed
            </p>
            <p className="text-slate-500">
              Your attendance status is now permanently saved in institutional records.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate('/student/dashboard')}
              variant="secondary"
              className="flex-1"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate('/student/attendance')}
              variant="success"
              className="flex-1"
            >
              View Attendance Log
            </Button>
          </div>
        </Card>
      )}

      {/* Failure State Card */}
      {lastVerificationResult?.success === false && (
        <Card className="p-8 text-center space-y-6 border-2 border-rose-400 bg-rose-50/40 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-rose-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-200">
            <AlertCircle className="w-9 h-9" />
          </div>

          <div>
            <Badge variant="rose" size="md" className="mb-2">
              VERIFICATION FAILED
            </Badge>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Could Not Record Attendance
            </h3>
            <p className="text-xs text-rose-700 mt-1 font-medium">
              {lastVerificationResult.error || 'The session token was invalid or has expired.'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-rose-200 text-xs text-slate-600 text-left space-y-1.5">
            <p className="font-bold text-slate-800">Possible reasons:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>You are not actively enrolled in this subject cohort.</li>
              <li>The 5-minute teacher attendance window has ended.</li>
              <li>You are outside the permitted 100m classroom geofence.</li>
              <li>Your attendance was already submitted for this session.</li>
            </ul>
          </div>

          <Button onClick={handleReset} variant="secondary" className="w-full">
            Try Again
          </Button>
        </Card>
      )}

      {/* Normal Scanner State */}
      {!lastVerificationResult && (
        <div className="space-y-6">
          {/* Active Session Detected Quick-Card */}
          {activeStudentSessions && activeStudentSessions.length > 0 && (
            <Card className="p-6 border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/90 to-teal-50/40 space-y-4 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-2xl animate-pulse">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <Badge variant="emerald" size="sm">Active Broadcast Detected</Badge>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {activeStudentSessions[0].subject?.subjectName || 'Live Classroom Session'}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Your instructor has started attendance. Click below to verify your enrollment in 1 click:
              </p>

              <Button
                onClick={() => handleDirectSessionVerify(activeStudentSessions[0])}
                variant="success"
                size="lg"
                isLoading={isVerifying || loading}
                className="w-full font-bold shadow-md shadow-emerald-200 py-3.5"
                icon={CheckCircle2}
              >
                1-Click Verify Attendance
              </Button>
            </Card>
          )}

          {/* Camera QR Viewfinder Card */}
          <Card className="p-6 sm:p-8 space-y-6 text-center">
            <CardHeader
              title="Camera QR Scanner"
              subtitle="Point your camera at the attendance QR code displayed on the screen"
              className="text-center"
            />

            {cameraError && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left">
                {cameraError}
              </div>
            )}

            {/* Viewfinder element */}
            <div className="relative mx-auto w-full max-w-sm aspect-square bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner border-4 border-slate-800">
              {scannerActive ? (
                <>
                  <div id="qr-reader" className="w-full h-full" />
                  <div className="animate-scan-line" />
                </>
              ) : (
                <div className="space-y-3 p-6 text-slate-400">
                  <Camera className="w-12 h-12 mx-auto text-slate-500" />
                  <p className="text-xs">Camera is idle</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              {scannerActive ? (
                <Button onClick={stopScanner} variant="danger" size="md">
                  Stop Camera
                </Button>
              ) : (
                <Button
                  onClick={startScanner}
                  variant="primary"
                  size="lg"
                  icon={Camera}
                  className="w-full sm:w-auto px-8 shadow-md shadow-indigo-200 font-bold"
                >
                  Open Camera Scanner
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentScanAttendance;
