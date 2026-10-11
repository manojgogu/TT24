import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Building, ShieldCheck, Key, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">User Profile</h2>
        <p className="text-xs text-slate-500">
          Your campus safety identity and role credentials
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl font-black text-white shadow-inner">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-extrabold">{user?.fullName}</h3>
            <p className="text-xs text-blue-200">{user?.email}</p>
            <div className="mt-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </span>
              <p className="font-bold text-slate-900">{user?.fullName}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <p className="font-bold text-slate-900 truncate">{user?.email}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Contact Phone
              </span>
              <p className="font-bold text-slate-900">{user?.phone || 'Not provided'}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Department / Hall
              </span>
              <p className="font-bold text-slate-900">{user?.department || 'Campus General'}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong className="block font-bold">Verified Institutional Account</strong>
              <span>Authenticated via JWT token authorization with role-based permissions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
