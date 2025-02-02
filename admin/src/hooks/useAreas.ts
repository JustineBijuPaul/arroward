import { useState, useEffect } from 'react';
import { Area } from '../types';
import { fetchAreas, createArea, updateArea, deleteArea } from '../api/areas';
import axios from 'axios';

export const useAreas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const data = await fetchAreas();
      setAreas(data);
      setError(null);
    } catch (err) {
      console.error('Error loading areas:', err);
      setError(err instanceof Error ? err.message : 'Failed to load areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const addArea = async (data: Omit<Area, '_id'>) => {
    try {
      // Log the data being sent
      console.log('Submitting area data:', data);
      
      const newArea = await createArea(data);
      console.log('Successfully created area:', newArea);
      setAreas(prev => [...prev, newArea]);
      return newArea;
    } catch (err) {
      console.error('Error creating area:', err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message 
          || err.response?.data?.error 
          || err.message;
        console.error('Detailed error:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: errorMessage
        });
        throw new Error(errorMessage);
      }
      throw err;
    }
  };

  const editArea = async (id: string, data: Partial<Area>) => {
    try {
      const updatedArea = await updateArea(id, data);
      setAreas(prev => prev.map(area => area._id === id ? updatedArea : area));
      return updatedArea;
    } catch (err) {
      throw err;
    }
  };

  const removeArea = async (id: string) => {
    try {
      await deleteArea(id);
      setAreas(prev => prev.filter(area => area._id !== id));
    } catch (error) {
      console.error('Error deleting area:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete area';
      throw new Error(message);
    }
  };

  return {
    areas,
    loading,
    error,
    addArea,
    editArea,
    removeArea,
    refreshAreas: loadAreas
  };
}; 