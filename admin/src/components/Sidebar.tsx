import React from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  MapIcon,
  CogIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Managers', to: '/managers', icon: UserGroupIcon },
  { name: 'Areas', to: '/areas', icon: MapIcon },
  { name: 'Services', to: '/services', icon: ClipboardIcon },
  { name: 'Settings', to: '/settings', icon: CogIcon },
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="/logo-white.svg"
              alt="ArrowArd"
            />
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  href={item.to}
                  className={`${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 