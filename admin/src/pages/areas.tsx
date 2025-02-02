import React, { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import AreaList from '../components/AreaList';
import AreaForm from '../components/AreaForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAreas } from '../hooks/useAreas';
import { Area } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Areas: React.FC = () => {
  const { areas, loading, error, addArea, editArea, removeArea } = useAreas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const handleSubmit = async (data: Omit<Area, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedArea) {
        await editArea(selectedArea._id, data);
      } else {
        await addArea(data);
      }
      setIsModalOpen(false);
      setSelectedArea(null);
    } catch (err) {
      console.error('Failed to save area:', err);
    }
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this area?')) {
        return;
      }
      
      await removeArea(id);
      toast.success('Area deleted successfully');
    } catch (error) {
      console.error('Failed to delete area:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete area');
    }
  };

  if (loading) {
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
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Areas</h3>
          <button
            type="button"
            onClick={() => {
              setSelectedArea(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Area
          </button>
        </div>
        <div className="border-t border-gray-200">
          <AreaList
            areas={areas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArea(null);
        }}
        title={selectedArea ? 'Edit Area' : 'Add Area'}
      >
        <AreaForm
          onSubmit={handleSubmit}
          initialData={selectedArea || undefined}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Areas; 