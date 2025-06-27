import React, { useEffect, useState } from "react";
import {
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  Sun,
  Moon,
  BellIcon,
  UserIcon
} from "lucide-react";
import { DashboardStatCard } from "@/components/ui/DashboardStatCard";
import { DashboardQuickAction } from "@/components/ui/DashboardQuickAction";
import { DashboardApplicationRow } from "@/components/ui/DashboardApplicationRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const useStudentDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStats([
        {
          title: "Total Applications",
          value: "12",
          icon: FileTextIcon,
          description: "This semester",
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          title: "Approved",
          value: "8",
          icon: CheckCircleIcon,
          description: "66.7% success rate",
          color: "text-green-600",
          bgColor: "bg-green-50"
        },
        {
          title: "Pending",
          value: "3",
          icon: ClockIcon,
          description: "Under review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50"
        },
        {
          title: "Rejected",
          value: "1",
          icon: XCircleIcon,
          description: "8.3% rejection rate",
          color: "text-red-600",
          bgColor: "bg-red-50"
        }
      ]);
      setRecentApplications([
        {
          id: "APP001",
          type: "Medical Leave",
          startDate: "2024-01-15",
          endDate: "2024-01-17",
          status: "approved",
          days: 3
        },
        {
          id: "APP002",
          type: "Personal Leave",
          startDate: "2024-01-20",
          endDate: "2024-01-22",
          status: "pending",
          days: 3
        },
        {
          id: "APP003",
          type: "Academic Leave",
          startDate: "2024-01-25",
          endDate: "2024-01-26",
          status: "rejected",
          days: 2
        }
      ]);
      setQuickActions([
        {
          title: "Apply for Leave",
          description: "Submit a new leave application",
          icon: PlusIcon,
          href: "/student-dashboard/apply-leave",
          color: "text-blue-600",
          bgColor: "bg-blue-50 hover:bg-blue-100"
        },
        {
          title: "View Status",
          description: "Check your application status",
          icon: EyeIcon,
          href: "/student-dashboard/my-applications",
          color: "text-green-600",
          bgColor: "bg-green-50 hover:bg-green-100"
        },
        {
          title: "Leave History",
          description: "View all your past applications",
          icon: CalendarIcon,
          href: "/student-dashboard/leave-history",
          color: "text-purple-600",
          bgColor: "bg-purple-50 hover:bg-purple-100"
        }
      ]);
      setLoading(false);
    }, 0);
  }, []);

  return { loading, stats, recentApplications, quickActions };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const StudentDashboard = () => {
  const { loading, stats, recentApplications, quickActions } = useStudentDashboardData();
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  console.log("Student Stats icons:", stats.map(s => s.icon));
  console.log("Student QuickActions icons:", quickActions.map(q => q.icon));

  return (
    <motion.div
      className="space-y-5 bg-gray-50 dark:bg-zinc-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome back! Here's your leave application overview.</p>
        </div>
        <Button size="sm" onClick={() => navigate("/student-dashboard/apply-leave")}> 
          <PlusIcon className="h-4 w-4 mr-2" />
          Apply for Leave
        </Button>
      </div>
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12
            }
          }
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-zinc-800 h-24 rounded-lg" />
            ))
          : stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
              >
                <DashboardStatCard
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  icon={stat.icon}
                  color={stat.color}
                  bgColor={stat.bgColor}
                />
              </motion.div>
            ))}
      </motion.div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Applications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your latest leave applications and their status</p>
            </div>
            <div className="p-4 space-y-2">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 dark:bg-zinc-800 h-14 rounded-lg" />
                  ))
                : recentApplications.map((app) => (
                    <DashboardApplicationRow
                      key={app.id}
                      leftIcon={
                        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800">
                          <CalendarIcon className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                        </div>
                      }
                      mainInfo={
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{app.type}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {app.startDate} - {app.endDate} ({app.days} days)
                          </p>
                        </div>
                      }
                      rightSection={
                        <>
                          {getStatusBadge(app.status)}
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            View
                          </Button>
                        </>
                      }
                    />
                  ))}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
              <Button variant="outline" size="sm" asChild className="w-full text-xs">
                <Link to="/student-dashboard/my-applications">View All Applications</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Common tasks and shortcuts</p>
            </div>
            <div className="p-4 space-y-2">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 dark:bg-zinc-800 h-14 rounded-lg" />
                  ))
                : quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <DashboardQuickAction
                        title={action.title}
                        description={action.description}
                        icon={action.icon}
                        href={action.href}
                        color={action.color}
                        bgColor={action.bgColor}
                      />
                    </motion.div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;