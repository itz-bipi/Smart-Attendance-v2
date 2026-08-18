import React, { useState } from 'react';
import { Settings, Bell, Shield, LogOut, Check } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';

export const StudentSettings = () => {
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const [autoCamera, setAutoCamera] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize scan notifications, biometric options, and device security
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated successfully</span>
        </div>
      )}

      {/* General Settings */}
      <Card className="p-6 space-y-5">
        <CardHeader
          title="Attendance & Scanner Alerts"
          subtitle="Notification preferences for classroom sessions"
        />

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div>
              <p className="font-bold text-slate-900">Instant Broadcast Alerts</p>
              <p className="text-xs text-slate-500">
                Receive real-time banners whenever your teacher starts attendance
              </p>
            </div>
            <input
              type="checkbox"
              checked={sessionAlerts}
              onChange={(e) => setSessionAlerts(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div>
              <p className="font-bold text-slate-900">Auto-Launch Camera on Scan Page</p>
              <p className="text-xs text-slate-500">
                Instantly turn on environment camera when navigating to QR scanner
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoCamera}
              onChange={(e) => setAutoCamera(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} variant="success" size="sm">
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6 space-y-4 border-rose-100 bg-rose-50/20">
        <CardHeader
          title="Session & Logout"
          subtitle="End your student portal session on this device"
        />

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs font-bold text-slate-800">Sign Out</p>
            <p className="text-[11px] text-slate-500">Clears student authorization cookies</p>
          </div>
          <Button onClick={logout} variant="danger" size="sm" icon={LogOut}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StudentSettings;
