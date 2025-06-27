import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ApplicationProvider } from "./context/ApplicationContext";
import { NotificationProvider } from "./context/NotificationContext";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import HODDashboard from "./pages/HODDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import LeaveApplication from "./pages/LeaveApplication";
import ViewApplications from "./pages/ViewApplications";
import Status from "./pages/Status";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Notifications from "./pages/Notifications";
import DepartmentOverview from "./pages/DepartmentOverview";
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AcademicCalendar from "./pages/AcademicCalendar";
import StudentApplicationsPage from "./pages/StudentApplicationsPage";
import StudentLeaveHistoryPage from "./pages/StudentLeaveHistoryPage";

const queryClient = new QueryClient();

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard
    return <Navigate to={`/${user.role}-dashboard`} replace />;
  }
  
  return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/login" element={
          isAuthenticated 
            ? <Navigate to={`/${user?.role}-dashboard`} replace /> 
            : <PageTransition><Login /></PageTransition>
        } />
        <Route path="/register" element={
          isAuthenticated 
            ? <Navigate to={`/${user?.role}-dashboard`} replace /> 
            : <PageTransition><Register /></PageTransition>
        } />
        <Route path="/forgot-password" element={
          <PageTransition>
            <ForgotPassword />
          </PageTransition>
        } />
        
        {/* Student Routes */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <StudentDashboard />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/apply-leave" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <LeaveApplication />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/my-applications" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <StudentApplicationsPage />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/leave-history" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <StudentLeaveHistoryPage />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/profile" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/academic-calendar" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <AcademicCalendar />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/notifications" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <Notifications />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/settings" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <Settings />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard/help" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Layout>
              <PageTransition>
                <Help />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Faculty Routes */}
        <Route path="/faculty-dashboard" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <FacultyDashboard />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/review-applications" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <ViewApplications />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/my-students" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/leave-statistics" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/profile" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/department-info" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/notifications" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <Notifications />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/settings" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <Settings />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/help" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Layout>
              <PageTransition>
                <Help />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* HOD Routes */}
        <Route path="/hod-dashboard" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <HODDashboard />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/department-applications" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <ViewApplications />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/faculty-management" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/student-overview" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/department-reports" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/leave-analytics" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/profile" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/department-settings" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <Settings />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/notifications" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <Notifications />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/hod-dashboard/help" element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <Layout>
              <PageTransition>
                <Help />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Principal Routes */}
        <Route path="/principal-dashboard" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <PrincipalDashboard />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/all-applications" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <ViewApplications />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/department-overview" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <DepartmentOverview />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/faculty-management" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/institution-reports" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/academic-calendar" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/system-analytics" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/profile" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/institution-settings" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <Settings />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/notifications" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <Notifications />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/principal-dashboard/help" element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <Layout>
              <PageTransition>
                <Help />
              </PageTransition>
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Footer Links */}
        <Route path="/privacy-policy" element={
          <PageTransition>
            <PrivacyPolicy />
          </PageTransition>
        } />
        <Route path="/terms-of-service" element={
          <PageTransition>
            <TermsOfService />
          </PageTransition>
        } />
        <Route path="/pricing" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/about" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/cookie-policy" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/security" element={<PageTransition><NotFound /></PageTransition>} />
        
        <Route path="*" element={
          <PageTransition>
            <NotFound />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <ApplicationProvider>
              <ScrollToTop />
              <AppRoutes />
              <Toaster />
              <Sonner />
            </ApplicationProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
