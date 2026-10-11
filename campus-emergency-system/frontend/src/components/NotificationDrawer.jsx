import React from 'react';
import { X, Bell, CheckCheck, Clock } from 'lucide-react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base">Incident Notifications</h3>
              <span className="px-2 py-0.5 text-xs font-semibold bg-white/20 rounded-full">
                {notifications.filter((n) => !n.read).length} new
              </span>
            </div>
            <div className="flex items-center gap-2">
              {notifications.some((n) => !n.read) && (
                <button
                  onClick={onMarkAllRead}
                  title="Mark all as read"
                  className="p-1.5 hover:bg-white/10 rounded-lg text-xs text-slate-300 hover:text-white flex items-center gap-1 transition"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  You will receive real-time updates when an incident is assigned or updated.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const formattedTime = notif.createdAt
                  ? new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) +
                    ' · ' +
                    new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '';

                return (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && onMarkRead && onMarkRead(notif.id)}
                    className={`p-4 transition cursor-pointer flex gap-3 ${
                      notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/60 hover:bg-blue-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full inline-block ${
                          notif.read ? 'bg-slate-300' : 'bg-blue-600 animate-pulse'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          notif.read ? 'text-slate-700' : 'font-semibold text-slate-900'
                        }`}
                      >
                        {notif.message}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formattedTime}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
