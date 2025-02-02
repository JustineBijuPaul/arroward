import React, { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import ManagerList from '../components/ManagerList';
import ManagerForm from '../components/ManagerForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useManagers } from '../hooks/useManagers';
import { useAreas } from '../hooks/useAreas';
import { Manager } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';

const Managers: React.FC = () => {
  const { managers, loading, error, addManager, editManager, removeManager } = useManagers();
  const { areas, loading: areasLoading } = useAreas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const handleSubmit = async (data: Omit<Manager, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addManager(data);
      setIsModalOpen(false);
      setSelectedManager(null);
    } catch (err) {
      console.error('Failed to save manager:', err);
    }
  };

  const handleEdit = (manager: Manager) => {
    setSelectedManager(manager);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      try {
        await removeManager(id);
      } catch (err) {
        console.error('Failed to delete manager:', err);
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
        <Header title="Managers">
          <button
            type="button"
            onClick={() => {
              setSelectedManager(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Manager
          </button>
        </Header>

        <ManagerList
          managers={managers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedManager(null);
          }}
          title={selectedManager ? 'Edit Manager' : 'Add Manager'}
        >
          <ManagerForm
            onSubmit={handleSubmit}
            areas={areas}
            initialData={selectedManager || undefined}
            isEditing={!!selectedManager}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Managers; 