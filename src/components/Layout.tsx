import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { 
  CalendarIcon, 
  HomeIcon, 
  LogOutIcon, 
  MenuIcon, 
  FileTextIcon, 
  UsersIcon,
  BellIcon, 
  HelpCircleIcon, 
  UserIcon,
  SettingsIcon,
  SearchIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import Logo from "./Logo";
import { useTheme } from "@/context/ThemeContext";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  to,
  active = false,
  onClick,
  badge,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative overflow-hidden",
        active
          ? "bg-primary text-white dark:bg-primary dark:text-gray-100 border-l-4 border-primary shadow-md"
          : "text-gray-700 dark:text-gray-100 hover:bg-primary/10 hover:text-primary dark:hover:text-primary focus:bg-primary/20 focus:text-primary dark:focus:text-primary"
      )}
      onClick={onClick}
      style={{ minHeight: 40 }}
    >
      {/* Icon */}
      <Icon className={cn(
        "h-5 w-5 flex-shrink-0 relative z-10 transition-transform duration-150",
        active ? "text-white dark:text-gray-100" : "text-gray-400 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary"
      )} />
      {/* Content */}
      <span className="flex-1 truncate relative z-10 font-medium">{label}</span>
      {/* Badge */}
      {badge && (
        <Badge 
          variant={active ? "secondary" : "default"} 
          className={cn(
            "ml-auto text-xs font-semibold px-2 py-0.5 relative z-10 transition-all duration-150",
            active 
              ? "bg-white/20 text-white dark:bg-white/20 dark:text-gray-100 border-white/30 dark:border-white/30 shadow-sm" 
              : "bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary border-primary/20 dark:border-primary/20 group-hover:bg-primary/15 group-hover:scale-105"
          )}
        >
          {badge}
        </Badge>
      )}
    </Link>
  );
};

interface SidebarNavProps {
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
  pathname: string;
  onItemClick?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  items,
  pathname,
  onItemClick,
}) => {
  // Separate items into sections
  const mainItems = items.slice(0, 4); // Dashboard + main features
  const secondaryItems = items.slice(4, -3); // Additional features
  const utilityItems = items.slice(-3); // Profile, Notifications, Settings, Help

  return (
    <nav className="space-y-4">
      {/* Main Navigation */}
      <div className="space-y-1">
        {mainItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.title}
            to={item.href}
            active={pathname === item.href}
            onClick={onItemClick}
            badge={item.badge}
          />
        ))}
      </div>
      {/* Secondary Navigation */}
      {secondaryItems.length > 0 && (
        <>
          <div className="px-3">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.title}
                to={item.href}
                active={pathname === item.href}
                onClick={onItemClick}
                badge={item.badge}
              />
            ))}
          </div>
        </>
      )}
      {/* Utility Navigation */}
      <div className="px-3">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      <div className="space-y-1">
        {utilityItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.title}
            to={item.href}
            active={pathname === item.href}
            onClick={onItemClick}
            badge={item.badge}
          />
        ))}
      </div>
    </nav>
  );
};

const getRoleNavItems = (role: UserRole, unreadCount: number) => {
  const dashboardRoute = `/${role}-dashboard`;
  
  const baseItems = [
    {
      title: "Dashboard",
      href: dashboardRoute,
      icon: HomeIcon,
    },
  ];

  switch (role) {
    case "student":
      return [
        ...baseItems,
        {
          title: "Apply Leave",
          href: `${dashboardRoute}/apply-leave`,
          icon: FileTextIcon,
        },
        {
          title: "My Applications",
          href: `${dashboardRoute}/my-applications`,
          icon: CalendarIcon,
        },
        {
          title: "Leave History",
          href: `${dashboardRoute}/leave-history`,
          icon: CalendarIcon,
        },
        {
          title: "Academic Calendar",
          href: `${dashboardRoute}/academic-calendar`,
          icon: CalendarIcon,
        },
        {
          title: "Profile",
          href: `${dashboardRoute}/profile`,
          icon: UserIcon,
        },
        {
          title: "Notifications",
          href: `${dashboardRoute}/notifications`,
          icon: BellIcon,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        },
        {
          title: "Settings",
          href: `${dashboardRoute}/settings`,
          icon: SettingsIcon,
        },
        {
          title: "Help & Support",
          href: `${dashboardRoute}/help`,
          icon: HelpCircleIcon,
        },
      ];
    case "faculty":
      return [
        ...baseItems,
        {
          title: "Review Applications",
          href: `${dashboardRoute}/review-applications`,
          icon: FileTextIcon,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        },
        {
          title: "My Students",
          href: `${dashboardRoute}/my-students`,
          icon: UsersIcon,
        },
        {
          title: "Leave Statistics",
          href: `${dashboardRoute}/leave-statistics`,
          icon: CalendarIcon,
        },
        {
          title: "Department Info",
          href: `${dashboardRoute}/department-info`,
          icon: UsersIcon,
        },
        {
          title: "Profile",
          href: `${dashboardRoute}/profile`,
          icon: UserIcon,
        },
        {
          title: "Notifications",
          href: `${dashboardRoute}/notifications`,
          icon: BellIcon,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        },
        {
          title: "Settings",
          href: `${dashboardRoute}/settings`,
          icon: SettingsIcon,
        },
        {
          title: "Help & Support",
          href: `${dashboardRoute}/help`,
          icon: HelpCircleIcon,
        },
      ];
    case "hod":
      return [
        ...baseItems,
        {
          title: "Department Applications",
          href: `${dashboardRoute}/department-applications`,
          icon: FileTextIcon,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        },
        {
          title: "Faculty Management",
          href: `${dashboardRoute}/faculty-management`,
          icon: UsersIcon,
        },
        {
          title: "Student Overview",
          href: `${dashboardRoute}/student-overview`,
          icon: UsersIcon,
        },
        {
          title: "Department Reports",
          href: `${dashboardRoute}/department-reports`,
          icon: FileTextIcon,
        },
        {
          title: "Leave Analytics",
          href: `${dashboardRoute}/leave-analytics`,
          icon: CalendarIcon,
        },
        {
          title: "Profile",
          href: `${dashboardRoute}/profile`,
          icon: UserIcon,
        },
        {
          title: "Notifications",
          href: `${dashboardRoute}/notifications`,
          icon: BellIcon,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        },
        {
          title: "Settings",
          href: `${dashboardRoute}/settings`,
          icon: SettingsIcon,
        },
        {
          title: "Help & Support",
          href: `${dashboardRoute}/help`,
          icon: HelpCircleIcon,
        },
      ];
    case "principal":
      return [
        ...baseItems,
        {
          title: "All Applications",
          href: `${dashboardRoute}/all-applications`,
          icon: FileTextIcon,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        },
        {
          title: "Department Overview",
          href: `${dashboardRoute}/department-overview`,
          icon: UsersIcon,
        },
        {
          title: "Faculty Management",
          href: `${dashboardRoute}/faculty-management`,
          icon: UsersIcon,
        },
        {
          title: "Institution Reports",
          href: `${dashboardRoute}/institution-reports`,
          icon: FileTextIcon,
        },
        {
          title: "System Analytics",
          href: `${dashboardRoute}/system-analytics`,
          icon: CalendarIcon,
        },
        {
          title: "Academic Calendar",
          href: `${dashboardRoute}/academic-calendar`,
          icon: CalendarIcon,
        },
        {
          title: "Profile",
          href: `${dashboardRoute}/profile`,
          icon: UserIcon,
        },
        {
          title: "Notifications",
          href: `${dashboardRoute}/notifications`,
          icon: BellIcon,
          badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        },
        {
          title: "Settings",
          href: `${dashboardRoute}/settings`,
          icon: SettingsIcon,
        },
        {
          title: "Help & Support",
          href: `${dashboardRoute}/help`,
          icon: HelpCircleIcon,
        },
      ];
    default:
      return baseItems;
  }
};

const getDashboardTitle = (role: UserRole) => {
  switch (role) {
    case "student":
      return "Student Dashboard";
    case "faculty":
      return "Faculty Dashboard";
    case "hod":
      return "HOD Dashboard";
    case "principal":
      return "Principal Dashboard";
    default:
      return "Dashboard";
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = location.pathname;
  const { isDark, setIsDark } = useTheme();

  if (!user) {
    return <>{children}</>;
  }

  const roleNavItems = getRoleNavItems(user.role, unreadCount);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const dashboardTitle = getDashboardTitle(user.role);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white/95 dark:bg-zinc-900 backdrop-blur-sm border-r border-gray-200 dark:border-zinc-800 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-white to-gray-50/30 dark:from-zinc-900 dark:to-zinc-900/80">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-zinc-800 px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
            <Logo />
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-auto py-6">
            <div className="px-4">
              <SidebarNav
                items={roleNavItems}
                pathname={pathname}
                onItemClick={closeMobileMenu}
              />
            </div>
          </div>
          
          {/* User Profile */}
          <div className="border-t border-gray-200 dark:border-zinc-800 p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                  <span className="text-sm font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 capitalize truncate">{user.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                title="Logout"
                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 transition-colors duration-200"
              >
                <LogOutIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-0">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-7 w-7"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
            {/* Dashboard title only */}
            <div className="flex-1">
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 lg:text-lg">
                {dashboardTitle}
              </h1>
            </div>
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 max-w-sm w-full">
              <div className="relative w-full">
                <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-300" />
                <Input
                  placeholder="Search..."
                  className="pl-8 h-8 text-sm bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <motion.button
                type="button"
                aria-label="Toggle theme"
                className="h-7 w-7 rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center"
                onClick={() => setIsDark((d) => !d)}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </motion.button>
              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative h-7 w-7">
                  <BellIcon className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              {/* User menu for desktop */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">{user.role}</p>
                </div>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
