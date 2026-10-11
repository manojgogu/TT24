import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  PhoneCall,
  Clock,
  CheckCircle2,
  Users,
  Flame,
  Activity,
  ArrowRight,
  Lock,
} from 'lucide-react';

export default function LandingPage({ onNavigateLogin, onNavigateRegister, onOpenSos }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* Top Banner Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center shadow-lg shadow-red-900/50">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CampusSafety
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-900/50 text-red-300 border border-red-700/50">
                Official Safety Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSos}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-900/40 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS Alert</span>
            </button>
            <button
              onClick={onNavigateLogin}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition"
            >
              Sign In
            </button>
            <button
              onClick={onNavigateRegister}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              24/7 Rapid Emergency Response & Incident Dispatch
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Rapid Response When Every Second Counts.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Empowering students, faculty, and security personnel with instant incident reporting, real-time responder dispatch, and transparent resolution tracking across campus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenSos}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-lg shadow-2xl shadow-red-900/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 sos-glow"
              >
                <AlertTriangle className="w-6 h-6 fill-white text-red-600" />
                TRANSMIT EMERGENCY SOS
              </button>
              <button
                onClick={onNavigateLogin}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Safety Portal</span>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="p-3 bg-red-950/80 text-red-400 rounded-xl w-fit mb-4 border border-red-800/50">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">&lt; 3 Minutes</h3>
              <p className="text-sm text-slate-400">
                Average security officer response and dispatch acknowledgment across campus zones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="p-3 bg-blue-950/80 text-blue-400 rounded-xl w-fit mb-4 border border-blue-800/50">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Live Responder Dispatch</h3>
              <p className="text-sm text-slate-400">
                Real-time incident assignments to on-duty campus security officers with live tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="p-3 bg-emerald-950/80 text-emerald-400 rounded-xl w-fit mb-4 border border-emerald-800/50">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Encrypted & Audited</h3>
              <p className="text-sm text-slate-400">
                Tamper-evident audit history of all status transitions, response logs, and resolution summaries.
              </p>
            </div>
          </div>

          {/* Emergency Hotlines Emergency Bar */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-800/50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Emergency Campus Hotlines</h4>
                <p className="text-sm text-slate-400">
                  Direct phone lines monitored 24 hours a day, 7 days a week.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-center">
              <div className="px-5 py-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold">Police & Security</div>
                <div className="text-lg font-black text-red-400 font-mono">911 / ext 5555</div>
              </div>
              <div className="px-5 py-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold">Medical Center</div>
                <div className="text-lg font-black text-blue-400 font-mono">ext 4444</div>
              </div>
              <div className="px-5 py-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold">Mental Health Helpline</div>
                <div className="text-lg font-black text-emerald-400 font-mono">ext 6666</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Campus Emergency Reporting and Response Management System · Academic Project</p>
          <p className="mt-1 text-slate-600">Built with Spring Boot 3, MySQL 8, React, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
