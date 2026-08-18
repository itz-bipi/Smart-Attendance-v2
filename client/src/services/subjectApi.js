import api from './api';

export const subjectApi = {
  createSubject: async (data) => {
    const res = await api.post('/subjects', data);
    return res.data;
  },
  getSubjects: async () => {
    const res = await api.get('/subjects');
    return res.data;
  },
};

export default subjectApi;
