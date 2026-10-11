import React from 'react';

const STATUS_CONFIG = {
  REPORTED: {
    label: 'Reported',
    bg: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500 animate-ping',
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  ACKNOWLEDGED: {
    label: 'Acknowledged',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500 animate-pulse',
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  };

  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {config.dot.includes('ping') && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            config.dot.replace(' animate-ping', '').replace(' animate-pulse', '')
          }`}
        />
      </span>
      {config.label}
    </span>
  );
}
