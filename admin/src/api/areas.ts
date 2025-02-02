import api from '../utils/axios';
import { Area } from '../types';
import axios from 'axios';

export async function fetchAreas(): Promise<Area[]> {
  const response = await api.get('/admin/areas'); // Remove /api prefix
  return response.data;
}

export async function createArea(data: Omit<Area, '_id'>): Promise<Area> {
  try {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error('Area name is required and cannot be empty');
    }

    const formattedData = {
      name: data.name.trim(),
      description: data.description?.trim() || '',
      coordinates: data.coordinates ? [
        typeof data.coordinates[0] === 'string' ? parseFloat(data.coordinates[0]) : data.coordinates[0],
        typeof data.coordinates[1] === 'string' ? parseFloat(data.coordinates[1]) : data.coordinates[1]
      ] : undefined,
      country: data.country?.trim(),
      state: data.state?.trim(),
      city: data.city?.trim()
    };

    console.log('Creating area with formatted data:', formattedData);

    const response = await api.post<Area>('/admin/areas', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating area:', {
      error,
      data
    });
    throw error;
  }
}

export const updateArea = async (id: string, data: Partial<Area>): Promise<Area> => {
  try {
    // Format the data before sending
    const formattedData = {
      ...data,
      // Handle coordinates properly
      coordinates: data.coordinates ? [
        typeof data.coordinates[0] === 'string' ? parseFloat(data.coordinates[0]) : data.coordinates[0],
        typeof data.coordinates[1] === 'string' ? parseFloat(data.coordinates[1]) : data.coordinates[1]
      ] : undefined
    };

    console.log('Updating area with formatted data:', formattedData);

    const response = await api.patch<Area>(`/admin/areas/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error updating area:', {
      error,
      data,
      id
    });
    throw error;
  }
};

export const deleteArea = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/admin/areas/${id}`);
    
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to delete area');
    }
  } catch (error) {
    console.error('Delete request failed:', error);
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data?.message || 'Failed to delete area';
      throw new Error(message);
    }
    throw error;
  }
};