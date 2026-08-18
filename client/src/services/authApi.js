import api from './api';

export const authApi = {
  // Teacher Auth
  registerTeacher: async (data) => {
    const res = await api.post('/auth/teacher/register', data);
    return res.data;
  },
  loginTeacher: async (credentials) => {
    const res = await api.post('/auth/teacher/login', credentials);
    return res.data;
  },

  // Student Auth
  registerStudent: async (data) => {
    const res = await api.post('/auth/student/register', data);
    return res.data;
  },
  loginStudent: async (credentials) => {
    const res = await api.post('/auth/student/login', credentials);
    return res.data;
  },

  // Current Auth Session (Me)
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export default authApi;
