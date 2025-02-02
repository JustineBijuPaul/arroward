import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const pageTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/managers': 'Manager Management',
    '/areas': 'Area Management',
    '/services': 'Service Management',
    '/settings': 'Settings',
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitles[router.pathname] || 'ArrowArd Admin'}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {user?.name || 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;