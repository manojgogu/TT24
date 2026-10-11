import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import { Download, FileSpreadsheet, Calendar, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminExportPage() {
  const [status, setStatus] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleExport = async (e) => {
    e.preventDefault();
    setDownloading(true);
    setMessage('');
    setError('');

    try {
      const blob = await adminService.exportCsv(status || null);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      a.download = `campus_emergency_report_${status || 'ALL'}_${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setMessage('Incident report CSV generated and downloaded successfully!');
    } catch (err) {
      setError(err.message || 'Failed to generate CSV export');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Incident Reports & CSV Export</h2>
        <p className="text-xs text-slate-500">
          Export full campus emergency logs for compliance audits, security analysis, and academic evaluation
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Export Parameters</h3>
            <p className="text-xs text-slate-500">
              CSV file includes Incident Number, Title, Category, Location, Severity, Reporter, Responder, and Timestamps.
            </p>
          </div>
        </div>

        <form onSubmit={handleExport} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filter by Incident Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Incidents (Full Historical Export)</option>
              <option value="REPORTED">Reported Only</option>
              <option value="ASSIGNED">Assigned Only</option>
              <option value="IN_PROGRESS">In Progress Only</option>
              <option value="RESOLVED">Resolved Only</option>
              <option value="CANCELLED">Cancelled Only</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={downloading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {downloading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Incident CSV Report</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
          <strong className="text-slate-800 block">Audit & Compliance Note:</strong>
          <p>
            Generated exports comply with university data safety regulations. PII (phone numbers, full names) are logged for authorized administrative and emergency review purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
