import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { emergencyService } from '../services/emergencyService';
import { adminService } from '../services/adminService';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import IncidentTimeline from '../components/IncidentTimeline';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  User,
  Shield,
  FileCheck,
  AlertOctagon,
  MessageSquare,
  CheckCircle,
  Paperclip,
  Download,
  Check,
  Send,
  X,
} from 'lucide-react';

export default function IncidentDetailPage({ incidentId, onBack, onRefreshList }) {
  const { user, isAdmin, isSecurity } = useAuth();
  const [incident, setIncident] = useState(null);
  const [history, setHistory] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & Forms
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedResponder, setSelectedResponder] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [statusRemarks, setStatusRemarks] = useState('');

  useEffect(() => {
    if (incidentId) {
      loadIncidentData();
    }
  }, [incidentId]);

  const loadIncidentData = async () => {
    try {
      setLoading(true);
      setError('');
      const [incData, histData] = await Promise.all([
        emergencyService.getEmergencyById(incidentId),
        emergencyService.getHistory(incidentId),
      ]);
      setIncident(incData);
      setHistory(histData || []);

      if (isAdmin) {
        try {
          const respList = await adminService.getAllResponders();
          setResponders(respList || []);
          if (respList && respList.length > 0) {
            setSelectedResponder(respList[0].id);
          }
        } catch {
          // ignore responder load fail
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load incident details');
    } finally {
      setLoading(false);
    }
  };

  // Status transitions
  const handleAcknowledge = async () => {
    try {
      await emergencyService.updateStatus(incidentId, 'ACKNOWLEDGED', 'Incident response acknowledged by responder');
      await loadIncidentData();
      if (onRefreshList) onRefreshList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStartResponse = async () => {
    try {
      await emergencyService.updateStatus(incidentId, 'IN_PROGRESS', 'Responder on site; actively managing incident');
      await loadIncidentData();
      if (onRefreshList) onRefreshList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResponder) return;
    try {
      await emergencyService.assignEmergency(incidentId, Number(selectedResponder), assignNotes);
      setIsAssignModalOpen(false);
      setAssignNotes('');
      await loadIncidentData();
      if (onRefreshList) onRefreshList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionSummary.trim()) {
      alert('Please provide a resolution summary');
      return;
    }
    try {
      await emergencyService.resolveEmergency(incidentId, resolutionSummary.trim());
      setIsResolveModalOpen(false);
      setResolutionSummary('');
      await loadIncidentData();
      if (onRefreshList) onRefreshList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCustomStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await emergencyService.updateStatus(incidentId, newStatus, statusRemarks);
      setIsStatusModalOpen(false);
      setStatusRemarks('');
      await loadIncidentData();
      if (onRefreshList) onRefreshList();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <span className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full inline-block animate-spin mb-3" />
        <p className="font-semibold text-slate-700">Loading incident information...</p>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200">
          {error || 'Incident not found'}
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Back to List
        </button>
      </div>
    );
  }

  const isAssignedToMe = isSecurity && incident.assignedToId === user?.id;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Incidents</span>
        </button>

        {/* Action Controls for Admin & Responder */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Responder actions */}
          {incident.status === 'ASSIGNED' && (isSecurity || isAdmin) && (
            <button
              onClick={handleAcknowledge}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Acknowledge Assignment</span>
            </button>
          )}

          {incident.status === 'ACKNOWLEDGED' && (isSecurity || isAdmin) && (
            <button
              onClick={handleStartResponse}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Start Response (In Progress)</span>
            </button>
          )}

          {incident.status === 'IN_PROGRESS' && (isSecurity || isAdmin) && (
            <button
              onClick={() => setIsResolveModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Resolve Incident</span>
            </button>
          )}

          {/* Admin Assign Button */}
          {isAdmin && incident.status !== 'RESOLVED' && incident.status !== 'CANCELLED' && (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>{incident.assignedToId ? 'Reassign Officer' : 'Assign Officer'}</span>
            </button>
          )}

          {/* Direct Status Control for Admin */}
          {isAdmin && (
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Change Status
            </button>
          )}
        </div>
      </div>

      {/* Main Incident Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-extrabold tracking-wider px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white">
                #{incident.incidentNumber}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {incident.categoryName}
              </span>
              <SeverityBadge severity={incident.severity} size="lg" />
              <StatusBadge status={incident.status} size="lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {incident.title}
            </h1>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1">
            <div>Reported at</div>
            <div className="text-sm font-bold text-white font-mono">
              {new Date(incident.createdAt).toLocaleString([], {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </div>
        </div>

        {/* Body Info Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Narrative & Evidence (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Incident Description & Observations
              </h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {incident.description}
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                Attachments & Evidence ({incident.attachments ? incident.attachments.length : 0})
              </h3>
              {incident.attachments && incident.attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {incident.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 shadow-sm"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-700 truncate">
                          {att.fileName}
                        </span>
                      </div>
                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:bg-slate-100 rounded text-blue-600 hover:text-blue-700"
                        title="Download or view"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No files attached to this incident.</p>
              )}
            </div>

            {/* Resolution Report (if present) */}
            {incident.resolutionSummary && (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  Official Resolution Summary
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  {incident.resolutionSummary}
                </p>
                <div className="pt-1 text-[11px] text-emerald-700 font-mono">
                  Resolved by {incident.assignedToName || 'Campus Responder'} at{' '}
                  {incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            )}
          </div>

          {/* Right: Meta & Logistics (1 Col) */}
          <div className="space-y-6">
            {/* Location Logistics */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Location Logistics
              </h4>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400">Building: </span>
                  <strong className="text-slate-900">{incident.locationBuilding}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Campus Zone: </span>
                  <strong className="text-slate-900">{incident.locationZone || 'Main Zone'}</strong>
                </div>
              </div>
            </div>

            {/* Assigned Responder */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-600" />
                Assigned Responder
              </h4>
              {incident.assignedToName ? (
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-900">{incident.assignedToName}</div>
                  <div className="text-slate-500">{incident.assignedToEmail}</div>
                  {incident.assignedToPhone && (
                    <div className="text-slate-500">Phone: {incident.assignedToPhone}</div>
                  )}
                  {incident.assignments && incident.assignments.length > 0 && incident.assignments[0].notes && (
                    <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 text-slate-600 text-[11px]">
                      <strong>Dispatch Notes:</strong> {incident.assignments[0].notes}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No responder assigned yet.</p>
              )}
            </div>

            {/* Reporting Party */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                Reporting Party
              </h4>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900">{incident.reporterName}</div>
                <div className="text-slate-500">{incident.reporterEmail}</div>
                {incident.reporterPhone && (
                  <div className="text-slate-500">Phone: {incident.reporterPhone}</div>
                )}
                {incident.reporterDepartment && (
                  <div className="text-slate-500">Dept: {incident.reporterDepartment}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log & Status History Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-500" />
          Incident Progression & Status Timeline Audit Trail
        </h3>
        <IncidentTimeline history={history} />
      </div>

      {/* Modal: Assign Responder */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Assign Security Responder</h3>
              <button onClick={() => setIsAssignModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Officer *
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
                  Dispatch Instructions (Optional)
                </label>
                <textarea
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="e.g. Inspect fire extinguisher in hallway, report perimeter status."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolve Incident */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Resolve Incident #{incident.incidentNumber}
              </h3>
              <button onClick={() => setIsResolveModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Resolution Summary & Action Taken *
                </label>
                <textarea
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Detail the actions taken: e.g. First aid administered, premises secured, facility team repaired pipe valve."
                  rows={4}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Submit & Resolve Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Status (Admin) */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Change Status Manually</h3>
              <button onClick={() => setIsStatusModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCustomStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                >
                  <option value="REPORTED">Reported</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="ACKNOWLEDGED">Acknowledged</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status Remarks *
                </label>
                <textarea
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="Reason for manual status change..."
                  rows={2}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
