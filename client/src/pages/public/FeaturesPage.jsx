import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Shield,
  Clock,
  MapPin,
  Users,
  BarChart,
  CheckCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const FeaturesPage = () => {
  const navigate = useNavigate();

  const featureSections = [
    {
      title: 'Dynamic QR Engine',
      description:
        'Designed specifically for classroom projectors and smart screens. The system generates high-contrast QR codes with 5-minute session timeouts and individual 2-minute student cryptographic tokens to prevent token sharing.',
      icon: QrCode,
      points: [
        'Automatic 5-minute session expiration',
        'Unique 2-minute signed attendance JWT tokens',
        'Direct WebSocket broadcast to enrolled students',
        'Instant live attendee visual confirmation',
      ],
    },
    {
      title: 'Geofenced Location Verification',
      description:
        'Prevents remote off-campus proxy attendance. The teacher captures their classroom GPS coordinates at session launch, allowing radius-validated check-ins.',
      icon: MapPin,
      points: [
        'Browser-based high precision GPS coordinates',
        '100-meter configurable classroom radius',
        'Transparent coordinate validation on backend',
        'Automatic classroom radius fallback',
      ],
    },
    {
      title: 'Class & Subject Management',
      description:
        'Structured around real collegiate hierarchies. Instructors manage academic years, sections, and subjects with automated join codes.',
      icon: Users,
      points: [
        'Compound uniqueness indexing on classes',
        '8-character cryptographic Subject Join Codes',
        'Student self-enrollment workflow',
        'Faculty-controlled enrollment active status toggle',
      ],
    },
    {
      title: 'Real-time WebSocket Synchronization',
      description:
        'Powered by Socket.IO with cookie-authenticated handshakes. When a faculty member initiates attendance, connected students receive instantaneous alerts.',
      icon: Zap,
      points: [
        'Instant room-based session broadcasting',
        'Zero page refreshes required during active sessions',
        'Automatic reconnection and fallback polling',
        'Secure token exchange directly over WebSocket stream',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="indigo" size="sm">Architecture & Capabilities</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Engineered for Security, Speed, and Scale
        </h1>
        <p className="text-base text-slate-500 leading-relaxed">
          Discover how Smart Attendance System v2.0 solves institutional attendance challenges with verified cryptographic models.
        </p>
      </div>

      {/* Feature Deep Dive Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featureSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Card key={sec.title} className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{sec.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                {sec.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold">Experience the workflow live</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Sign in as Teacher to start an attendance session or as Student to join and scan.
        </p>
        <Button
          onClick={() => navigate('/auth/role')}
          size="lg"
          variant="primary"
          icon={ArrowRight}
        >
          Select Role & Continue
        </Button>
      </div>
    </div>
  );
};

export default FeaturesPage;
