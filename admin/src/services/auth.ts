import { api } from '../utils/api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/admin/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/admin/me');
  return response.data;
}; 