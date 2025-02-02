import { useState, useEffect } from 'react';
import { Settings } from '../types';
import { fetchSettings, updateSettings } from '../api/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
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

  const updateSettingsData = async (data: Partial<Settings>) => {
    try {
      const updatedSettings = await updateSettings(data);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings: updateSettingsData,
    refreshSettings: loadSettings
  };
}; 