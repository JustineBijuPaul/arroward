import React from 'react';
import { useForm } from 'react-hook-form';
import { Settings } from '../types';

interface NotificationSettingsProps {
  settings: Settings;
  onSubmit: (data: Partial<Settings['notifications']>) => Promise<void>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onSubmit }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: settings.notifications
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="email"
            type="checkbox"
            {...register('email')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="email" className="ml-3 block text-sm font-medium text-gray-700">
            Email notifications
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="push"
            type="checkbox"
            {...register('push')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="push" className="ml-3 block text-sm font-medium text-gray-700">
            Push notifications
          </label>
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
            Notification frequency
          </label>
          <select
            id="frequency"
            {...register('frequency')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="instant">Instant</option>
            <option value="daily">Daily digest</option>
            <option value="weekly">Weekly digest</option>
          </select>
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

export default NotificationSettings; 