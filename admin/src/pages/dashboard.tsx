import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { fetchDashboardStats, DashboardStats } from '../api/stats';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  MapIcon 
} from '@heroicons/react/24/outline';

// Import Layout with proper error boundary
const Layout = dynamic(() => import('../components/Layout'), {
  ssr: true,
});

// Import DashboardCard with proper error boundary
const DashboardCard = dynamic(() => import('../components/DashboardCard'), {
  ssr: true,
});

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Managers"
            value={stats.totalManagers}
            icon={UserGroupIcon}
            color="bg-blue-500"
          />
          <DashboardCard
            title="Total Areas"
            value={stats.totalAreas}
            icon={MapIcon}
            color="bg-green-500"
          />
          <DashboardCard
            title="Total Services"
            value={stats.totalServices}
            icon={ChartBarIcon}
            color="bg-purple-500"
          />
          <DashboardCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={CurrencyDollarIcon}
            color="bg-yellow-500"
          />
        </div>

        {/* Add more dashboard sections here */}
      </div>
    </Layout>
  );
};

export default Dashboard; 