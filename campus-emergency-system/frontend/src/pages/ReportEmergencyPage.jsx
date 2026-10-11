import React, { useState, useEffect } from 'react';
import { referenceService } from '../services/referenceService';
import { emergencyService } from '../services/emergencyService';
import {
  AlertTriangle,
  Upload,
  Building2,
  FileText,
  Send,
  AlertCircle,
  CheckCircle,
  Flame,
  X,
} from 'lucide-react';

export default function ReportEmergencyPage({ onSuccess, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    locationId: '',
    severity: 'MEDIUM',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      const [cats, locs] = await Promise.all([
        referenceService.getActiveCategories(),
        referenceService.getActiveLocations(),
      ]);
      setCategories(cats || []);
      setLocations(locs || []);
      if (cats && cats.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
      }
      if (locs && locs.length > 0) {
        setFormData((prev) => ({ ...prev, locationId: locs[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Attachment exceeds maximum limit of 10MB');
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.categoryId || !formData.locationId) {
      setError('Please fill in all mandatory fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create incident report
      const report = await emergencyService.reportEmergency({
        title: formData.title,
        description: formData.description,
        categoryId: Number(formData.categoryId),
        locationId: Number(formData.locationId),
        severity: formData.severity,
      });

      // 2. Upload file if attached
      if (selectedFile && report?.id) {
        try {
          await emergencyService.uploadAttachment(report.id, selectedFile);
        } catch (uploadErr) {
          console.warn('Incident reported, but file upload failed:', uploadErr);
        }
      }

      setSuccess(`Incident logged successfully with ID #${report.incidentNumber}!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(report.id);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit incident report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Submit Incident Report
          </h2>
          <p className="text-xs text-slate-500">
            Provide detailed observations to aid security responders
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Incident Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Incident Headline / Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Broken water pipe leaking in Main Library 2nd Floor"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Category & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-slate-500" />
              Emergency Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-500" />
              Campus Location / Building *
            </label>
            <select
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.buildingName} {loc.zone ? `(${loc.zone})` : ''} - {loc.description || 'Zone'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Perceived Severity Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Perceived Urgency / Severity Level *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { val: 'LOW', label: 'Low', desc: 'No immediate danger' },
              { val: 'MEDIUM', label: 'Medium', desc: 'Property or minor issue' },
              { val: 'HIGH', label: 'High', desc: 'Urgent attention needed' },
              { val: 'CRITICAL', label: 'Critical', desc: 'Life / safety threat' },
            ].map((sev) => {
              const isSelected = formData.severity === sev.val;
              return (
                <button
                  key={sev.val}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: sev.val })}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${
                    isSelected
                      ? sev.val === 'CRITICAL'
                        ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500 font-bold'
                        : sev.val === 'HIGH'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500 font-bold'
                        : 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-sm">{sev.label}</div>
                  <div className="text-[10px] opacity-75">{sev.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Narrative */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Incident Narrative *
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what occurred, any hazards, number of persons affected, and exact spot in building..."
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          />
        </div>

        {/* File/Photo Upload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-slate-500" />
            Photo Evidence or Document (Optional)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50/50 transition">
            {previewUrl ? (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-xl object-contain border border-slate-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : selectedFile ? (
              <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl max-w-sm mx-auto text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span className="truncate">{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-800 ml-2 font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block py-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-blue-600 font-semibold hover:underline">
                  Click to upload image or file
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  PNG, JPG, PDF up to 10MB
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Official Incident Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
