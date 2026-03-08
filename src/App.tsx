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

const queryClient = new QueryClient();

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

      {/* Dashboard route for each role */}
      <Route path={basePath} element={
        <AppLayout><DashboardPage /></AppLayout>
      } />

      {/* All other role tabs as placeholders for now */}
      {tabs.filter(t => t.key !== 'dashboard').map(tab => (
        <Route key={tab.key} path={tab.path} element={
          <AppLayout>
            <RolePlaceholder title={tab.label} />
          </AppLayout>
        } />
      ))}

      {/* Legacy routes redirect to role base */}
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
