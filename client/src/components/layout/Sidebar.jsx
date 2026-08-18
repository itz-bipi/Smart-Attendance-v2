import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  PlayCircle,
  Clock,
  BarChart3,
  User,
  Settings,
  LogOut,
  QrCode,
  ScanLine,
  History,
  Camera,
  X,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { setSidebarOpen } from '../../redux/slices/uiSlice';

export const Sidebar = () => {
  const { role, user, logout } = useAuth();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teacherNavItems = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Classes', path: '/teacher/classes', icon: GraduationCap },
    { label: 'Subjects', path: '/teacher/subjects', icon: BookOpen },
    { label: 'Start Attendance', path: '/teacher/attendance/start', icon: PlayCircle },
    { label: 'Attendance Records', path: '/teacher/attendance', icon: Clock },
    { label: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
    { label: 'Profile', path: '/teacher/profile', icon: User },
    { label: 'Settings', path: '/teacher/settings', icon: Settings },
  ];

  const studentNavItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Classes', path: '/student/classes', icon: BookOpen },
    { label: 'Scan Attendance', path: '/student/scan', icon: ScanLine },
    { label: 'Attendance History', path: '/student/attendance', icon: History },
    { label: 'Analytics', path: '/student/analytics', icon: BarChart3 },
    { label: 'Face Registration', path: '/student/face-registration', icon: Camera },
    { label: 'Profile', path: '/student/profile', icon: User },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => dispatch(setSidebarOpen(false))}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-100 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 sm:h-20 px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight block">
                SmartAttend
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                {role === 'teacher' ? 'Faculty Admin' : 'Student Portal'}
              </span>
            </div>
          </div>

          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    dispatch(setSidebarOpen(false));
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Card / Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Logged In'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/auth/role');
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
