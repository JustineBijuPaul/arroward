import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Area } from '../types';

interface AreaFormProps {
  onSubmit: (data: Omit<Area, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Partial<Area>;
  isEditing?: boolean;
}

const AreaForm: React.FC<AreaFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Area, '_id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: initialData,
    mode: 'onChange'
  });

  const handleFormSubmit = async (data: Omit<Area, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setSubmitError(null);
      
      // Format the coordinates with proper precision
      const formattedData = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        coordinates: {
          coordinates: [
            Number(Number(data.coordinates?.coordinates?.[0]).toFixed(6)),
            Number(Number(data.coordinates?.coordinates?.[1]).toFixed(6))
          ] as [number, number]
        },
        country: data.country.trim(),
        state: data.state.trim(),
        city: data.city.trim()
      };

      console.log('Submitting formatted data:', formattedData);
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save area');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{submitError}</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="coordinates.coordinates.0" className="block text-sm font-medium text-gray-700">
            Longitude *
          </label>
          <input
            type="number"
            step="0.000001"
            id="coordinates.coordinates.0"
            {...register('coordinates.coordinates.0', { 
              required: 'Longitude is required',
              valueAsNumber: true,
              validate: {
                isValid: (value) => {
                  if (value < -180 || value > 180) {
                    return 'Longitude must be between -180 and 180';
                  }
                  return true;
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.coordinates?.coordinates?.[0] && (
            <p className="mt-1 text-sm text-red-600">
              {errors.coordinates.coordinates[0].message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="coordinates.coordinates.1" className="block text-sm font-medium text-gray-700">
            Latitude *
          </label>
          <input
            type="number"
            step="0.000001"
            id="coordinates.coordinates.1"
            {...register('coordinates.coordinates.1', { 
              required: 'Latitude is required',
              valueAsNumber: true,
              validate: {
                isValid: (value) => {
                  if (value < -90 || value > 90) {
                    return 'Latitude must be between -90 and 90';
                  }
                  return true;
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.coordinates?.coordinates?.[1] && (
            <p className="mt-1 text-sm text-red-600">
              {errors.coordinates.coordinates[1].message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <input
          type="text"
          id="country"
          {...register('country', { required: 'Country is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State *
        </label>
        <input
          type="text"
          id="state"
          {...register('state', { required: 'State is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City *
        </label>
        <input
          type="text"
          id="city"
          {...register('city', { required: 'City is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isEditing ? 'Update' : 'Create'} Area
        </button>
      </div>
    </form>
  );
};

export default AreaForm; 