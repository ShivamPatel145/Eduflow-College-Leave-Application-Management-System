import { useAuth } from "@/context/AuthContext";
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
  UserIcon 
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "./Logo";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  to,
  active = false,
  onClick,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-cams-100 text-cams-900 font-medium"
          : "text-muted-foreground hover:bg-cams-50 hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

interface SidebarNavProps {
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
  }[];
  pathname: string;
  onItemClick?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  items,
  pathname,
  onItemClick,
}) => {
  return (
    <nav className="grid gap-1">
      {items.map((item) => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.title}
          to={item.href}
          active={pathname === item.href}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};

const getRoleNavItems = (role: UserRole) => {
  const baseItems = [
    {
      title: "Dashboard",
      href: `/${role}-dashboard`,
      icon: HomeIcon,
    },
  ];

  switch (role) {
    case "student":
      return [
        ...baseItems,
        {
          title: "Apply for Leave",
          href: "/leave-application",
          icon: FileTextIcon,
        },
        {
          title: "Application Status",
          href: "/status",
          icon: CalendarIcon,
        },
      ];
    case "faculty":
      return [
        ...baseItems,
        {
          title: "Student Applications",
          href: "/view-applications",
          icon: FileTextIcon,
        },
      ];
    case "hod":
      return [
        ...baseItems,
        {
          title: "Department Applications",
          href: "/view-applications",
          icon: FileTextIcon,
        },
        {
          title: "Faculty Applications",
          href: "/faculty-applications",
          icon: UsersIcon,
        },
      ];
    case "principal":
      return [
        ...baseItems,
        {
          title: "All Applications",
          href: "/view-applications",
          icon: FileTextIcon,
        },
        {
          title: "Department Overview",
          href: "/department-overview",
          icon: UsersIcon,
        },
      ];
    default:
      return baseItems;
  }
};

// Common items for all roles
const getCommonNavItems = () => [
  {
    title: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: BellIcon,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircleIcon,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = window.location.pathname;

  if (!user) {
    return <>{children}</>;
  }

  const roleNavItems = getRoleNavItems(user.role);
  const commonNavItems = getCommonNavItems();
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col px-4">
          <div className="flex h-14 items-center border-b">
            <Logo />
          </div>
          <div className="flex-1 overflow-auto py-4">
            <div className="mb-6">
              <h2 className="px-3 text-xs font-semibold text-muted-foreground mb-2">
                MAIN MENU
              </h2>
              <SidebarNav
                items={roleNavItems}
                pathname={pathname}
                onItemClick={closeMobileMenu}
              />
            </div>
            <div className="mb-6">
              <h2 className="px-3 text-xs font-semibold text-muted-foreground mb-2">
                GENERAL
              </h2>
              <SidebarNav
                items={commonNavItems}
                pathname={pathname}
                onItemClick={closeMobileMenu}
              />
            </div>
          </div>
          <div className="mt-auto border-t py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                title="Logout"
                aria-label="Logout"
              >
                <LogOutIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          <div className="flex w-full items-center justify-between">
            <div className="lg:hidden">
              <span className="font-semibold capitalize">
                {pathname === "/" ? "Home" : pathname.substring(1).replace(/-/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/notifications" className="lg:hidden">
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
              <span className="hidden text-sm text-muted-foreground lg:block">
                {user.name} • <span className="capitalize">{user.role}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 md:py-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
