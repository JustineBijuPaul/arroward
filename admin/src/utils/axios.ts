import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Remove all leading slashes and 'api' prefixes
  const cleanUrl = (config.url || '')
    .replace(/^\/+/, '')
    .replace(/^api\/+/, '');

  // Add single api prefix
  config.url = `api/${cleanUrl}`;

  // Debug log
  console.log('Making request to:', `${config.baseURL}/${config.url}`);

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;