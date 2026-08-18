import React from 'react';
import { Shield, Sparkles, Server, Database, Code2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="indigo" size="sm">System Overview</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          About Smart Attendance System v2.0
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          A full-stack, enterprise-grade attendance solution engineered with Node.js, Express, MongoDB, Socket.IO, and React.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900">Express & Socket.IO</h4>
          <p className="text-xs text-slate-500">
            High performance event-driven backend handling instant session broadcasting and token validations.
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900">MongoDB Database</h4>
          <p className="text-xs text-slate-500">
            Robust data modeling across 7 normalized schemas with compound indexes for high concurrency.
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900">React + Redux Toolkit</h4>
          <p className="text-xs text-slate-500">
            Modern, reactive client interface with modular architecture, strict role routing, and mobile-friendly camera tools.
          </p>
        </Card>
      </div>

      <Card className="p-8 space-y-4 bg-indigo-50/40 border border-indigo-100">
        <h3 className="text-lg font-bold text-slate-900">Core Objectives</h3>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc list-inside">
          <li>Eliminate paper attendance logs and save valuable instructional lecture time.</li>
          <li>Prevent proxy check-ins using rotating cryptographic tokens with short expiry lifetimes.</li>
          <li>Provide instructors with instantaneous live visual feedback during active classroom lectures.</li>
          <li>Give students transparent access to subject enrollments, attendance percentages, and historical logs.</li>
        </ul>
      </Card>
    </div>
  );
};

export default AboutPage;
