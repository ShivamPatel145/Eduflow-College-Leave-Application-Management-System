import { DashboardStatCard } from "@/components/ui/DashboardStatCard";
import { DashboardQuickAction } from "@/components/ui/DashboardQuickAction";
import { DashboardApplicationRow } from "@/components/ui/DashboardApplicationRow";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, EyeIcon, ClockIcon, CheckCircleIcon, UsersIcon, XCircleIcon, BarChart3Icon } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

// Simulated async data fetching hook
const useFacultyDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStats([
        {
          title: "Pending Reviews",
          value: "8",
          icon: ClockIcon,
          description: "Need attention",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50"
        },
        {
          title: "Approved Today",
          value: "5",
          icon: CheckCircleIcon,
          description: "Applications approved",
          color: "text-green-600",
          bgColor: "bg-green-50"
        },
        {
          title: "Total Students",
          value: "45",
          icon: UsersIcon,
          description: "In your class",
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          title: "Rejected",
          value: "2",
          icon: XCircleIcon,
          description: "This week",
          color: "text-red-600",
          bgColor: "bg-red-50"
        }
      ]);
      setPendingApplications([
        {
          id: "APP001",
          studentName: "John Doe",
          type: "Medical Leave",
          startDate: "2024-01-15",
          endDate: "2024-01-17",
          days: 3,
          reason: "Doctor appointment"
        },
        {
          id: "APP002",
          studentName: "Jane Smith",
          type: "Personal Leave",
          startDate: "2024-01-20",
          endDate: "2024-01-22",
          days: 3,
          reason: "Family function"
        },
        {
          id: "APP003",
          studentName: "Mike Johnson",
          type: "Academic Leave",
          startDate: "2024-01-25",
          endDate: "2024-01-26",
          days: 2,
          reason: "Conference attendance"
        }
      ]);
      setQuickActions([
        {
          title: "Review Applications",
          description: "Process pending requests",
          icon: EyeIcon,
          href: "/view-applications",
          color: "text-blue-600",
          bgColor: "bg-blue-50 hover:bg-blue-100"
        },
        {
          title: "Student List",
          description: "View all students",
          icon: UsersIcon,
          href: "/students",
          color: "text-green-600",
          bgColor: "bg-green-50 hover:bg-green-100"
        },
        {
          title: "Reports",
          description: "Generate reports",
          icon: BarChart3Icon,
          href: "/reports",
          color: "text-purple-600",
          bgColor: "bg-purple-50 hover:bg-purple-100"
        }
      ]);
      setLoading(false);
    }, 900);
  }, []);

  return { loading, stats, pendingApplications, quickActions };
};

const FacultyDashboard = () => {
  const { loading, stats, pendingApplications, quickActions } = useFacultyDashboardData();

  // Debug logs to check icon values
  console.log("Stats icons:", stats.map(s => s.icon));
  console.log("QuickActions icons:", quickActions.map(q => q.icon));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage student leave applications and track approvals.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/view-applications">
            <EyeIcon className="h-4 w-4 mr-2" />
            Review Applications
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg" />
            ))
          : stats.map((stat, index) => (
              <DashboardStatCard
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bgColor}
              />
            ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-base font-semibold">Pending Applications</h2>
              <p className="text-sm text-gray-500">Applications awaiting your review</p>
            </div>
            <div className="p-4 space-y-2">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 h-14 rounded-lg" />
                  ))
                : pendingApplications.map((app) => (
                    <DashboardApplicationRow
                      key={app.id}
                      leftIcon={
                        <div className="p-1.5 rounded-lg bg-yellow-100">
                          <AlertTriangleIcon className="h-3.5 w-3.5 text-yellow-600" />
                        </div>
                      }
                      mainInfo={
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{app.studentName}</p>
                          <p className="text-xs text-gray-500">
                            {app.type} • {app.startDate} - {app.endDate} ({app.days} days)
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{app.reason}</p>
                        </div>
                      }
                      rightSection={
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          Review
                        </Button>
                      }
                    />
                  ))}
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" size="sm" asChild className="w-full text-xs">
                <Link to="/view-applications">View All Pending</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-base font-semibold">Quick Actions</h2>
              <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
            </div>
            <div className="p-4 space-y-2">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 h-14 rounded-lg" />
                  ))
                : quickActions.map((action, index) => (
                    <DashboardQuickAction
                      key={index}
                      title={action.title}
                      description={action.description}
                      icon={action.icon}
                      href={action.href}
                      color={action.color}
                      bgColor={action.bgColor}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
