import { UserRole } from '@/types/roles';

export interface RoleTab {
  key: string;
  label: string;
  path: string;
}

export const ROLE_TABS: Record<UserRole, RoleTab[]> = {
  admin: [
    { key: 'dashboard', label: 'Dashboard', path: '/admin' },
    { key: 'staff', label: 'Staff', path: '/admin/staff' },
    { key: 'departments', label: 'Departments', path: '/admin/departments' },
    { key: 'finance', label: 'Finance', path: '/admin/finance' },
    { key: 'expenses', label: 'Expenses', path: '/admin/expenses' },
    { key: 'approvals', label: 'Approvals', path: '/admin/approvals' },
    { key: 'claims', label: 'Claims', path: '/admin/claims' },
    { key: 'mrd', label: 'MRD', path: '/admin/mrd' },
    { key: 'mis', label: 'MIS Reports', path: '/admin/mis' },
    { key: 'audit', label: 'Audit', path: '/admin/audit' },
    { key: 'settings', label: 'Settings', path: '/admin/settings' },
  ],
  doctor: [
    { key: 'dashboard', label: 'Dashboard', path: '/doctor' },
    { key: 'patients', label: 'Patients', path: '/doctor/patients' },
    { key: 'queue', label: 'OPD Queue', path: '/doctor/queue' },
    { key: 'schedule', label: 'Schedule', path: '/doctor/schedule' },
    { key: 'labs', label: 'Labs', path: '/doctor/labs' },
    { key: 'radiology', label: 'Radiology', path: '/doctor/radiology' },
    { key: 'ipd', label: 'IPD', path: '/doctor/ipd' },
    { key: 'analytics', label: 'Analytics', path: '/doctor/analytics' },
  ],
  nurse: [
    { key: 'dashboard', label: 'Dashboard', path: '/nurse' },
    { key: 'ward', label: 'My Ward', path: '/nurse/ward' },
    { key: 'admissions', label: 'Admissions', path: '/nurse/admissions' },
    { key: 'tasks', label: 'Tasks', path: '/nurse/tasks' },
    { key: 'vitals', label: 'Vitals', path: '/nurse/vitals' },
    { key: 'discharge', label: 'Discharge', path: '/nurse/discharge' },
    { key: 'reports', label: 'Reports', path: '/nurse/reports' },
  ],
  receptionist: [
    { key: 'dashboard', label: 'Dashboard', path: '/reception' },
    { key: 'registration', label: 'Registration', path: '/reception/registration' },
    { key: 'appointments', label: 'Appointments', path: '/reception/appointments' },
    { key: 'checkin', label: 'Check-In', path: '/reception/checkin' },
    { key: 'queue', label: 'Queue', path: '/reception/queue' },
    { key: 'billing', label: 'Billing', path: '/reception/billing' },
    { key: 'beds', label: 'Beds', path: '/reception/beds' },
    { key: 'ipd', label: 'IPD', path: '/reception/ipd' },
  ],
  lab_technician: [
    { key: 'dashboard', label: 'Dashboard', path: '/lab' },
    { key: 'worklist', label: 'Worklist', path: '/lab/worklist' },
    { key: 'samples', label: 'Samples', path: '/lab/samples' },
    { key: 'entry', label: 'Test Entry', path: '/lab/entry' },
    { key: 'verification', label: 'Verification', path: '/lab/verification' },
    { key: 'reports', label: 'Reports', path: '/lab/reports' },
  ],
  pharmacist: [
    { key: 'dashboard', label: 'Dashboard', path: '/pharmacy' },
    { key: 'prescriptions', label: 'Prescriptions', path: '/pharmacy/prescriptions' },
    { key: 'inventory', label: 'Inventory', path: '/pharmacy/inventory' },
    { key: 'drugs', label: 'Drugs', path: '/pharmacy/drugs' },
    { key: 'billing', label: 'Billing', path: '/pharmacy/billing' },
    { key: 'suppliers', label: 'Suppliers', path: '/pharmacy/suppliers' },
    { key: 'purchase', label: 'Purchase Orders', path: '/pharmacy/purchase' },
    { key: 'queries', label: 'Queries', path: '/pharmacy/queries' },
  ],
  billing: [
    { key: 'dashboard', label: 'Dashboard', path: '/billing-dept' },
    { key: 'invoices', label: 'Invoices', path: '/billing-dept/invoices' },
    { key: 'payments', label: 'Payments', path: '/billing-dept/payments' },
    { key: 'revenue', label: 'Revenue', path: '/billing-dept/revenue' },
    { key: 'insurance', label: 'Insurance', path: '/billing-dept/insurance' },
    { key: 'reports', label: 'Reports', path: '/billing-dept/reports' },
  ],
  radiologist: [
    { key: 'dashboard', label: 'Dashboard', path: '/radiology' },
    { key: 'orders', label: 'Orders', path: '/radiology/orders' },
    { key: 'worklist', label: 'Worklist', path: '/radiology/worklist' },
    { key: 'reports', label: 'Reports', path: '/radiology/reports' },
    { key: 'settings', label: 'Settings', path: '/radiology/settings' },
  ],
};

export const ROLE_BASE_PATH: Record<UserRole, string> = {
  admin: '/admin',
  doctor: '/doctor',
  nurse: '/nurse',
  receptionist: '/reception',
  lab_technician: '/lab',
  pharmacist: '/pharmacy',
  billing: '/billing-dept',
  radiologist: '/radiology',
};
