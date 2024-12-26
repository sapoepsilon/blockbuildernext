'use client';

import { FC } from 'react';
import { Activity, Server, Cpu } from 'lucide-react';

interface SystemMetrics {
  activeContainers: number;
  cpuUsage: number;
  memoryUsage: number;
  status: 'healthy' | 'warning' | 'error';
}

export const SystemStatus: FC = () => {
  // This would typically come from an API
  const metrics: SystemMetrics = {
    activeContainers: 5,
    cpuUsage: 45,
    memoryUsage: 60,
    status: 'healthy',
  };

  const getStatusColor = (status: SystemMetrics['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Server className="h-5 w-5 text-primary" />
        <span className="text-sm">
          Active Containers: {metrics.activeContainers}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Cpu className="h-5 w-5 text-primary" />
        <span className="text-sm">
          CPU: {metrics.cpuUsage}%
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Activity className={`h-5 w-5 ${getStatusColor(metrics.status)}`} />
        <span className="text-sm capitalize">
          Status: {metrics.status}
        </span>
      </div>
    </div>
  );
};
