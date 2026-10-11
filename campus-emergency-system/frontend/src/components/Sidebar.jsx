import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  AlertCircle,
  FileText,
  Shield,
  BarChart3,
  Users,
  Building,
  Download,
  PhoneCall,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export default function Sidebar({ currentTab, onSelectTab, isOpen, onClose }) {
  const { user, isAdmin, isSecurity, isStudent, isFaculty } = useAuth();

  const getMenuItems = () => {
    const items = [];

    // Dashboard item for everyone
    items.push({
      id: 'dashboard',
      label: 'Live Dashboard',
      icon: LayoutDashboard,
      roles: ['STUDENT', 'FACULTY', 'SECURITY', 'ADMIN'],
    });

    // Student / Faculty specific items
    if (isStudent || isFaculty) {
      items.push({
        id: 'report',
        label: 'Report Emergency',
        icon: AlertCircle,
        badge: 'NEW',
        roles: ['STUDENT', 'FACULTY'],
      });
      items.push({
        id: 'my-reports',
        label: 'My Incident Reports',
        icon: FileText,
        roles: ['STUDENT', 'FACULTY'],
      });
    }

    // Security Responder specific items
    if (isSecurity) {
      items.push({
        id: 'assigned-incidents',
        label: 'Assigned Incidents',
        icon: ShieldAlert,
        badge: 'ACTION',
        roles: ['SECURITY'],
      });
    }

    // Admin specific items
    if (isAdmin) {
      items.push({
        id: 'all-emergencies',
        label: 'Incident Command Desk',
        icon: FileText,
        badge: 'DISPATCH',
        roles: ['ADMIN'],
      });
      items.push({
        id: 'analytics',
        label: 'Analytics & Insights',
        icon: BarChart3,
        roles: ['ADMIN'],
      });
      items.push({
        id: 'user-management',
        label: 'User Directory',
        icon: Users,
        roles: ['ADMIN'],
      });
      items.push({
        id: 'responders-management',
        label: 'Security Responders',
        icon: UserCheck,
        roles: ['ADMIN'],
      });
      items.push({
        id: 'master-data',
        label: 'Categories & Locations',
        icon: Building,
        roles: ['ADMIN'],
      });
      items.push({
        id: 'reports-export',
        label: 'Export Incident Reports',
        icon: Download,
        roles: ['ADMIN'],
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        {/* Navigation Items */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'Administration' : isSecurity ? 'Responder Ops' : 'Campus Safety'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      item.badge === 'ACTION'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badge === 'DISPATCH'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Emergency Hotlines Widget */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-red-400">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>EMERGENCY HELPLINE</span>
          </div>
          <div className="space-y-1 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Campus Police:</span>
              <strong className="text-white font-mono">911 / ext 5555</strong>
            </div>
            <div className="flex justify-between">
              <span>Medical Clinic:</span>
              <strong className="text-white font-mono">ext 4444</strong>
            </div>
            <div className="flex justify-between">
              <span>Security Desk:</span>
              <strong className="text-white font-mono">ext 3333</strong>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
