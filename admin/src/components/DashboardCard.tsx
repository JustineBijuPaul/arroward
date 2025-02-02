import React from 'react';
import { ComponentType } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  return (
    <div className={`rounded-lg shadow-lg p-6 ${color} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard; 