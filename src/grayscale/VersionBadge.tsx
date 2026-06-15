import React from 'react';
import { versionManager } from './versionManager';
import { MonitorStatus } from './types';

interface VersionBadgeProps {
  showStatus?: boolean;
  status?: MonitorStatus;
  className?: string;
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({
  showStatus = true,
  status,
  className = '',
}) => {
  const versionInfo = versionManager.getVersionInfo();

  const getStatusColor = () => {
    if (!showStatus || !status) return 'bg-gray-100 text-gray-600';
    if (status.hasError) return 'bg-red-100 text-red-700';
    if (status.isSlow) return 'bg-amber-100 text-amber-700';
    if (versionInfo.isRolledBack) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = () => {
    if (!showStatus || !status) return '';
    if (status.hasError) return '异常';
    if (status.isSlow) return '缓慢';
    if (versionInfo.isRolledBack) return '已回滚';
    return '正常';
  };

  return (
    <div className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusColor()}`}>
        v{versionInfo.current}
      </span>
      {showStatus && status && (
        <span className={`px-2 py-0.5 rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      )}
    </div>
  );
};
