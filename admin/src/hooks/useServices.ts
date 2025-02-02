import { useState, useEffect } from 'react';
import { Service } from '../types';
import { fetchServices, createService, updateService, deleteService } from '../api/services';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const addService = async (data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newService = await createService(data);
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err) {
      throw err;
    }
  };

  const editService = async (id: string, data: Partial<Service>) => {
    try {
      const updatedService = await updateService(id, data);
      setServices(prev => prev.map(service => service._id === id ? updatedService : service));
      return updatedService;
    } catch (err) {
      throw err;
    }
  };

  const removeService = async (id: string) => {
    try {
      await deleteService(id);
      setServices(prev => prev.filter(service => service._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    services,
    loading,
    error,
    addService,
    editService,
    removeService,
    refreshServices: loadServices
  };
}; 