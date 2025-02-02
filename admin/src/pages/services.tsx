import React, { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import ServiceList from '../components/ServiceList';
import ServiceForm from '../components/ServiceForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useServices } from '../hooks/useServices';
import { useAreas } from '../hooks/useAreas';
import { Service } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';

const Services: React.FC = () => {
  const { services, loading, error, addService, editService, removeService } = useServices();
  const { areas, loading: areasLoading } = useAreas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleSubmit = async (data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedService) {
        await editService(selectedService._id, data);
      } else {
        await addService(data);
      }
      setIsModalOpen(false);
      setSelectedService(null);
    } catch (err) {
      console.error('Failed to save service:', err);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await removeService(id);
      } catch (err) {
        console.error('Failed to delete service:', err);
      }
    }
  };

  if (loading || areasLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header title="Services">
          <button
            type="button"
            onClick={() => {
              setSelectedService(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Service
          </button>
        </Header>

        <ServiceList
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          title={selectedService ? 'Edit Service' : 'Add Service'}
        >
          <ServiceForm
            onSubmit={handleSubmit}
            areas={areas}
            initialData={selectedService || undefined}
            isEditing={!!selectedService}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Services; 