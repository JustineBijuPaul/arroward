import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Service, Area } from '../types';

interface ServiceFormProps {
  onSubmit: (data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  areas: Area[];
  initialData?: Partial<Service>;
  isEditing?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onSubmit, areas, initialData, isEditing = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Service, '_id' | 'createdAt'>>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      areaId: initialData?.areaId || '',
      category: initialData?.category || 'other',
      basePrice: initialData?.basePrice || 0,
      priceUnit: initialData?.priceUnit || 'per_hour',
      active: initialData?.active ?? true,
      requiredSkills: initialData?.requiredSkills || [],
      estimatedDuration: initialData?.estimatedDuration || 1
    }
  });

  const onSubmitHandler: SubmitHandler<Omit<Service, '_id' | 'createdAt' | 'updatedAt'>> = async (data) => {
    if (!(data.description ?? '').trim()) {
      console.error('Description is required');
      alert('Please enter a description.');
      return;
    }
    if (typeof data.basePrice !== 'number' || data.basePrice < 0) {
      console.error('Invalid price');
      alert('Please enter a valid price.');
      return;
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description', { required: 'Description is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Area Selection */}
      <div>
        <label htmlFor="areaId" className="block text-sm font-medium text-gray-700">
          Area
        </label>
        <select
          id="areaId"
          {...register('areaId', { required: 'Area is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an area</option>
          {areas.map((area) => (
            <option key={area._id} value={area._id}>
              {area.name}
            </option>
          ))}
        </select>
        {errors.areaId && <p className="mt-1 text-sm text-red-600">{errors.areaId.message}</p>}
      </div>

      {/* Category Selection */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="farm_maintenance">Farm Maintenance</option>
          <option value="home_cleaning">Home Cleaning</option>
          <option value="house_painting">House Painting</option>
          <option value="blight_removal">Blight Removal</option>
          <option value="tree_services">Tree Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Base Price */}
      <div>
        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
          Base Price
        </label>
        <input
          type="number"
          id="basePrice"
          {...register('basePrice', { 
            required: 'Base price is required', 
            valueAsNumber: true,
            min: { value: 0, message: 'Price must be greater than or equal to 0' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.basePrice && <p className="mt-1 text-sm text-red-600">{errors.basePrice.message}</p>}
      </div>

      {/* Price Unit */}
      <div>
        <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700">
          Price Unit
        </label>
        <select
          id="priceUnit"
          {...register('priceUnit', { required: 'Price unit is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="per_hour">Per Hour</option>
          <option value="per_square_meter">Per Square Meter</option>
          <option value="per_job">Per Job</option>
        </select>
      </div>

      {/* Estimated Duration */}
      <div>
        <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
          Estimated Duration (hours)
        </label>
        <input
          type="number"
          id="estimatedDuration"
          {...register('estimatedDuration', { required: 'Duration is required', valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Active Status */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('active')}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">Active</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isEditing ? 'Update' : 'Create'} Service
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
