import { useState, useEffect } from 'react';
import { Settings, fetchSettings, updateSettings, changePassword } from '../api/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateUserSettings = async (updates: Partial<Settings>) => {
    try {
      const updatedSettings = await updateSettings(updates);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      await changePassword(currentPassword, newPassword);
    } catch (err) {
      console.error('Error changing password:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings: updateUserSettings,
    changePassword: handlePasswordChange,
    refreshSettings: loadSettings
  };
}; 