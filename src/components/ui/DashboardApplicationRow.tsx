import React from "react";

interface DashboardApplicationRowProps {
  leftIcon: React.ReactNode;
  mainInfo: React.ReactNode;
  rightSection: React.ReactNode;
  className?: string;
}

export const DashboardApplicationRow: React.FC<DashboardApplicationRowProps> = ({
  leftIcon,
  mainInfo,
  rightSection,
  className = ""
}) => (
  <div className={`flex items-center justify-between p-2.5 rounded-lg border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${className}`}>
    <div className="flex items-center gap-3">
      {leftIcon}
      {mainInfo}
    </div>
    <div className="flex items-center gap-2">
      {rightSection}
    </div>
  </div>
); 