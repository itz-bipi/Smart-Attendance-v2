import api from './api';

export const attendanceApi = {
  // Teacher session management
  startAttendanceSession: async ({ subjectId, latitude, longitude }) => {
    const res = await api.post('/attendance/sessions', {
      subjectId,
      latitude,
      longitude,
    });
    return res.data;
  },
  getActiveSession: async (subjectId) => {
    const res = await api.get(`/attendance/sessions/active/${subjectId}`);
    return res.data;
  },
  closeAttendanceSession: async (sessionId) => {
    const res = await api.post(`/attendance/sessions/${sessionId}/close`);
    return res.data;
  },

  // Student active sessions & token flow
  getMyActiveSessions: async () => {
    const res = await api.get('/attendance/sessions/my-active');
    return res.data;
  },
  generateStudentAttendanceToken: async (sessionId) => {
    const res = await api.post(`/attendance/sessions/${sessionId}/token`);
    return res.data;
  },
  verifyStudentAttendanceToken: async (token) => {
    const res = await api.post('/attendance/verify-token', { token });
    return res.data;
  },
};

export default attendanceApi;
