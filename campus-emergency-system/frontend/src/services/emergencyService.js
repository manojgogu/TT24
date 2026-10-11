import api from './api';

export const emergencyService = {
  reportEmergency: async (reportData) => {
    const res = await api.post('/emergencies', reportData);
    return res.data;
  },

  getAllEmergencies: async (params = {}) => {
    const res = await api.get('/emergencies', { params });
    return res.data;
  },

  getMyReports: async () => {
    const res = await api.get('/emergencies/my');
    return res.data;
  },

  getAssignedToMe: async (activeOnly = false) => {
    const res = await api.get('/emergencies/assigned', { params: { activeOnly } });
    return res.data;
  },

  getEmergencyById: async (id) => {
    const res = await api.get(`/emergencies/${id}`);
    return res.data;
  },

  assignEmergency: async (id, responderId, notes) => {
    const res = await api.post(`/emergencies/${id}/assign`, { responderId, notes });
    return res.data;
  },

  updateStatus: async (id, status, remarks) => {
    const res = await api.patch(`/emergencies/${id}/status`, { status, remarks });
    return res.data;
  },

  resolveEmergency: async (id, resolutionSummary) => {
    const res = await api.post(`/emergencies/${id}/resolve`, { resolutionSummary });
    return res.data;
  },

  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/emergencies/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getHistory: async (id) => {
    const res = await api.get(`/emergencies/${id}/history`);
    return res.data;
  },
};
