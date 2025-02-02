import React, { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import SecuritySettings from '../components/SecuritySettings';
import NotificationSettings from '../components/NotificationSettings';
import SettingsForm from '../components/SettingsForm';
import { useSettings } from '../hooks/useSettings';
import { Settings as SettingsType } from '../types';

const Settings: React.FC = () => {
  const { settings, loading, error, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');

  const handleGeneralSubmit = async (data: Partial<SettingsType>) => {
    try {
      await updateSettings(data);
    } catch (err) {
      console.error('Failed to update general settings:', err);
    }
  };

  const handleSecuritySubmit = async (data: Partial<SettingsType['security']>) => {
    try {
      await updateSettings({ security: data });
    } catch (err) {
      console.error('Failed to update security settings:', err);
    }
  };

  const handleNotificationSubmit = async (data: Partial<SettingsType['notifications']>) => {
    try {
      await updateSettings({ notifications: data });
    } catch (err) {
      console.error('Failed to update notification settings:', err);
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

  if (error || !settings) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-600">Error: {error || 'Settings not found'}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header title="Settings" />

        <div className="mt-4 sm:mt-0">
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              {['general', 'security', 'notifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`${
                    activeTab === tab
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  } px-3 py-2 font-medium text-sm rounded-md capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'general' && (
              <SettingsForm settings={settings} onSubmit={handleGeneralSubmit} />
            )}
            {activeTab === 'security' && (
              <SecuritySettings settings={settings} onSubmit={handleSecuritySubmit} />
            )}
            {activeTab === 'notifications' && (
              <NotificationSettings settings={settings} onSubmit={handleNotificationSubmit} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 