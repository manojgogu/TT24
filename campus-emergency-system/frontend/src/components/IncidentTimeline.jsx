import React from 'react';
import StatusBadge from './StatusBadge';
import { Clock, User } from 'lucide-react';

export default function IncidentTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="py-6 text-center text-slate-400 text-sm">
        No status update history recorded yet.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((item, idx) => {
          const isLast = idx === history.length - 1;
          const formattedDate = item.changedAt
            ? new Date(item.changedAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          return (
            <li key={item.id || idx}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center ring-4 ring-white shadow-sm">
                      <Clock className="h-4 w-4 text-slate-500" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} size="sm" />
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.changedByName || 'System'}
                        </span>
                      </div>
                      {item.remarks && (
                        <p className="mt-1 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {item.remarks}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-slate-400 font-mono">
                      {formattedDate}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
