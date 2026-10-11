import React, { useState, useEffect } from 'react';
import { referenceService } from '../services/referenceService';
import { Building, Flame, Plus, Check, RefreshCw } from 'lucide-react';

export default function AdminMasterDataPage() {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category Form
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryUrgency, setCategoryUrgency] = useState('HIGH');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // New Location Form
  const [locBuilding, setLocBuilding] = useState('');
  const [locZone, setLocZone] = useState('');
  const [locDesc, setLocDesc] = useState('');
  const [creatingLocation, setCreatingLocation] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, locs] = await Promise.all([
        referenceService.getAllCategories(),
        referenceService.getAllLocations(),
      ]);
      setCategories(cats || []);
      setLocations(locs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;
    setCreatingCategory(true);
    try {
      await referenceService.createCategory({
        name: categoryName,
        description: categoryDesc,
        defaultUrgency: categoryUrgency,
      });
      setCategoryName('');
      setCategoryDesc('');
      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!locBuilding) return;
    setCreatingLocation(true);
    try {
      await referenceService.createLocation({
        buildingName: locBuilding,
        zone: locZone,
        description: locDesc,
      });
      setLocBuilding('');
      setLocZone('');
      setLocDesc('');
      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingLocation(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Categories & Campus Locations</h2>
          <p className="text-xs text-slate-500">
            Maintain emergency categories and authorized campus building locations
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Emergency Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'locations'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Campus Buildings & Zones ({locations.length})</span>
        </button>
      </div>

      {activeTab === 'categories' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b font-bold text-xs uppercase tracking-wider text-slate-600">
              Active Emergency Categories
            </div>
            <div className="divide-y divide-slate-100">
              {categories.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                    <p className="text-xs text-slate-500">{c.description || 'Standard Category'}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-200">
                    {c.defaultUrgency || 'HIGH'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Add Category
            </h4>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Name *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Hazardous Spill"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  placeholder="Details..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Default Urgency</label>
                <select
                  value={categoryUrgency}
                  onChange={(e) => setCategoryUrgency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={creatingCategory}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow text-xs"
              >
                {creatingCategory ? 'Saving...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b font-bold text-xs uppercase tracking-wider text-slate-600">
              Campus Locations
            </div>
            <div className="divide-y divide-slate-100">
              {locations.map((loc) => (
                <div key={loc.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{loc.buildingName}</h4>
                    <p className="text-xs text-slate-500">{loc.description || 'Campus Facility'}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
                    {loc.zone || 'Main Zone'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Add Building / Location
            </h4>
            <form onSubmit={handleAddLocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Building Name *</label>
                <input
                  type="text"
                  value={locBuilding}
                  onChange={(e) => setLocBuilding(e.target.value)}
                  placeholder="e.g. Student Center Complex"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Zone / Sector</label>
                <input
                  type="text"
                  value={locZone}
                  onChange={(e) => setLocZone(e.target.value)}
                  placeholder="e.g. South Sector"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description / Landmarks</label>
                <textarea
                  value={locDesc}
                  onChange={(e) => setLocDesc(e.target.value)}
                  placeholder="Nearby landmarks or floors..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={creatingLocation}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow text-xs"
              >
                {creatingLocation ? 'Saving...' : 'Add Building'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
