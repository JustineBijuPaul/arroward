import axios from 'axios';
import { Settings } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchSettings(): Promise<Settings> {
  const response = await axios.get<Settings>(`${API_URL}/admin/settings`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  const response = await axios.patch<Settings>(`${API_URL}/admin/settings`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function updateSecuritySettings(
  data: Partial<Settings['security']>
): Promise<Settings> {
  const response = await axios.patch<Settings>(`${API_URL}/admin/settings/security`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function updateNotificationSettings(
  data: Partial<Settings['notifications']>
): Promise<Settings> {
  const response = await axios.patch<Settings>(`${API_URL}/admin/settings/notifications`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await axios.post(
    `${API_URL}/admin/settings/change-password`,
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    }
  );
}

export const getSettings = async (): Promise<Settings[]> => {
  const response = await axios.get<Settings[]>('/api/settings');
  return response.data;
};

export const updateSingleSetting = async (id: number, settingData: Partial<Settings>): Promise<Settings> => {
  const response = await axios.put<Settings>(`/api/settings/${id}`, settingData);
  return response.data;
}; 