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
import DoctorPatientProfile from "@/pages/doctor/DoctorPatientProfile";
import DoctorIPDPatientProfile from "@/pages/doctor/DoctorIPDPatientProfile";
import DoctorConsultation from "@/pages/doctor/DoctorConsultation";
import DoctorRadiology from "@/pages/doctor/DoctorRadiology";

// Nurse pages
import NurseDashboard from "@/pages/nurse/NurseDashboard";
import NurseWard from "@/pages/nurse/NurseWard";
import NurseAdmissions from "@/pages/nurse/NurseAdmissions";
import NurseTasks from "@/pages/nurse/NurseTasks";
import NurseMedications from "@/pages/nurse/NurseMedications";
import NurseVitals from "@/pages/nurse/NurseVitals";
import NurseDischarge from "@/pages/nurse/NurseDischarge";
import NurseReports from "@/pages/nurse/NurseReports";

// Reception pages
import ReceptionDashboard from "@/pages/reception/ReceptionDashboard";
import ReceptionRegistration from "@/pages/reception/ReceptionRegistration";
import ReceptionAppointments from "@/pages/reception/ReceptionAppointments";
import ReceptionCheckIn from "@/pages/reception/ReceptionCheckIn";
import ReceptionQueue from "@/pages/reception/ReceptionQueue";
import ReceptionBilling from "@/pages/reception/ReceptionBilling";
import ReceptionBeds from "@/pages/reception/ReceptionBeds";
import ReceptionIPD from "@/pages/reception/ReceptionIPD";

// Lab pages
import LabDashboard from "@/pages/lab/LabDashboard";
import LabWorklist from "@/pages/lab/LabWorklist";
import LabSamples from "@/pages/lab/LabSamples";
import LabEntry from "@/pages/lab/LabEntry";
import LabVerification from "@/pages/lab/LabVerification";
import LabReports from "@/pages/lab/LabReports";

// Pharmacy pages
import PharmacyDashboard from "@/pages/pharmacy/PharmacyDashboard";
import PharmacyPrescriptions from "@/pages/pharmacy/PharmacyPrescriptions";
import PharmacyInventory from "@/pages/pharmacy/PharmacyInventory";
import PharmacyDrugs from "@/pages/pharmacy/PharmacyDrugs";
import PharmacyBilling from "@/pages/pharmacy/PharmacyBilling";
import PharmacySuppliers from "@/pages/pharmacy/PharmacySuppliers";
import PharmacyPurchase from "@/pages/pharmacy/PharmacyPurchase";
import PharmacyQueries from "@/pages/pharmacy/PharmacyQueries";

const queryClient = new QueryClient();

const DOCTOR_PAGES: Record<string, React.ComponentType> = {
  '/doctor': DoctorDashboard,
  '/doctor/patients': DoctorPatients,
  '/doctor/queue': DoctorQueue,
  '/doctor/schedule': DoctorSchedule,
  '/doctor/labs': DoctorLabs,
  '/doctor/radiology': DoctorRadiology,
  '/doctor/ipd': DoctorIPD,
  '/doctor/analytics': DoctorAnalytics,
};

const NURSE_PAGES: Record<string, React.ComponentType> = {
  '/nurse': NurseDashboard,
  '/nurse/ward': NurseWard,
  '/nurse/admissions': NurseAdmissions,
  '/nurse/tasks': NurseTasks,
  '/nurse/medications': NurseMedications,
  '/nurse/vitals': NurseVitals,
  '/nurse/discharge': NurseDischarge,
  '/nurse/reports': NurseReports,
};

const RECEPTION_PAGES: Record<string, React.ComponentType> = {
  '/reception': ReceptionDashboard,
  '/reception/registration': ReceptionRegistration,
  '/reception/appointments': ReceptionAppointments,
  '/reception/checkin': ReceptionCheckIn,
  '/reception/queue': ReceptionQueue,
  '/reception/billing': ReceptionBilling,
  '/reception/beds': ReceptionBeds,
  '/reception/ipd': ReceptionIPD,
};

const LAB_PAGES: Record<string, React.ComponentType> = {
  '/lab': LabDashboard,
  '/lab/worklist': LabWorklist,
  '/lab/samples': LabSamples,
  '/lab/entry': LabEntry,
  '/lab/verification': LabVerification,
  '/lab/reports': LabReports,
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
      <Route path="/doctor/patients/:patientId" element={<AppLayout><DoctorPatientProfile /></AppLayout>} />
      <Route path="/doctor/ipd/:patientId" element={<AppLayout><DoctorIPDPatientProfile /></AppLayout>} />
      <Route path="/doctor/consultation/:patientId" element={<AppLayout><DoctorConsultation /></AppLayout>} />

      {/* Nurse routes — fully built */}
      {Object.entries(NURSE_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* Reception routes — fully built */}
      {Object.entries(RECEPTION_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* Lab routes — fully built */}
      {Object.entries(LAB_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* Dashboard route for other roles */}
      {user.role !== 'doctor' && user.role !== 'receptionist' && user.role !== 'nurse' && user.role !== 'lab_technician' && (
        <Route path={basePath} element={
          <AppLayout><DashboardPage /></AppLayout>
        } />
      )}

      {/* All other role tabs as placeholders */}
      {tabs
        .filter(t => t.key !== 'dashboard')
        .filter(t => !DOCTOR_PAGES[t.path] && !RECEPTION_PAGES[t.path] && !NURSE_PAGES[t.path] && !LAB_PAGES[t.path])
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
