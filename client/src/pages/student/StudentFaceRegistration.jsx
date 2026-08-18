import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, ShieldCheck, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const StudentFaceRegistration = () => {
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [streamActive, setStreamActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [registered, setRegistered] = useState(user?.faceRegistered || false);
  const [descriptors, setDescriptors] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 400, height: 400 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreamActive(true);
    } catch (err) {
      alert('Camera access denied or unavailable: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  const handleCapture = () => {
    setCapturing(true);
    setTimeout(() => {
      // Simulate descriptor generation (128 floating point numbers matching standard models)
      const fakeDescriptors = Array.from({ length: 12 }, () =>
        Number((Math.random() * 2 - 1).toFixed(4))
      );
      setDescriptors(fakeDescriptors);
      setRegistered(true);
      setCapturing(false);
      stopCamera();
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Biometric Identification Module</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Face Registration & Biometrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Register facial embedding vector for enhanced anti-proxy verification
        </p>
      </div>

      {/* Main Registration Card */}
      <Card className="p-8 space-y-6 text-center">
        <div className="flex items-center justify-between">
          <CardHeader
            title="Biometric Camera Frame"
            subtitle="Position your face inside the circle with good lighting"
            className="mb-0 text-left"
          />
          <Badge variant={registered ? 'emerald' : 'amber'} size="sm" dot>
            {registered ? 'Face Registered' : 'Not Registered'}
          </Badge>
        </div>

        {/* Viewfinder Circle */}
        <div className="relative mx-auto w-64 h-64 rounded-full overflow-hidden bg-slate-900 border-4 border-emerald-500 shadow-xl flex items-center justify-center">
          {streamActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
          ) : registered ? (
            <div className="space-y-2 text-emerald-400 p-6">
              <UserCheck className="w-16 h-16 mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider">Face Verified</p>
            </div>
          ) : (
            <div className="space-y-2 text-slate-400 p-6">
              <Camera className="w-12 h-12 mx-auto text-slate-500" />
              <p className="text-xs">Camera is turned off</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!streamActive ? (
            <Button
              onClick={startCamera}
              variant="success"
              size="md"
              icon={Camera}
            >
              {registered ? 'Re-scan Face' : 'Open Front Camera'}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCapture}
                variant="success"
                size="md"
                isLoading={capturing}
                icon={CheckCircle2}
              >
                Capture & Register Face
              </Button>
              <Button onClick={stopCamera} variant="ghost" size="md">
                Cancel
              </Button>
            </>
          )}
        </div>

        {/* Descriptor Preview if captured */}
        {descriptors && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              128-Dimension Facial Embedding Vector Preview
            </span>
            <p className="font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 break-all">
              [{descriptors.join(', ')}, ...]
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentFaceRegistration;
