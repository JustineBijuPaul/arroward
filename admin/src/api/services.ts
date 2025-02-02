import api from '../utils/axios';
import type { AxiosError } from 'axios';
import { Service } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
  error: string;
  message: string;
}

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get('/admin/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const createService = async (data: Omit<Service, '_id'>): Promise<Service> => {
  const response = await api.post('/admin/services', data);
  return response.data;
};

export const updateService = async (id: string, data: Partial<Service>): Promise<Service> => {
  const response = await api.patch(`/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/admin/services/${id}`);
};