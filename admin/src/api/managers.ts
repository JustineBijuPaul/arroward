import axios, { AxiosError, AxiosStatic } from 'axios';
import api from '../utils/axios';
import { Manager } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
  error: string;
  message: string;
}

// Type guard function
function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error as any);
}

export async function fetchManagers(): Promise<Manager[]> {
  const response = await axios.get<Manager[]>(`${API_URL}/admin/managers`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function createManager(data: Omit<Manager, '_id' | 'createdAt' | 'updatedAt'> & { isEditing?: boolean }): Promise<Manager> {
  try {
    console.log('Creating manager with data:', data);

    // Validate required fields
    if (!data.firstName?.trim()) {
      throw new Error('First name is required');
    }
    if (!data.lastName?.trim()) {
      throw new Error('Last name is required');
    }
    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }
    if (!data.password) {
      throw new Error('Password is required');
    }
    if (!data.assignedArea) {
      throw new Error('Assigned area is required');
    }

    const formattedData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      password: data.password,
      phone: data.phone?.trim() || '',
      assignedArea: data.assignedArea,
      status: data.status || 'active'
    };

    console.log('Sending formatted data:', formattedData);
    const response = await api.post<Manager>('/admin/managers', formattedData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiError>(error)) {
      // Now TypeScript knows about your API's error structure
      const errorMessage = error.response?.data?.message ?? error.message;
      console.error('API error:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

export async function updateManager(id: string, data: Partial<Manager>): Promise<Manager> {
  const response = await axios.patch<Manager>(`${API_URL}/admin/managers/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function deleteManager(id: string): Promise<void> {
  await axios.delete(`${API_URL}/admin/managers/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
}