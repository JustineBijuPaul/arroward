import React from 'react';
import { useForm } from 'react-hook-form';
import { Settings } from '../types';

interface SettingsFormProps {
  settings: Settings;
  onSubmit: (data: Partial<Settings>) => Promise<void>;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      siteName: settings.siteName,
      supportEmail: settings.supportEmail,
      defaultCurrency: settings.defaultCurrency,
      minimumPayment: settings.minimumPayment,
      serviceCommission: settings.serviceCommission,
      allowManagerRegistration: settings.allowManagerRegistration
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
          Site Name
        </label>
        <input
          type="text"
          id="siteName"
          {...register('siteName', { required: 'Site name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.siteName && (
          <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
          Support Email
        </label>
        <input
          type="email"
          id="supportEmail"
          {...register('supportEmail', {
            required: 'Support email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.supportEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.supportEmail.message}</p>
        )}
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

export default SettingsForm; 