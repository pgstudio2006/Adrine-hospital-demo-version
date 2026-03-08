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

// Radiology pages
import RadiologyDashboard from "@/pages/radiology/RadiologyDashboard";
import RadiologyOrders from "@/pages/radiology/RadiologyOrders";
import RadiologyWorklist from "@/pages/radiology/RadiologyWorklist";
import RadiologyReports from "@/pages/radiology/RadiologyReports";
import RadiologySettings from "@/pages/radiology/RadiologySettings";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminStaff from "@/pages/admin/AdminStaff";
import AdminDepartments from "@/pages/admin/AdminDepartments";
import AdminFinance from "@/pages/admin/AdminFinance";
import AdminExpenses from "@/pages/admin/AdminExpenses";
import AdminApprovals from "@/pages/admin/AdminApprovals";
import AdminClaims from "@/pages/admin/AdminClaims";
import AdminMRD from "@/pages/admin/AdminMRD";
import AdminMIS from "@/pages/admin/AdminMIS";
import AdminAudit from "@/pages/admin/AdminAudit";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminGeoIntelligence from "@/pages/admin/AdminGeoIntelligence";

// Billing pages
import BillingDashboard from "@/pages/billing/BillingDashboard";
import BillingInvoices from "@/pages/billing/BillingInvoices";
import BillingPayments from "@/pages/billing/BillingPayments";
import BillingIPD from "@/pages/billing/BillingIPD";
import BillingPackages from "@/pages/billing/BillingPackages";
import BillingRevenue from "@/pages/billing/BillingRevenue";
import BillingInsurance from "@/pages/billing/BillingInsurance";
import BillingFinance from "@/pages/billing/BillingFinance";
import BillingReports from "@/pages/billing/BillingReports";

// OT pages
import OTDashboard from "@/pages/ot/OTDashboard";
import OTSchedule from "@/pages/ot/OTSchedule";
import OTRooms from "@/pages/ot/OTRooms";
import OTTeams from "@/pages/ot/OTTeams";
import OTPreOp from "@/pages/ot/OTPreOp";
import OTIntraOp from "@/pages/ot/OTIntraOp";
import OTPostOp from "@/pages/ot/OTPostOp";
import OTInventory from "@/pages/ot/OTInventory";
import OTReports from "@/pages/ot/OTReports";
import OTAnalytics from "@/pages/ot/OTAnalytics";

const queryClient = new QueryClient();

const ADMIN_PAGES: Record<string, React.ComponentType> = {
  '/admin': AdminDashboard,
  '/admin/staff': AdminStaff,
  '/admin/departments': AdminDepartments,
  '/admin/finance': AdminFinance,
  '/admin/expenses': AdminExpenses,
  '/admin/approvals': AdminApprovals,
  '/admin/claims': AdminClaims,
  '/admin/mrd': AdminMRD,
  '/admin/mis': AdminMIS,
  '/admin/audit': AdminAudit,
  '/admin/settings': AdminSettings,
};

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

const PHARMACY_PAGES: Record<string, React.ComponentType> = {
  '/pharmacy': PharmacyDashboard,
  '/pharmacy/prescriptions': PharmacyPrescriptions,
  '/pharmacy/inventory': PharmacyInventory,
  '/pharmacy/drugs': PharmacyDrugs,
  '/pharmacy/billing': PharmacyBilling,
  '/pharmacy/suppliers': PharmacySuppliers,
  '/pharmacy/purchase': PharmacyPurchase,
  '/pharmacy/queries': PharmacyQueries,
};

const RADIOLOGY_PAGES: Record<string, React.ComponentType> = {
  '/radiology': RadiologyDashboard,
  '/radiology/orders': RadiologyOrders,
  '/radiology/worklist': RadiologyWorklist,
  '/radiology/reports': RadiologyReports,
  '/radiology/settings': RadiologySettings,
};

const BILLING_PAGES: Record<string, React.ComponentType> = {
  '/billing-dept': BillingDashboard,
  '/billing-dept/invoices': BillingInvoices,
  '/billing-dept/payments': BillingPayments,
  '/billing-dept/ipd-billing': BillingIPD,
  '/billing-dept/packages': BillingPackages,
  '/billing-dept/revenue': BillingRevenue,
  '/billing-dept/insurance': BillingInsurance,
  '/billing-dept/finance': BillingFinance,
  '/billing-dept/reports': BillingReports,
};

const OT_PAGES: Record<string, React.ComponentType> = {
  '/ot': OTDashboard,
  '/ot/schedule': OTSchedule,
  '/ot/rooms': OTRooms,
  '/ot/teams': OTTeams,
  '/ot/preop': OTPreOp,
  '/ot/intraop': OTIntraOp,
  '/ot/postop': OTPostOp,
  '/ot/inventory': OTInventory,
  '/ot/reports': OTReports,
  '/ot/analytics': OTAnalytics,
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

      {/* Admin routes — fully built */}
      {Object.entries(ADMIN_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}
      <Route path="/admin/geo-intelligence" element={<AppLayout><AdminGeoIntelligence /></AppLayout>} />


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

      {/* Pharmacy routes — fully built */}
      {Object.entries(PHARMACY_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* Radiology routes — fully built */}
      {Object.entries(RADIOLOGY_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* Billing routes — fully built */}
      {Object.entries(BILLING_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* OT routes — fully built */}
      {Object.entries(OT_PAGES).map(([path, Component]) => (
        <Route key={path} path={path} element={
          <AppLayout><Component /></AppLayout>
        } />
      ))}

      {/* Dashboard route for other roles */}
      {user.role !== 'doctor' && user.role !== 'receptionist' && user.role !== 'nurse' && user.role !== 'lab_technician' && user.role !== 'pharmacist' && user.role !== 'radiologist' && user.role !== 'billing' && user.role !== 'admin' && user.role !== 'ot_coordinator' && (
        <Route path={basePath} element={
          <AppLayout><DashboardPage /></AppLayout>
        } />
      )}

      {/* All other role tabs as placeholders */}
      {tabs
        .filter(t => t.key !== 'dashboard')
        .filter(t => !ADMIN_PAGES[t.path] && !DOCTOR_PAGES[t.path] && !RECEPTION_PAGES[t.path] && !NURSE_PAGES[t.path] && !LAB_PAGES[t.path] && !PHARMACY_PAGES[t.path] && !RADIOLOGY_PAGES[t.path] && !BILLING_PAGES[t.path] && !OT_PAGES[t.path])
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
