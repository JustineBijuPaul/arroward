import api from '../utils/axios';
import { Settings } from '../types';

export interface Settings {
  profile: {
    name: string;
    email: string;
    createdAt: string;
  };
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: 'en' | 'es' | 'fr';
  };
  system: {
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
  security?: {
    twoFactorEnabled?: boolean;
    lastPasswordChange?: string;
  };
}

export const fetchSettings = async (): Promise<Settings> => {
  try {
    const response = await api.get('/admin/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (updates: Partial<Settings>): Promise<Settings> => {
  try {
    const response = await api.patch('/admin/settings', updates);
    return response.data.settings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await api.post('/admin/settings/change-password', {
      currentPassword,
      newPassword
    });
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export async function updateSecuritySettings(
  data: Partial<Settings['security']>
): Promise<Settings> {
  const response = await api.patch<Settings>(`${API_URL}/admin/settings/security`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function updateNotificationSettings(
  data: Partial<Settings['notifications']>
): Promise<Settings> {
  const response = await api.patch<Settings>(`${API_URL}/admin/settings/notifications`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export const getSettings = async (): Promise<Settings[]> => {
  const response = await api.get<Settings[]>('/api/settings');
  return response.data;
};

export const updateSingleSetting = async (id: number, settingData: Partial<Settings>): Promise<Settings> => {
  const response = await api.put<Settings>(`/api/settings/${id}`, settingData);
  return response.data;
}; 