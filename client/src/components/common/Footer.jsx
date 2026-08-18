import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Shield, Zap, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                SmartAttend
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated, secure attendance verification powered by timed QR tokens, GPS radius checks, and instant Socket.IO synchronizations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/features" className="hover:text-indigo-400 transition-colors">
                  QR Attendance
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-400 transition-colors">
                  Classroom Geofencing
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-400 transition-colors">
                  Subject Management
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-400 transition-colors">
                  Live Attendance Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Access Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/auth/role" className="hover:text-indigo-400 transition-colors">
                  Teacher Login
                </Link>
              </li>
              <li>
                <Link to="/auth/role" className="hover:text-indigo-400 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/auth/role" className="hover:text-indigo-400 transition-colors">
                  New Teacher Registration
                </Link>
              </li>
              <li>
                <Link to="/auth/role" className="hover:text-indigo-400 transition-colors">
                  New Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Tech */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Security Standards
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>JWT Timed Cryptographic Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Real-time WebSocket Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>2-minute Anti-Proxy Expiry</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Smart Attendance System v2.0. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
            <span className="text-slate-600">|</span>
            <span className="text-indigo-400 font-medium">Node.js + Express + MongoDB Backend</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
