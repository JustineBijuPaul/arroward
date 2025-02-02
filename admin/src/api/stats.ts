import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DashboardStats {
  totalManagers: number;
  totalAreas: number;
  totalServices: number;
  totalRevenue: number;
  recentActivity: {
    _id: string;
    type: 'manager_added' | 'service_created' | 'area_added';
    description: string;
    timestamp: string;
  }[];
  areaDistribution: {
    areaName: string;
    serviceCount: number;
  }[];
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await axios.get<DashboardStats>(`${API_URL}/admin/stats/dashboard`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  return response.data;
} 