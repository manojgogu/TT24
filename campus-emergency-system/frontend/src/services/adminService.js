import api from './api';

export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  getAllResponders: async () => {
    const res = await api.get('/admin/responders');
    return res.data;
  },

  createResponder: async (responderData) => {
    const res = await api.post('/admin/responders', responderData);
    return res.data;
  },

  toggleUserStatus: async (userId, active) => {
    const res = await api.patch(`/admin/users/${userId}/status`, { active });
    return res.data;
  },

  exportReportsCsv: async () => {
    // Download directly via window or fetch blob
    const token = localStorage.getItem('token');
    const response = await fetch('/api/admin/reports/export', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to export CSV report');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus_emergency_reports_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
