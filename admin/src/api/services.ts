import axios from 'axios';
import type { AxiosError } from 'axios';
import { Service } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
  error: string;
  message: string;
}

export async function fetchServices(): Promise<Service[]> {
  const response = await axios.get<Service[]>(`${API_URL}/admin/services`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function createService(data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
  try {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error('Service name is required');
    }
    if (!data.description?.trim()) {
      throw new Error('Description is required');
    }
    if (data.price === undefined || data.price === null) {
      throw new Error('Price is required');
    }
    
    // Validate price
    const price = Number(data.price);
    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be a valid positive number');
    }

    const formattedData = {
      name: data.name.trim(),
      description: data.description.trim(),
      price: price,
      status: data.status || 'active'
    };

    console.log('Form data before submission:', data);

    const response = await axios.post<Service>(`${API_URL}/admin/services`, formattedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  const response = await axios.put<Service>(`${API_URL}/admin/services/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function deleteService(id: string): Promise<void> {
  await axios.delete(`${API_URL}/admin/services/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
}