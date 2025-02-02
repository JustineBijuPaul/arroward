import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AreaFormData } from '../types';

interface AreaFormProps {
  initialData?: Partial<AreaFormData>;
  onSubmit: (data: AreaFormData) => Promise<void>;
  onCancel: () => void;
}

const AreaForm: React.FC<AreaFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<AreaFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      coordinates: initialData?.coordinates || [0, 0],
      country: initialData?.country || '',
      state: initialData?.state || '',
      city: initialData?.city || ''
    }
  });

  const handleFormSubmit = async (data: AreaFormData) => {
    try {
      setSubmitError(null);
      
      // Format the coordinates directly as an array
      const formattedData = {
        ...data,
        name: data.name.trim(),
        description: data.description?.trim(),
        coordinates: [
          Number(data.coordinates?.[0] || 0),
          Number(data.coordinates?.[1] || 0)
        ] as [number, number],
        country: data.country?.trim(),
        state: data.state?.trim(),
        city: data.city?.trim()
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
          <label htmlFor="coordinates.0" className="block text-sm font-medium text-gray-700">
            Longitude *
          </label>
          <input
            type="number"
            step="0.000001"
            id="coordinates.0"
            {...register('coordinates.0', { 
              required: 'Longitude is required',
              valueAsNumber: true,
              validate: {
                isValid: (value) => {
                  const num = Number(value);
                  if (isNaN(num) || num < -180 || num > 180) {
                    return 'Longitude must be between -180 and 180';
                  }
                  return true;
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.coordinates?.[0] && (
            <p className="mt-1 text-sm text-red-600">
              {errors.coordinates[0].message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="coordinates.1" className="block text-sm font-medium text-gray-700">
            Latitude *
          </label>
          <input
            type="number"
            step="0.000001"
            id="coordinates.1"
            {...register('coordinates.1', { 
              required: 'Latitude is required',
              valueAsNumber: true,
              validate: {
                isValid: (value) => {
                  const num = Number(value);
                  if (isNaN(num) || num < -90 || num > 90) {
                    return 'Latitude must be between -90 and 90';
                  }
                  return true;
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.coordinates?.[1] && (
            <p className="mt-1 text-sm text-red-600">
              {errors.coordinates[1].message}
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

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Area
        </button>
      </div>
    </form>
  );
};

export default AreaForm; 