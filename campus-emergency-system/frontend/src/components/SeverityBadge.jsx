import React from 'react';
import { AlertTriangle, AlertCircle, Info, Flame } from 'lucide-react';

const SEVERITY_CONFIG = {
  LOW: {
    label: 'Low Urgency',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Info,
  },
  MEDIUM: {
    label: 'Medium Urgency',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: AlertCircle,
  },
  HIGH: {
    label: 'High Priority',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: AlertTriangle,
  },
  CRITICAL: {
    label: 'CRITICAL',
    bg: 'bg-red-50 text-red-700 border-red-300 font-bold',
    icon: Flame,
  },
};

export default function SeverityBadge({ severity, size = 'sm' }) {
  const config = SEVERITY_CONFIG[severity] || {
    label: severity || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Info,
  };

  const Icon = config.icon;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md border ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
}
