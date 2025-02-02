import api from '../utils/axios';
import { Area } from '../types';

export async function fetchAreas(): Promise<Area[]> {
  const response = await api.get<Area[]>('/admin/areas');
  return response.data;
}

export async function createArea(data: Omit<Area, '_id'>): Promise<Area> {
  // Log the incoming data
  console.log('Creating area with data:', data);

  // Validate required fields
  if (!data.name?.trim()) {
    throw new Error('Area name is required and cannot be empty');
  }

  const formattedData = {
    name: data.name.trim(),
    description: data.description?.trim() || '',
    coordinates: {
      coordinates: [
        parseFloat(String(data.coordinates?.coordinates?.[0])) || 0,
        parseFloat(String(data.coordinates?.coordinates?.[1])) || 0
      ] as [number, number]
    },
    country: data.country.trim(),
    state: data.state.trim(),
    city: data.city.trim()
  };

  // Log the formatted data
  console.log('Formatted data:', formattedData);

  const response = await api.post<Area>('/admin/areas', formattedData);
  return response.data;
}

export async function updateArea(id: string, data: Partial<Area>): Promise<Area> {
  const response = await api.patch<Area>(`/admin/areas/${id}`, data);
  return response.data;
}

export async function deleteArea(id: string): Promise<void> {
  await api.delete(`/admin/areas/${id}`);
} 