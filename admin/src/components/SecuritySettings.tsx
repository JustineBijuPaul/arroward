import React from 'react';
import { useForm } from 'react-hook-form';
import { Settings } from '../types';

interface SecuritySettingsProps {
  settings: Settings;
  onSubmit: (data: Partial<Settings['security']>) => Promise<void>;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ settings, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: settings.security
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
            Minimum Password Length
          </label>
          <input
            type="number"
            id="passwordMinLength"
            {...register('passwordMinLength', {
              required: 'This field is required',
              min: { value: 8, message: 'Minimum length should be at least 8' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.passwordMinLength && (
            <p className="mt-1 text-sm text-red-600">{errors.passwordMinLength.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="requireSpecialChars"
            type="checkbox"
            {...register('requireSpecialChars')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="requireSpecialChars" className="ml-3 block text-sm font-medium text-gray-700">
            Require special characters
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="requireNumbers"
            type="checkbox"
            {...register('requireNumbers')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="requireNumbers" className="ml-3 block text-sm font-medium text-gray-700">
            Require numbers
          </label>
        </div>

        <div>
          <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            id="sessionTimeout"
            {...register('sessionTimeout', {
              required: 'This field is required',
              min: { value: 5, message: 'Minimum timeout should be 5 minutes' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.sessionTimeout && (
            <p className="mt-1 text-sm text-red-600">{errors.sessionTimeout.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save changes
        </button>
      </div>
    </form>
  );
};

export default SecuritySettings; 