import React, { useState, useEffect } from 'react';
import { emergencyService } from '../services/emergencyService';
import { adminService } from '../services/adminService';
import { referenceService } from '../services/referenceService';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import {
  Search,
  Filter,
  RefreshCw,
  Shield,
  ArrowRight,
  ShieldAlert,
  Building2,
  X,
} from 'lucide-react';

export default function AdminIncidentsPage({ onSelectIncident }) {
  const [incidents, setIncidents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Assign modal
  const [assignIncident, setAssignIncident] = useState(null);
  const [selectedResponder, setSelectedResponder] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allInc, cats, resps] = await Promise.all([
        emergencyService.getAllEmergencies(),
        referenceService.getActiveCategories(),
        adminService.getAllResponders(),
      ]);
      setIncidents(allInc || []);
      setCategories(cats || []);
      setResponders(resps || []);
      if (resps && resps.length > 0) {
        setSelectedResponder(resps[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssign = (inc) => {
    setAssignIncident(inc);
    setAssignNotes('');
    if (inc.assignedToId) {
      setSelectedResponder(inc.assignedToId);
    } else if (responders.length > 0) {
      setSelectedResponder(responders[0].id);
    }
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!selectedResponder || !assignIncident) return;
    setAssigning(true);
    try {
      await emergencyService.assignEmergency(
        assignIncident.id,
        Number(selectedResponder),
        assignNotes
      );
      setAssignIncident(null);
      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const filtered = incidents.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.reporterName && i.reporterName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (i.locationBuilding && i.locationBuilding.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || i.severity === severityFilter;
    const matchesCategory =
      categoryFilter === 'ALL' || String(i.categoryId) === String(categoryFilter);

    return matchesSearch && matchesStatus && matchesSeverity && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Incident Command Desk</h2>
          <p className="text-xs text-slate-500">
            Full oversight of all reported campus emergencies with direct officer dispatch
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incident #, title, reporter..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported (Unassigned)</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full inline-block animate-spin mb-2" />
            <p className="text-sm">Loading incident registry...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShieldAlert className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No incidents match current filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3.5 px-4">Incident #</th>
                  <th className="py-3.5 px-4">Emergency Details</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-800">
                      {item.incidentNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">
                        {item.categoryName} · By {item.reporterName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      <div>{item.locationBuilding}</div>
                      <div className="text-[11px] text-slate-400">{item.locationZone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {item.assignedToName ? (
                        <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          {item.assignedToName}
                        </span>
                      ) : (
                        <span className="text-amber-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {item.status !== 'RESOLVED' && item.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleOpenAssign(item)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-lg transition"
                          title="Assign Responder"
                        >
                          <Shield className="w-3.5 h-3.5 inline mr-1" />
                          Assign
                        </button>
                      )}
                      <button
                        onClick={() => onSelectIncident(item.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
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

      {/* Assign Modal */}
      {assignIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Assign Officer to #{assignIncident.incidentNumber}
              </h3>
              <button onClick={() => setAssignIncident(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleConfirmAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Security Responder *
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
                  Dispatch Instructions
                </label>
                <textarea
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="Notes for assigned responder..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignIncident(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
