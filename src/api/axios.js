import axios from 'axios';

// In production: VITE_API_URL points to Render backend (e.g. https://wildlife-api.onrender.com/api)
// In development: Vite proxy forwards /api to localhost:5000
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('wildlife_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Sightings API
export const createSighting = (formData) => API.post('/sightings', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getSightings = (params) => API.get('/sightings', { params });
export const getSighting = (id) => API.get(`/sightings/${id}`);
export const getUserSightings = (userId) => API.get(`/sightings/user/${userId}`);
export const deleteSighting = (id) => API.delete(`/sightings/${id}`);
export const toggleLike = (id) => API.put(`/sightings/${id}/like`);

// Analytics API
export const getTopSpecies = (months) => API.get('/analytics/top-species', { params: { months } });
export const getHealthCheck = () => API.get('/analytics/health-check');
export const getTrends = (months) => API.get('/analytics/trends', { params: { months } });
export const getHotspots = () => API.get('/analytics/hotspots');

export default API;
