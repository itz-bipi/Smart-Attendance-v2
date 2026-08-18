import api from './api';

export const enrollmentApi = {
  joinSubject: async (joinCode) => {
    const res = await api.post('/enrollments/join', { joinCode });
    return res.data;
  },
  getMyEnrollments: async () => {
    const res = await api.get('/enrollments/my');
    return res.data;
  },
  getSubjectEnrollments: async (subjectId) => {
    const res = await api.get(`/enrollments/subject/${subjectId}`);
    return res.data;
  },
  updateEnrollmentStatus: async (enrollmentId, status) => {
    const res = await api.patch(`/enrollments/${enrollmentId}/status`, { status });
    return res.data;
  },
};

export default enrollmentApi;
