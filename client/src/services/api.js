import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial for sending & receiving accessToken cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // Attach friendly extracted message
    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

export default api;
