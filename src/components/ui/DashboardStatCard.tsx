import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  color?: string;
  bgColor?: string;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color = "text-blue-600",
  bgColor = "bg-blue-50"
}) => (
  <div className="hover:shadow-sm transition-shadow bg-white dark:bg-zinc-900 rounded-lg">
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
        <div className={`p-2 rounded-lg ${bgColor} dark:bg-zinc-800`}>
          <Icon className={`h-4 w-4 ${color} dark:text-primary`} />
        </div>
      </div>
    </div>
  </div>
); 