import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AppLayout from "@/components/AppLayout";
import RolePlaceholder from "@/components/RolePlaceholder";
import { ROLE_TABS, ROLE_BASE_PATH } from "@/config/roleNavigation";
import NotFound from "./pages/NotFound";

// Doctor pages
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorPatients from "@/pages/doctor/DoctorPatients";
import DoctorQueue from "@/pages/doctor/DoctorQueue";
import DoctorSchedule from "@/pages/doctor/DoctorSchedule";
import DoctorLabs from "@/pages/doctor/DoctorLabs";
import DoctorIPD from "@/pages/doctor/DoctorIPD";
import DoctorAnalytics from "@/pages/doctor/DoctorAnalytics";

const queryClient = new QueryClient();

const DOCTOR_PAGES: Record<string, React.ComponentType> = {
  '/doctor': DoctorDashboard,
  '/doctor/patients': DoctorPatients,
  '/doctor/queue': DoctorQueue,
  '/doctor/schedule': DoctorSchedule,
  '/doctor/labs': DoctorLabs,
  '/doctor/ipd': DoctorIPD,
  '/doctor/analytics': DoctorAnalytics,
};

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const basePath = ROLE_BASE_PATH[user.role];
  const tabs = ROLE_TABS[user.role];

  return (
    <Routes>
      <Route path="/" element={<Navigate to={basePath} replace />} />

      {/* Doctor routes — fully built */}
      {Object.entries(DOCTOR_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* Dashboard route for non-doctor roles */}
      {user.role !== 'doctor' && (
        <Route path={basePath} element={
          <AppLayout><DashboardPage /></AppLayout>
        } />
      )}

      {/* All other role tabs as placeholders */}
      {tabs
        .filter(t => t.key !== 'dashboard')
        .filter(t => !DOCTOR_PAGES[t.path])
        .map(tab => (
          <Route key={tab.key} path={tab.path} element={
            <AppLayout>
              <RolePlaceholder title={tab.label} />
            </AppLayout>
          } />
        ))}

      {/* Legacy routes */}
      <Route path="/dashboard" element={<Navigate to={basePath} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
