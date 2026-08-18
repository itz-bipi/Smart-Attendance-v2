import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap, ArrowRight } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import useSocket from '../../hooks/useSocket';
import Button from '../common/Button';

export const StudentLayout = () => {
  useSocket(); // maintain real-time alerts
  const navigate = useNavigate();
  const { activeStudentSessions } = useSelector((state) => state.attendance);

  const hasActiveSession = activeStudentSessions && activeStudentSessions.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        <Header />

        {/* Global Active Attendance Notification Banner */}
        {hasActiveSession && (
          <div className="bg-indigo-600 text-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm animate-pulse-glow">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <span className="p-1 bg-white/20 rounded-lg">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              </span>
              <span>
                Live Attendance Active: You have {activeStudentSessions.length} active session waiting for verification!
              </span>
            </div>
            <Button
              onClick={() => navigate('/student/scan')}
              size="sm"
              variant="secondary"
              className="text-xs bg-white text-indigo-700 hover:bg-indigo-50 border-0 font-bold"
              icon={ArrowRight}
            >
              Scan & Mark
            </Button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
