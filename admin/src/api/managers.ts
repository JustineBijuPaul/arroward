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
  const response = await api.get('admin/managers');
  return response.data;
}

export async function createManager(data: Omit<Manager, '_id' | 'createdAt' | 'updatedAt'> & { isEditing?: boolean }): Promise<Manager> {
  // Move validation and data formatting outside try block
  const validationErrors: string[] = [];
  const phone = data.phone?.trim() || '';
  
  if (!data.firstName?.trim()) validationErrors.push('First name is required');
  if (!data.lastName?.trim()) validationErrors.push('Last name is required');
  if (!data.email?.trim()) validationErrors.push('Email is required');
  if (!data.isEditing && !data.password) validationErrors.push('Password is required');
  if (!phone) validationErrors.push('Phone number is required');
  if (!data.assignedArea) validationErrors.push('Assigned area is required');
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email.trim())) {
    validationErrors.push('Invalid email format');
  }

  // Validate phone format
  const phoneRegex = /^\d{10}$/;
  if (phone && !phoneRegex.test(phone)) {
    validationErrors.push('Phone number must be 10 digits');
  }
  
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(', '));
  }

  const formattedData = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    phone: phone,
    assignedArea: data.assignedArea,
    status: data.status || 'active'
  };

  try {
    const response = await api.post<Manager>('/admin/managers', formattedData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || 'Failed to create manager';
      
      // Now formattedData is accessible here
      if (errorMessage.includes('email already exists')) {
        throw new Error(`The email ${formattedData.email} is already in use. Please use a different email address.`);
      }
      
      console.error('Manager creation failed:', {
        status: error.response.status,
        message: errorMessage,
        data: error.response.data
      });
      throw new Error(errorMessage);
    }
    throw error;
  }
}

export async function updateManager(id: string, data: Partial<Manager>): Promise<Manager> {
  const response = await api.patch<Manager>(`/admin/managers/${id}`, data);
  return response.data;
}

export async function deleteManager(id: string): Promise<void> {
  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid manager ID format');
    }

    const response = await api.delete(`/admin/managers/${id}`);
    
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete manager');
    }

    console.log('Manager deleted successfully:', id);
  } catch (error) {
    console.error('Delete request failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      id
    });
    throw error;
  }
}