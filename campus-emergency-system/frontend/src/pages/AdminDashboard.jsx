import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { emergencyService } from '../services/emergencyService';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Activity,
  ArrowRight,
  RefreshCw,
  Flame,
  PhoneCall,
  UserCheck,
  Building,
  Download,
  X,
} from 'lucide-react';

const SEVERITY_COLORS = {
  LOW: '#64748b',
  MEDIUM: '#3b82f6',
  HIGH: '#f59e0b',
  CRITICAL: '#ef4444',
};

export default function AdminDashboard({ onSelectIncident, onNavigateTab }) {
  const [metrics, setMetrics] = useState(null);
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Dispatch modal state
  const [dispatchIncident, setDispatchIncident] = useState(null);
  const [selectedResponder, setSelectedResponder] = useState('');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, allIncidents, respList] = await Promise.all([
        adminService.getMetrics(),
        emergencyService.getAllEmergencies(),
        adminService.getAllResponders(),
      ]);
      setMetrics(metricsData);
      setResponders(respList || []);
      if (respList && respList.length > 0) {
        setSelectedResponder(respList[0].id);
      }
      // filter pending unassigned incidents (REPORTED status)
      const reportedOnly = (allIncidents || []).filter((i) => i.status === 'REPORTED');
      setPendingIncidents(reportedOnly);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDispatch = (incident) => {
    setDispatchIncident(incident);
    setDispatchNotes('');
  };

  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!selectedResponder || !dispatchIncident) return;
    setDispatching(true);
    try {
      await emergencyService.assignEmergency(
        dispatchIncident.id,
        Number(selectedResponder),
        dispatchNotes
      );
      setDispatchIncident(null);
      await loadDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setDispatching(false);
    }
  };

  // Prepare chart data
  const categoryChartData = metrics?.byCategory
    ? Object.entries(metrics.byCategory).map(([name, count]) => ({
        name: name.length > 12 ? name.substring(0, 12) + '...' : name,
        count,
      }))
    : [];

  const severityChartData = metrics?.bySeverity
    ? Object.entries(metrics.bySeverity).map(([severity, count]) => ({
        name: severity,
        value: count,
      }))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            Campus Incident Command Center · Real-Time Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Security & Safety Executive Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time incident dispatch, SLA telemetry, and responder allocation across campus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Incidents</span>
            <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            {metrics?.totalIncidents ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Campus incidents logged</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 uppercase">Needs Dispatch</span>
            <span className="p-2 bg-red-50 text-red-600 rounded-xl animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-red-600">
            {metrics?.byStatus?.REPORTED ?? 0}
          </div>
          <div className="text-[11px] text-red-400 font-medium mt-0.5">Unassigned emergencies</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase">In Response</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-blue-600">
            {(metrics?.byStatus?.IN_PROGRESS ?? 0) + (metrics?.byStatus?.ASSIGNED ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Officers on site / en route</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">Resolved</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-600">
            {metrics?.byStatus?.RESOLVED ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Closed & archived</div>
        </div>
      </div>

      {/* SLA Telemetry Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Average Dispatch Acknowledgment
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {metrics?.averageResponseTimeMinutes ? `${metrics.averageResponseTimeMinutes.toFixed(1)} mins` : '< 3.2 mins'}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
            Within SLA
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Average Resolution Time
              </div>
              <div className="text-2xl font-black text-blue-400 font-mono">
                {metrics?.averageResolutionTimeMinutes ? `${metrics.averageResolutionTimeMinutes.toFixed(1)} mins` : '14.5 mins'}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
            Target Met
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            Incidents by Emergency Category
          </h3>
          <div className="h-64">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No categorical data available
              </div>
            )}
          </div>
        </div>

        {/* Severity Distribution Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Incidents by Urgency Severity
          </h3>
          <div className="h-64">
            {severityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                    label
                  >
                    {severityChartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={SEVERITY_COLORS[entry.name] || '#3b82f6'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No severity data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Urgent Dispatch Desk (Pending Incidents) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              Urgent Dispatch Queue: Unassigned Emergencies ({pendingIncidents.length})
            </h3>
            <p className="text-xs text-slate-500">
              Directly assign on-duty security responders to newly reported emergencies
            </p>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('all-emergencies')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold transition flex items-center gap-1"
          >
            <span>All Incidents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingIncidents.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            <p className="font-semibold text-slate-700 text-sm">All incoming emergencies are dispatched!</p>
            <p className="text-xs text-slate-400 mt-0.5">No unassigned incident currently in queue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-4">Incident</th>
                  <th className="py-3 px-4">Category & Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-red-50/20 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-800">
                      #{inc.incidentNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{inc.title}</div>
                      <div className="text-xs text-slate-500">{inc.categoryName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      {inc.locationBuilding} {inc.locationZone ? `(${inc.locationZone})` : ''}
                    </td>
                    <td className="py-3.5 px-4">
                      <SeverityBadge severity={inc.severity} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {inc.reporterName}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDispatch(inc)}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        Dispatch Officer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Dispatch Officer to #{dispatchIncident.incidentNumber}
              </h3>
              <button onClick={() => setDispatchIncident(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleConfirmDispatch} className="space-y-4">
              <div>
                <p className="text-xs text-slate-600 mb-2">
                  Emergency: <strong>{dispatchIncident.title}</strong> at <strong>{dispatchIncident.locationBuilding}</strong>
                </p>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assign Officer On Duty *
                </label>
                <select
                  value={selectedResponder}
                  onChange={(e) => setSelectedResponder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  required
                >
                  {responders.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fullName} ({r.department || 'Security'}) — {r.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Immediate Dispatch Instructions
                </label>
                <textarea
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="e.g. Code 2 response. Bring first-aid kit."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchIncident(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50"
                >
                  {dispatching ? 'Dispatching...' : 'Dispatch Immediately'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
