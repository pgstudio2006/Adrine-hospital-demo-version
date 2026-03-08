import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { NAV_ITEMS } from "@/config/navigation";
import NotFound from "./pages/NotFound";
import {
  Users, CalendarDays, Stethoscope, Building2, BedDouble,
  Scissors, Heart, FlaskConical, ScanLine, Pill, Package,
  CreditCard, TrendingUp, ShieldCheck, BarChart3, Settings
} from "lucide-react";

const queryClient = new QueryClient();

const MODULE_META: Record<string, { icon: React.ComponentType<{className?: string}>; desc: string }> = {
  patients: { icon: Users, desc: 'Patient registration, 360° view, family linking, and vital trends' },
  appointments: { icon: CalendarDays, desc: 'Calendar scheduling, token generation, and queue management' },
  opd: { icon: Stethoscope, desc: 'OPD queue, AI voice scribe, digital prescriptions, and SOAP notes' },
  ipd: { icon: Building2, desc: 'Admissions, daily progress notes, and discharge summary builder' },
  bed_management: { icon: BedDouble, desc: 'Live bed matrix, room shifting, and occupancy tracking' },
  ot_management: { icon: Scissors, desc: 'OT scheduling, surgical checklists, and pre/post-op notes' },
  nursing: { icon: Heart, desc: 'Vitals dashboard, nursing tasks, shift handover, and MAR' },
  laboratory: { icon: FlaskConical, desc: 'Central worklist, barcode samples, and critical alerts' },
  radiology: { icon: ScanLine, desc: 'Modality worklist, reporting templates, and PACS integration' },
  pharmacy: { icon: Pill, desc: 'Digital prescription queue, dispensing, and substitute suggestions' },
  inventory: { icon: Package, desc: 'Batch tracking, stock alerts, purchase orders, and GRN' },
  billing: { icon: CreditCard, desc: 'Unified billing, multi-mode payments, and IPD estimates' },
  revenue: { icon: TrendingUp, desc: 'Live revenue dashboard, department breakdowns, and doctor shares' },
  insurance: { icon: ShieldCheck, desc: 'Cashless workflow, pre-authorization, and document vault' },
  reports: { icon: BarChart3, desc: 'Analytics, catchment analysis, and audit trails' },
  settings: { icon: Settings, desc: 'RBAC configuration, master data, and system administration' },
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      
      {/* All dashboard routes wrapped in layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute module="dashboard">
          <DashboardLayout><DashboardPage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {NAV_ITEMS.filter(i => i.key !== 'dashboard').map(item => {
        const meta = MODULE_META[item.key];
        return (
          <Route key={item.key} path={item.path} element={
            <ProtectedRoute module={item.key}>
              <DashboardLayout>
                <ModulePlaceholder
                  moduleKey={item.key}
                  title={item.label}
                  description={meta?.desc ?? ''}
                  icon={meta?.icon ?? item.icon}
                />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        );
      })}

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
