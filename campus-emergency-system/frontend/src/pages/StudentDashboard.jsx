import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import {
  AlertTriangle,
  FilePlus,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Flame,
  HeartPulse,
  PhoneCall,
  User,
} from 'lucide-react';

export default function StudentDashboard({ onOpenSos, onNavigateReport, onSelectIncident }) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyReports();
  }, []);

  const loadMyReports = async () => {
    try {
      setLoading(true);
      const data = await emergencyService.getMyReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load student reports', err);
    } finally {
      setLoading(false);
    }
  };

  const activeReports = reports.filter(
    (r) => r.status !== 'RESOLVED' && r.status !== 'CANCELLED'
  );
  const resolvedReports = reports.filter((r) => r.status === 'RESOLVED');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner & Quick Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Campus Emergency Hotline Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-sm text-slate-300">
              Department / Hall: <span className="text-white font-medium">{user?.department || 'Main Campus'}</span> · Need emergency assistance? Use the instant SOS alert below.
            </p>
          </div>

          {/* Instant Giant SOS Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenSos}
              className="w-full sm:w-auto relative group px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base shadow-2xl sos-glow sos-pulse-ring transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <AlertOctagon className="w-6 h-6 animate-pulse" />
              <span>TRANSMIT SOS ALERT</span>
            </button>
            <button
              onClick={onNavigateReport}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <FilePlus className="w-5 h-5 text-blue-400" />
              <span>Detailed Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Incident Warning Alert Banner (if any) */}
      {activeReports.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-950">
                You have {activeReports.length} Active Emergency Incident{activeReports.length > 1 ? 's' : ''} Under Review
              </h4>
              <p className="text-xs text-amber-800">
                Latest: #{activeReports[0].incidentNumber} — {activeReports[0].title}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectIncident(activeReports[0].id)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Track Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{reports.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reports Logged
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeReports.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active / In Progress
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{resolvedReports.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Successfully Resolved
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incident Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Your Incident Reports</h3>
            <p className="text-xs text-slate-500">History of safety reports logged from your account</p>
          </div>
          <button
            onClick={loadMyReports}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400">
            <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full inline-block animate-spin mb-2" />
            <p className="text-sm">Loading incident reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShieldCheck className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No incidents reported</p>
            <p className="text-xs text-slate-400 mt-1">
              You haven't reported any emergencies yet. Everything is quiet on campus!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-4">Incident #</th>
                  <th className="py-3 px-4">Category & Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reported At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reports.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-700">
                      {item.incidentNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.categoryName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {item.locationBuilding} {item.locationZone ? `(${item.locationZone})` : ''}
                    </td>
                    <td className="py-3.5 px-4">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectIncident(item.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs rounded-lg transition"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Safety Protocol Quick Cards */}
      <div className="p-6 rounded-2xl bg-slate-100/80 border border-slate-200">
        <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-red-500" />
          Campus Emergency Procedures Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">🔥 Fire Outbreak:</strong>
            Activate building fire alarm immediately. Evacuate via nearest stairs (do not use elevators) to assembly point.
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">🩹 Medical Trauma:</strong>
            Do not move the injured person unless in immediate danger. Transmit SOS and call campus clinic (ext 4444).
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">🚨 Security Incident:</strong>
            Seek safe shelter, lock doors, silence mobile devices, and log a high-priority report with your room number.
          </div>
        </div>
      </div>
    </div>
  );
}
