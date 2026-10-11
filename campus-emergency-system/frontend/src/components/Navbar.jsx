import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Bell,
  LogOut,
  User,
  AlertTriangle,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import NotificationDrawer from './NotificationDrawer';

export default function Navbar({ onOpenSos, onToggleSidebar, isSidebarOpen }) {
  const { user, logout, isAdmin, isSecurity } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotificationCount();
      const interval = setInterval(loadNotificationCount, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotificationCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count || 0);
    } catch {
      // silently fail if unauthenticated or network drop
    }
  };

  const handleOpenNotifications = async () => {
    try {
      const notifs = await notificationService.getNotifications();
      setNotifications(notifs || []);
      setIsNotifOpen(true);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-purple-100 text-purple-800 border border-purple-200">ADMIN</span>;
      case 'SECURITY':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-blue-100 text-blue-800 border border-blue-200">RESPONDER</span>;
      case 'FACULTY':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">FACULTY</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-100 text-slate-800 border border-slate-200">STUDENT</span>;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Mobile Sidebar Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/40 ring-2 ring-red-500/30">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                      CampusSafety
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-red-950/80 text-red-400 border border-red-800/60">
                      LIVE OPS
                    </span>
                  </div>
                  <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                    Emergency Reporting & Incident Response
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick SOS, Notifications, User Menu */}
            <div className="flex items-center gap-3">
              {/* Instant SOS Action Button */}
              {onOpenSos && (
                <button
                  onClick={onOpenSos}
                  className="relative group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-md shadow-red-900/50 hover:shadow-red-700/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
                  <span>EMERGENCY SOS</span>
                </button>
              )}

              {/* Notification Bell */}
              <button
                onClick={handleOpenNotifications}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-600 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-semibold text-white leading-tight">
                      {user?.fullName || 'User'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {user?.role || 'Guest'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.email}
                      </p>
                      <div className="mt-1">{getRoleBadge(user?.role)}</div>
                    </div>
                    <div className="py-1">
                      <a
                        href="/profile"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsProfileMenuOpen(false);
                          window.location.hash = '#profile';
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Account Profile
                      </a>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
}
