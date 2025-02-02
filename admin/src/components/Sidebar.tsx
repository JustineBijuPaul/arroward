import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  MapIcon, 
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { classNames } from '../utils/classNames';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Managers', href: '/managers', icon: UsersIcon },
  { name: 'Areas', href: '/areas', icon: MapIcon },
  { name: 'Services', href: '/services', icon: WrenchScrewdriverIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-indigo-700 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="ArrowArd"
          />
          <span className="ml-3 text-xl font-bold text-white">ArrowArd</span>
        </div>
        <nav className="mt-8 flex-1 flex flex-col" aria-label="Sidebar">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="mt-auto px-2">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-600"
          >
            <ArrowLeftOnRectangleIcon
              className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300 group-hover:text-white"
              aria-hidden="true"
            />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 