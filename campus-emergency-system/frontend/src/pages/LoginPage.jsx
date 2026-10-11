import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage({ onNavigateRegister, onNavigateLanding }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const DEMO_USERS = [
    { label: 'Admin', email: 'admin@campus.edu', pass: 'Admin@123', role: 'ADMIN', color: 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900' },
    { label: 'Officer John', email: 'officer.john@campus.edu', pass: 'Officer@123', role: 'SECURITY', color: 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900' },
    { label: 'Officer Sarah', email: 'officer.sarah@campus.edu', pass: 'Officer@123', role: 'SECURITY', color: 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900' },
    { label: 'Student Alex', email: 'student.alex@campus.edu', pass: 'Student@123', role: 'STUDENT', color: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900' },
    { label: 'Faculty Sharma', email: 'faculty.sharma@campus.edu', pass: 'Faculty@123', role: 'FACULTY', color: 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900' },
  ];

  const handleQuickLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Navigation is handled automatically via AuthContext state in App.jsx
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={onNavigateLanding}
          className="inline-flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center shadow-xl shadow-red-900/60 group-hover:scale-105 transition">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            CampusSafety
          </span>
        </button>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Sign In to Safety Operations
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Enter your institutional credentials or choose a quick demo role below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-8">
          {/* Quick Demo Accounts Selection */}
          <div className="mb-6 pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                1-Click Evaluator Fast Login
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleQuickLogin(demo)}
                  className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${demo.color}`}
                >
                  <div>{demo.label}</div>
                  <div className="text-[10px] opacity-75 font-mono">{demo.role}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-sm text-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Don't have an account yet? </span>
            <button
              onClick={onNavigateRegister}
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
