import api from './api';

export const classApi = {
  createClass: async (data) => {
    const res = await api.post('/classes', data);
    return res.data;
  },
  getClasses: async () => {
    const res = await api.get('/classes');
    return res.data;
  },
  getClassById: async (classId) => {
    const res = await api.get(`/classes/${classId}`);
    return res.data;
  },
  updateClass: async (classId, data) => {
    const res = await api.put(`/classes/${classId}`, data);
    return res.data;
  },
  deleteClass: async (classId) => {
    const res = await api.delete(`/classes/${classId}`);
    return res.data;
  },
};

export default classApi;
