import { useState, useEffect } from 'react';
import { Manager } from '../types';
import { fetchManagers, createManager, updateManager, deleteManager } from '../api/managers';

export const useManagers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadManagers = async () => {
    try {
      setLoading(true);
      const data = await fetchManagers();
      setManagers(data);
      setError(null);
    } catch (err) {
      console.error('Error loading managers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load managers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const addManager = async (data: Omit<Manager, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newManager = await createManager(data);
      setManagers(prev => [...prev, newManager]);
      return newManager;
    } catch (err) {
      console.error('Failed to save manager:', err);
      throw err;
    }
  };

  const editManager = async (id: string, data: Partial<Manager>) => {
    try {
      const updatedManager = await updateManager(id, data);
      setManagers(prev => prev.map(manager => manager._id === id ? updatedManager : manager));
      return updatedManager;
    } catch (err) {
      throw err;
    }
  };

  const removeManager = async (id: string) => {
    try {
      await deleteManager(id);
      setManagers(prev => prev.filter(manager => manager._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    managers,
    loading,
    error,
    addManager,
    editManager,
    removeManager,
    refreshManagers: loadManagers
  };
}; 