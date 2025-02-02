import api from '../utils/axios';

export interface DashboardStats {
  totalManagers: number;
  totalAreas: number;
  totalServices: number;
  totalRevenue: number;
  recentActivity: any[];
  areaDistribution: any[];
  monthlyRevenue: any[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/admin/stats/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 