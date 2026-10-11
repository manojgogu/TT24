import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileCheck,
  Building2,
  RefreshCw,
  ArrowRight,
  Flame,
  Check,
  X,
} from 'lucide-react';

export default function ResponderDashboard({ onSelectIncident }) {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Resolve modal state
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [submittingResolve, setSubmittingResolve] = useState(false);

  useEffect(() => {
    loadAssignedIncidents();
  }, []);

  const loadAssignedIncidents = async () => {
    try {
      setLoading(true);
      const data = await emergencyService.getAssignedToMe();
      setIncidents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await emergencyService.updateStatus(id, 'ACKNOWLEDGED', 'Incident response acknowledged by officer on duty');
      await loadAssignedIncidents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStartResponse = async (id) => {
    try {
      await emergencyService.updateStatus(id, 'IN_PROGRESS', 'Officer on site; immediate emergency response actively underway');
      await loadAssignedIncidents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenResolve = (id) => {
    setResolvingId(id);
    setResolutionSummary('');
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!resolutionSummary.trim()) {
      alert('Please enter a resolution summary');
      return;
    }
    setSubmittingResolve(true);
    try {
      await emergencyService.resolveEmergency(resolvingId, resolutionSummary.trim());
      setResolvingId(null);
      await loadAssignedIncidents();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingResolve(false);
    }
  };

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CANCELLED'
  );
  const pendingAck = incidents.filter((i) => i.status === 'ASSIGNED');
  const inProgress = incidents.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ACKNOWLEDGED');
  const resolved = incidents.filter((i) => i.status === 'RESOLVED');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Officer Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Security Response Ops Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Officer {user?.fullName || 'Responder'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Assigned Department: <strong className="text-white">{user?.department || 'Campus Security Dispatch'}</strong> · Status: <span className="text-emerald-400 font-bold">ON DUTY</span>
          </p>
        </div>
        <button
          onClick={loadAssignedIncidents}
          className="self-start md:self-auto px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow flex items-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Action Required</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600">{pendingAck.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting your acknowledgment</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Under Response</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Send className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-600">{inProgress.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Currently being resolved</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Resolved by You</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600">{resolved.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Closed incidents</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Assigned</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600">{incidents.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cumulative lifetime assignments</div>
        </div>
      </div>

      {/* Active Incidents Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            Active Emergency Queue ({activeIncidents.length})
          </h3>
          <span className="text-xs text-slate-400">Sorted by urgency</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full inline-block animate-spin mb-2" />
            <p className="text-sm">Loading assigned incidents...</p>
          </div>
        ) : activeIncidents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
            <p className="font-semibold text-slate-700 text-sm">All clear! No pending active incidents.</p>
            <p className="text-xs text-slate-400 mt-1">
              You have handled all emergency assignments. Stand by for future alerts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      #{inc.incidentNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {inc.categoryName}
                    </span>
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Reported: {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">{inc.title}</h4>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{inc.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>
                      {inc.locationBuilding} {inc.locationZone ? `(${inc.locationZone})` : ''}
                    </span>
                  </div>
                  <div>
                    Reporter: <strong className="text-slate-800">{inc.reporterName}</strong> ({inc.reporterPhone || 'No phone'})
                  </div>
                </div>

                {/* Direct Action Workflow Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => onSelectIncident(inc.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold transition flex items-center gap-1"
                  >
                    <span>View Full Log & Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {inc.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleAcknowledge(inc.id)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {inc.status === 'ACKNOWLEDGED' && (
                      <button
                        onClick={() => handleStartResponse(inc.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Start Response</span>
                      </button>
                    )}

                    {inc.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleOpenResolve(inc.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Resolve Modal */}
      {resolvingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Submit Incident Resolution
              </h3>
              <button onClick={() => setResolvingId(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleConfirmResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Actions Taken & Incident Resolution Summary *
                </label>
                <textarea
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Detail all measures executed on campus to resolve the emergency..."
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingId(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingResolve}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingResolve ? 'Saving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
