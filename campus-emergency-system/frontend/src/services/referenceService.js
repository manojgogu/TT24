import api from './api';

export const referenceService = {
  getActiveCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

  getAllCategories: async () => {
    const res = await api.get('/categories/all');
    return res.data;
  },

  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return res.data;
  },

  updateCategory: async (id, categoryData) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    return res.data;
  },

  getActiveLocations: async () => {
    const res = await api.get('/locations');
    return res.data;
  },

  getAllLocations: async () => {
    const res = await api.get('/locations/all');
    return res.data;
  },

  createLocation: async (locationData) => {
    const res = await api.post('/locations', locationData);
    return res.data;
  },

  updateLocation: async (id, locationData) => {
    const res = await api.put(`/locations/${id}`, locationData);
    return res.data;
  },
};
