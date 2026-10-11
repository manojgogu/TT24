import React, { useState, useEffect } from 'react';
import { X, AlertOctagon, Flame, ShieldAlert, HeartPulse, Building2, Send } from 'lucide-react';
import { referenceService } from '../services/referenceService';
import { emergencyService } from '../services/emergencyService';

export default function SosModal({ isOpen, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadReferenceData();
      setError('');
      setDescription('');
    }
  }, [isOpen]);

  const loadReferenceData = async () => {
    try {
      const [cats, locs] = await Promise.all([
        referenceService.getActiveCategories(),
        referenceService.getActiveLocations(),
      ]);
      setCategories(cats || []);
      setLocations(locs || []);
      if (cats && cats.length > 0) {
        // default to first or Medical/Fire if exists
        const highUrgency = cats.find(c => c.name.toLowerCase().includes('fire') || c.name.toLowerCase().includes('medical')) || cats[0];
        setSelectedCategory(highUrgency.id);
      }
      if (locs && locs.length > 0) {
        setSelectedLocation(locs[0].id);
      }
    } catch (err) {
      console.error('Failed to load reference data', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedLocation) {
      setError('Please select both a category and your current location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: `SOS Emergency Alert - ${categories.find(c => c.id === Number(selectedCategory))?.name || 'Urgent'}`,
        description: description.trim() || 'Immediate assistance requested via Emergency SOS button.',
        categoryId: Number(selectedCategory),
        locationId: Number(selectedLocation),
        severity: 'CRITICAL',
      };

      const result = await emergencyService.reportEmergency(payload);
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to transmit SOS emergency alert');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Red Header Alert Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner animate-pulse">
              <AlertOctagon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight font-sans">
                EMERGENCY SOS ALERT
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Campus Security & Responders will be alerted instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Quick Category Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Emergency Type *
            </label>
            <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
              {categories.map((cat) => {
                const isSelected = Number(selectedCategory) === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 text-left rounded-xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50 text-red-900 shadow-sm ring-2 ring-red-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50/40'
                    }`}
                  >
                    <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                      <Flame className="w-4 h-4" />
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-500" />
              Your Campus Location *
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition"
              required
            >
              <option value="">-- Choose Building / Location --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.buildingName} {loc.zone ? `(${loc.zone})` : ''} - {loc.description || 'Main Area'}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Specifics */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Specific Details (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Room 304, 3rd floor. Person unconscious or visible smoke."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-base shadow-lg hover:from-red-700 hover:to-rose-700 focus:ring-4 focus:ring-red-300 transition-all flex items-center justify-center gap-2 sos-glow disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Transmitting SOS Alert...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  TRANSMIT EMERGENCY SOS NOW
                </>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              For life-threatening situations, also contact campus police line at <strong>911 / 100</strong> immediately.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
