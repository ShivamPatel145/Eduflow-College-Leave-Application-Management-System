import React from "react";
import { Link } from "react-router-dom";

interface DashboardQuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color?: string;
  bgColor?: string;
}

export const DashboardQuickAction: React.FC<DashboardQuickActionProps> = ({
  title,
  description,
  icon: Icon,
  href,
  color = "text-blue-600",
  bgColor = "bg-blue-50 hover:bg-blue-100"
}) => {
  // Assign a unique dark background based on the action title
  let darkBg = "dark:bg-zinc-800";
  if (title.toLowerCase().includes("apply")) darkBg = "dark:bg-blue-900/40";
  else if (title.toLowerCase().includes("status")) darkBg = "dark:bg-green-900/40";
  else if (title.toLowerCase().includes("history")) darkBg = "dark:bg-purple-900/40";

  return (
    <Link to={href} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${bgColor} ${darkBg} group border border-transparent dark:border-zinc-700`}>
      <div className={`p-2 rounded-lg ${bgColor} ${darkBg}`}>
        <Icon className={`h-5 w-5 ${color} dark:text-primary`} />
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:underline">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-300">{description}</p>
      </div>
    </Link>
  );
} 