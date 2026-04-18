import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

// ── Shared Types ──
export interface HospitalPatient {
  uhid: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  photoUrl?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  bloodGroup?: string;
  abhaId?: string;
  aadhaar?: string;
  category: 'general' | 'corporate' | 'insurance' | 'government' | 'vip';
  patientType: 'OPD' | 'IPD' | 'Emergency' | 'Maternity' | 'Newborn' | 'ICU' | 'Surgery' | 'Dialysis' | 'Trauma';
  registrationPatientType?: string;
  department?: string;
  assignedDoctor?: string;
  allergies?: string;
  chronicDiseases?: string;
  registeredOn: string;
  lastVisit?: string;
  branch: string;
  insuranceProvider?: string;
  policyNo?: string;
  tpaProvider?: string;
  tpaPolicyNo?: string;
  tpaPreAuthStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  referralSource?: string;
  referralDoctor?: string;
  referralHospital?: string;
  referralClinic?: string;
  isMLC?: boolean;
  mlcPoliceCase?: string;
  mlcReportingAuthority?: string;
  mlcIncidentDescription?: string;
  welcomeSmsSentAt?: string;
}

export type PatientJourneyType = HospitalPatient['patientType'];
export type PaymentMode = 'cash' | 'card' | 'upi' | 'cheque' | 'bank-transfer';

export interface EmergencyCase {
  id: string;
  uhid?: string;
  patientName: string;
  age?: number;
  gender?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  referralDoctor?: string;
  referralHospital?: string;
  mlcPoliceCase?: string;
  mlcReportingAuthority?: string;
  mlcIncidentDescription?: string;
  arrivalMode: 'Walk-in' | 'Ambulance' | 'Referral' | 'Transfer';
  complaint: string;
  vitals: string;
  triage: 'critical' | 'urgent' | 'semi-urgent' | 'non-urgent' | null;
  assignedNurse?: string;
  assignedDoctor?: string;
  mlcRequired: boolean;
  status: 'triage-pending' | 'triaged' | 'in-treatment' | 'transferred-ipd' | 'discharged';
  createdAt: string;
}

export type DoctorRoundStatus = 'pending' | 'seen' | 'follow-up-required';

export interface AdmissionCase {
  id: string;
  uhid: string;
  patientName: string;
  journeyType: PatientJourneyType;
  admissionSource: 'OPD' | 'Emergency' | 'Direct' | 'Maternity' | 'Surgery';
  ward: string;
  department?: string;
  room?: string;
  bed: string;
  attendingDoctor: string;
  consultantDoctors?: string[];
  assignedNurse?: string;
  roundingDoctor?: string;
  nextDoctorRoundAt?: string;
  primaryDiagnosis: string;
  currentTreatmentPlan?: string;
  nursingPriority: 'high' | 'medium' | 'low';
  doctorRoundStatus: DoctorRoundStatus;
  lastDoctorRoundAt?: string;
  status: 'admitted' | 'icu' | 'ot' | 'discharge-ready' | 'discharged';
  billingStage?: 'estimate' | 'interim' | 'finalized';
  finalBillDiscountAmount?: number;
  finalBillDiscountReason?: string;
  admittedAt: string;
  dischargeSummary?: string;
  dischargeReadyAt?: string;
  isIpLocked?: boolean;
  ipLockedAt?: string;
  ipLockReason?: string;
  ipUnlockedAt?: string;
  ipUnlockReason?: string;
  linkedEmergencyId?: string;
  linkedMotherUhid?: string;
}

export interface NursingRound {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  ward: string;
  bed: string;
  nurse: string;
  shift: 'Morning' | 'Evening' | 'Night';
  bp: string;
  pulse: number;
  temp: number;
  spo2: number;
  painScore: number;
  notes: string;
  recordedAt: string;
}

export interface DoctorProgressNote {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  doctor: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  followUpRequired: boolean;
  createdAt: string;
}

export interface AdmissionTask {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  task: string;
  assignedTo: string;
  createdBy: string;
  status: 'Pending' | 'Completed';
  createdAt: string;
  completedAt?: string;
}

export interface InpatientCareOrder {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  type: 'Procedure' | 'Diet';
  item: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  orderedBy: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  orderedAt: string;
}

export interface WardMedicineIssue {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  inventoryId: string;
  drug: string;
  batch: string;
  expiry: string;
  qty: number;
  issuedBy: string;
  issuedAt: string;
  administrationStatus: 'issued' | 'administered' | 'held';
}

export interface OTSurgeryRecord {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  procedureName: string;
  surgeon: string;
  anesthetist?: string;
  preOperativeNotes?: string;
  postOperativeNotes?: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledAt: string;
  updatedAt: string;
}

export interface RoomShiftRecord {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  fromWard: string;
  fromRoom?: string;
  fromBed: string;
  toWard: string;
  toRoom?: string;
  toBed: string;
  reason: string;
  shiftedBy: string;
  shiftedAt: string;
}

export interface DepartmentTransferRecord {
  id: string;
  admissionId: string;
  uhid: string;
  patientName: string;
  fromDepartment: string;
  toDepartment: string;
  reason: string;
  transferredBy: string;
  transferredAt: string;
}

export interface NotificationLog {
  id: string;
  type: 'sms';
  recipientType: 'patient' | 'doctor';
  recipient: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'failed';
  uhid?: string;
  admissionId?: string;
}

export interface HospitalAppointment {
  id: string;
  uhid: string;
  patientName: string;
  phone: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'checked-in' | 'in-consultation' | 'completed' | 'cancelled' | 'no-show';
  type: 'new' | 'follow-up' | 'teleconsultation';
  notes: string;
}

export interface QueueEntry {
  tokenNo: number;
  uhid: string;
  patientName: string;
  doctor: string;
  department: string;
  status: 'waiting' | 'called' | 'in-consultation' | 'completed' | 'skipped';
  appointmentId?: string;
  checkedInAt: string;
  complaint?: string;
}

export interface LabOrder {
  orderId: string;
  uhid: string;
  patientName: string;
  tests: string;
  category: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  doctor: string;
  orderTime: string;
  stage: 'Pending Analysis' | 'In Analysis' | 'Awaiting Validation' | 'Validated' | 'Reported';
  sampleStatus: 'Ordered' | 'Collected' | 'Received' | 'Processing' | 'Analysis Complete';
  results?: string;
  validatedBy?: string;
  reportedAt?: string;
  sampleId?: string;
  specimenType?: string;
  methodName?: string;
  interpretation?: string;
  comments?: string;
  criticalAlert?: boolean;
  authorizedBy?: string;
}

export interface PrescriptionOrder {
  id: string;
  uhid: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Pending' | 'Verified' | 'Dispensed' | 'Partially dispensed' | 'Cancelled';
  meds: {
    drug: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    qty: number;
    dispensed: number;
    status?: 'active' | 'stopped';
    startAt?: string;
    stopAt?: string;
  }[];
}

export interface RadiologyOrder {
  orderId: string;
  uhid: string;
  patientName: string;
  study: string;
  modality: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  doctor: string;
  orderTime: string;
  status: 'Ordered' | 'Scheduled' | 'In Progress' | 'Completed' | 'Reported';
  scheduledDate?: string;
  scheduledTime?: string;
  technician?: string;
  reportFindings?: string;
  reportImpression?: string;
  recommendation?: string;
  radiologist?: string;
  critical?: boolean;
  bodyPart?: string;
  clinicalHistory?: string;
  technique?: string;
  comparisonStudy?: string;
  contrastUsed?: string;
  reportedAt?: string;
}

export interface BillingInvoice {
  id: string;
  uhid: string;
  patientName: string;
  date: string;
  category: 'OPD' | 'IPD' | 'Emergency' | 'Lab' | 'Pharmacy' | 'Radiology';
  items: { description: string; amount: number }[];
  total: number;
  paid: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentMode?: PaymentMode;
  finalized?: boolean;
  discountAmount?: number;
  discountReason?: string;
}

export interface BillingEstimate {
  id: string;
  uhid: string;
  patientName: string;
  date: string;
  category: BillingInvoice['category'];
  items: { description: string; amount: number }[];
  total: number;
  status: 'draft' | 'converted';
}

export interface BillingTransaction {
  id: string;
  invoiceId: string;
  uhid: string;
  patientName: string;
  kind: 'payment' | 'refund';
  amount: number;
  mode: PaymentMode;
  reference?: string;
  reason?: string;
  createdAt: string;
}

export interface PharmacyInventoryItem {
  id: string;
  drug: string;
  generic: string;
  category: string;
  batch: string;
  expiry: string;
  qty: number;
  reorder: number;
  location: string;
  supplier: string;
  price: number;
}

export type WorkflowModule =
  | 'reception'
  | 'doctor'
  | 'nurse'
  | 'lab'
  | 'pharmacy'
  | 'billing'
  | 'radiology'
  | 'emergency'
  | 'ot'
  | 'inventory'
  | 'hr'
  | 'scheduling'
  | 'dialysis'
  | 'crm'
  | 'admin'
  | 'system';

export interface WorkflowEvent {
  id: string;
  timestamp: string;
  module: WorkflowModule;
  action: string;
  uhid?: string;
  patientName?: string;
  refId?: string;
  details: string;
}

interface ServiceChargeInput {
  uhid: string;
  patientName: string;
  description: string;
  amount: number;
  module: WorkflowModule;
  action: string;
  refId?: string;
  categoryOverride?: BillingInvoice['category'];
}

// ── Seed Data ──
const SEED_PATIENTS: HospitalPatient[] = [
  { uhid: 'UHID-240001', name: 'Rajesh Sharma', age: 45, gender: 'M', phone: '9876543210', abhaId: '91-1234-5678-9012', category: 'insurance', patientType: 'OPD', department: 'Cardiology', assignedDoctor: 'Dr. R. Mehta', bloodGroup: 'B+', registeredOn: '15 Jan 2025', lastVisit: '8 Mar 2026', branch: 'Main Hospital', allergies: 'Penicillin' },
  { uhid: 'UHID-240002', name: 'Priya Patel', age: 28, gender: 'F', phone: '9876543211', category: 'general', patientType: 'OPD', department: 'Gynecology', assignedDoctor: 'Dr. S. Iyer', registeredOn: '22 Aug 2024', lastVisit: '8 Mar 2026', branch: 'Main Hospital' },
  { uhid: 'UHID-240003', name: 'Amit Kumar', age: 62, gender: 'M', phone: '9876543212', abhaId: '91-2345-6789-0123', category: 'government', patientType: 'IPD', department: 'Cardiology', assignedDoctor: 'Dr. R. Mehta', bloodGroup: 'O+', registeredOn: '10 Jun 2024', lastVisit: '8 Mar 2026', branch: 'Main Hospital' },
  { uhid: 'UHID-240004', name: 'Sunita Devi', age: 55, gender: 'F', phone: '9876543213', category: 'general', patientType: 'OPD', department: 'Orthopedics', assignedDoctor: 'Dr. K. Rao', registeredOn: '3 Mar 2024', branch: 'City Branch' },
  { uhid: 'UHID-240005', name: 'Vikram Singh', age: 38, gender: 'M', phone: '9876543214', category: 'vip', patientType: 'OPD', department: 'ENT', assignedDoctor: 'Dr. P. Nair', bloodGroup: 'A+', registeredOn: '11 Oct 2024', lastVisit: '8 Mar 2026', branch: 'Main Hospital' },
  { uhid: 'UHID-240006', name: 'Neha Gupta', age: 32, gender: 'F', phone: '9876543215', category: 'corporate', patientType: 'OPD', department: 'Dermatology', assignedDoctor: 'Dr. D. Kapoor', bloodGroup: 'AB+', registeredOn: '20 Dec 2025', lastVisit: '8 Mar 2026', branch: 'Main Hospital' },
  { uhid: 'UHID-240007', name: 'Arjun Reddy', age: 50, gender: 'M', phone: '9876543216', category: 'insurance', patientType: 'IPD', department: 'Orthopedics', assignedDoctor: 'Dr. K. Rao', bloodGroup: 'O-', registeredOn: '5 Nov 2024', branch: 'Main Hospital' },
  { uhid: 'UHID-240008', name: 'Fatima Khan', age: 41, gender: 'F', phone: '9876543217', category: 'general', patientType: 'IPD', department: 'Pediatrics', assignedDoctor: 'Dr. P. Nair', registeredOn: '18 Feb 2026', lastVisit: '8 Mar 2026', branch: 'Main Hospital' },
];

const SEED_APPOINTMENTS: HospitalAppointment[] = [
  { id: 'APT-10001', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', phone: '9876543210', doctor: 'Dr. R. Mehta', department: 'Cardiology', date: '2026-03-08', time: '09:00', duration: 30, status: 'confirmed', type: 'follow-up', notes: 'ECG review' },
  { id: 'APT-10002', uhid: 'UHID-240002', patientName: 'Priya Patel', phone: '9876543211', doctor: 'Dr. S. Iyer', department: 'Gynecology', date: '2026-03-08', time: '09:30', duration: 30, status: 'confirmed', type: 'new', notes: '' },
  { id: 'APT-10003', uhid: 'UHID-240003', patientName: 'Amit Kumar', phone: '9876543212', doctor: 'Dr. A. Shah', department: 'General Medicine', date: '2026-03-08', time: '10:00', duration: 45, status: 'scheduled', type: 'new', notes: 'Chest pain evaluation' },
  { id: 'APT-10004', uhid: 'UHID-240004', patientName: 'Sunita Devi', phone: '9876543213', doctor: 'Dr. K. Rao', department: 'Orthopedics', date: '2026-03-08', time: '10:30', duration: 30, status: 'scheduled', type: 'new', notes: 'Knee pain' },
  { id: 'APT-10005', uhid: 'UHID-240005', patientName: 'Vikram Singh', phone: '9876543214', doctor: 'Dr. P. Nair', department: 'ENT', date: '2026-03-08', time: '11:00', duration: 30, status: 'scheduled', type: 'new', notes: '' },
  { id: 'APT-10006', uhid: 'UHID-240006', patientName: 'Neha Gupta', phone: '9876543215', doctor: 'Dr. D. Kapoor', department: 'Dermatology', date: '2026-03-08', time: '11:30', duration: 30, status: 'scheduled', type: 'follow-up', notes: '' },
];

const SEED_QUEUE: QueueEntry[] = [
  { tokenNo: 101, uhid: 'UHID-240001', patientName: 'Rajesh Sharma', doctor: 'Dr. R. Mehta', department: 'Cardiology', status: 'in-consultation', appointmentId: 'APT-10001', checkedInAt: '08:45 AM', complaint: 'Follow-up ECG review' },
  { tokenNo: 102, uhid: 'UHID-240002', patientName: 'Priya Patel', doctor: 'Dr. S. Iyer', department: 'Gynecology', status: 'waiting', appointmentId: 'APT-10002', checkedInAt: '09:20 AM', complaint: 'New consultation' },
];

const SEED_LAB_ORDERS: LabOrder[] = [
  { orderId: 'LO-4521', uhid: 'UH-2024-0045', patientName: 'Anita Sharma', tests: 'CBC (Complete Blood Count)', category: 'Hematology', priority: 'Routine', doctor: 'Dr. R. Mehta', orderTime: '10:15 AM', stage: 'In Analysis', sampleStatus: 'Processing' },
  { orderId: 'LO-4580', uhid: 'UH-2024-0230', patientName: 'Rahul Verma', tests: 'RFT (Renal Function Test), LFT (Liver Function Test)', category: 'Biochemistry', priority: 'Urgent', doctor: 'Dr. S. Iyer', orderTime: '09:30 AM', stage: 'Pending Analysis', sampleStatus: 'Received' },
  { orderId: 'LO-4514', uhid: 'UH-2024-0155', patientName: 'Kiran Desai', tests: 'Lipid Profile', category: 'Biochemistry', priority: 'Routine', doctor: 'Dr. A. Shah', orderTime: '09:00 AM', stage: 'In Analysis', sampleStatus: 'Processing' },
  { orderId: 'LO-4591', uhid: 'UH-2024-0801', patientName: 'Meera Patel', tests: 'Fasting Blood Sugar (FBS), PPBS', category: 'Biochemistry', priority: 'Routine', doctor: 'Dr. R. Mehta', orderTime: '08:45 AM', stage: 'Pending Analysis', sampleStatus: 'Received' },
];

const SEED_PRESCRIPTIONS: PrescriptionOrder[] = [
  { id: 'RX-2401', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', doctor: 'Dr. R. Mehta', department: 'Cardiology', date: '2026-03-08', priority: 'Routine', status: 'Pending', meds: [
    { drug: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'OD', duration: '30 days', route: 'Oral', qty: 30, dispensed: 0 },
    { drug: 'Aspirin 75mg', dosage: '75mg', frequency: 'OD', duration: '30 days', route: 'Oral', qty: 30, dispensed: 0 },
  ]},
];

const SEED_RADIOLOGY: RadiologyOrder[] = [
  {
    orderId: 'RD-1001',
    uhid: 'UHID-240003',
    patientName: 'Amit Kumar',
    study: 'Chest X-Ray PA',
    modality: 'X-Ray',
    priority: 'Urgent',
    doctor: 'Dr. A. Shah',
    orderTime: '10:05 AM',
    status: 'Reported',
    scheduledDate: '2026-03-08',
    scheduledTime: '10:30',
    technician: 'Tech. Ramesh',
    radiologist: 'Dr. Iyer',
    reportFindings: 'Portable AP chest radiograph shows clear lungs with no focal consolidation or pleural effusion.',
    reportImpression: 'No acute cardiopulmonary abnormality on current study.',
    recommendation: 'Clinical correlation advised. Repeat imaging if respiratory symptoms progress.',
    critical: false,
  },
];

const SEED_INVOICES: BillingInvoice[] = [
  { id: 'INV-5001', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', date: '8 Mar 2026', category: 'OPD', items: [{ description: 'Consultation - Cardiology', amount: 800 }, { description: 'ECG', amount: 500 }], total: 1300, paid: 1300, status: 'paid', paymentMode: 'upi' },
  { id: 'INV-5002', uhid: 'UHID-240002', patientName: 'Priya Patel', date: '8 Mar 2026', category: 'OPD', items: [{ description: 'Consultation - Gynecology', amount: 1000 }], total: 1000, paid: 0, status: 'pending' },
  {
    id: 'INV-5003',
    uhid: 'UHID-240003',
    patientName: 'Amit Kumar',
    date: '8 Mar 2026',
    category: 'IPD',
    items: [
      { description: 'ICU Bed Charges', amount: 7500 },
      { description: 'Critical Care Monitoring', amount: 3200 },
      { description: 'Inpatient Pharmacy', amount: 1800 },
    ],
    total: 12500,
    paid: 6500,
    status: 'partial',
    paymentMode: 'card',
  },
  {
    id: 'INV-5004',
    uhid: 'UHID-240008',
    patientName: 'Fatima Khan',
    date: '8 Mar 2026',
    category: 'IPD',
    items: [
      { description: 'Maternity Ward Charges', amount: 4200 },
      { description: 'Post-Delivery Nursing Care', amount: 2200 },
      { description: 'Newborn Observation', amount: 1200 },
    ],
    total: 7600,
    paid: 7600,
    status: 'paid',
    paymentMode: 'upi',
  },
];

const SEED_ESTIMATES: BillingEstimate[] = [];

const SEED_PHARMACY_INVENTORY: PharmacyInventoryItem[] = [
  { id: 'INV-001', drug: 'Amoxicillin 500mg', generic: 'Amoxicillin', category: 'Antibiotics', batch: 'B-4401', expiry: '2027-06-15', qty: 24, reorder: 100, location: 'Rack A-3', supplier: 'MedPharma Ltd', price: 8.5 },
  { id: 'INV-002', drug: 'Paracetamol 650mg', generic: 'Paracetamol', category: 'Analgesics', batch: 'B-4402', expiry: '2027-09-20', qty: 540, reorder: 200, location: 'Rack A-1', supplier: 'LifeCare Pharma', price: 2.0 },
  { id: 'INV-003', drug: 'Metformin 850mg', generic: 'Metformin', category: 'Diabetes', batch: 'B-4421', expiry: '2026-03-20', qty: 180, reorder: 100, location: 'Rack B-2', supplier: 'DiaCare Inc', price: 5.0 },
  { id: 'INV-004', drug: 'Atorvastatin 20mg', generic: 'Atorvastatin', category: 'Cardiovascular', batch: 'B-4430', expiry: '2027-12-01', qty: 320, reorder: 150, location: 'Rack B-4', supplier: 'HeartMed Corp', price: 12.0 },
  { id: 'INV-005', drug: 'Morphine 10mg Inj', generic: 'Morphine Sulphate', category: 'Controlled', batch: 'C-1101', expiry: '2026-08-30', qty: 15, reorder: 20, location: 'Safe-1', supplier: 'NarcoMed Ltd', price: 95.0 },
  { id: 'INV-006', drug: 'Cetirizine 10mg', generic: 'Cetirizine', category: 'Antihistamines', batch: 'B-4440', expiry: '2027-11-10', qty: 400, reorder: 200, location: 'Rack A-2', supplier: 'AllerFree Pharma', price: 3.0 },
  { id: 'INV-007', drug: 'Omeprazole 20mg', generic: 'Omeprazole', category: 'GI Drugs', batch: 'B-4450', expiry: '2026-04-05', qty: 60, reorder: 100, location: 'Rack C-1', supplier: 'GastroMed Inc', price: 6.5 },
  { id: 'INV-008', drug: 'Azithromycin 500mg', generic: 'Azithromycin', category: 'Antibiotics', batch: 'B-4460', expiry: '2027-07-22', qty: 110, reorder: 100, location: 'Rack A-3', supplier: 'MedPharma Ltd', price: 22.0 },
];

const SEED_EMERGENCY_CASES: EmergencyCase[] = [
  {
    id: 'ER-0891',
    patientName: 'Unknown Male (~45y)',
    age: 45,
    gender: 'M',
    arrivalMode: 'Ambulance',
    complaint: 'Chest pain, diaphoresis',
    vitals: 'BP 90/60, HR 120, SpO2 88%',
    triage: 'critical',
    assignedNurse: 'Nurse Priya',
    assignedDoctor: 'Dr. A. Shah',
    mlcRequired: false,
    status: 'in-treatment',
    createdAt: '10:42 AM',
  },
  {
    id: 'ER-0892',
    patientName: 'Sunita Verma',
    age: 37,
    gender: 'F',
    arrivalMode: 'Walk-in',
    complaint: 'Severe abdominal pain',
    vitals: 'BP 140/90, HR 98, SpO2 97%',
    triage: null,
    mlcRequired: false,
    status: 'triage-pending',
    createdAt: '10:45 AM',
  },
  {
    id: 'ER-0888',
    patientName: 'Amit Joshi',
    age: 29,
    gender: 'M',
    arrivalMode: 'Referral',
    complaint: 'Head injury, GCS 12',
    vitals: 'BP 110/70, HR 88, SpO2 96%',
    triage: 'urgent',
    assignedNurse: 'Nurse Rekha',
    assignedDoctor: 'Dr. R. Mehta',
    mlcRequired: true,
    status: 'triaged',
    createdAt: '10:20 AM',
  },
];

const SEED_ADMISSIONS: AdmissionCase[] = [
  {
    id: 'ADM-2401',
    uhid: 'UHID-240003',
    patientName: 'Amit Kumar',
    journeyType: 'IPD',
    admissionSource: 'OPD',
    ward: 'ICU',
    room: 'ICU Bay 1',
    bed: 'ICU-03',
    attendingDoctor: 'Dr. R. Mehta',
    assignedNurse: 'Nurse Priya',
    roundingDoctor: 'Dr. R. Mehta',
    nextDoctorRoundAt: '11:30 AM',
    primaryDiagnosis: 'Post-CABG monitoring',
    currentTreatmentPlan: 'Continue oxygen support, fluid balance, and telemetry monitoring.',
    nursingPriority: 'high',
    doctorRoundStatus: 'pending',
    lastDoctorRoundAt: '08 Mar 2026 09:45 AM',
    status: 'icu',
    admittedAt: '07 Mar 2026 09:10 AM',
  },
  {
    id: 'ADM-2402',
    uhid: 'UHID-240008',
    patientName: 'Fatima Khan',
    journeyType: 'Maternity',
    admissionSource: 'Maternity',
    ward: 'Maternity Ward',
    room: 'Room 203',
    bed: 'MW-03',
    attendingDoctor: 'Dr. S. Iyer',
    assignedNurse: 'Nurse Sunita',
    roundingDoctor: 'Dr. S. Iyer',
    nextDoctorRoundAt: '10:00 AM',
    primaryDiagnosis: 'Post-delivery recovery',
    currentTreatmentPlan: 'Post-partum monitoring, pain management, and lactation support.',
    nursingPriority: 'medium',
    doctorRoundStatus: 'seen',
    lastDoctorRoundAt: '08 Mar 2026 10:20 AM',
    status: 'admitted',
    admittedAt: '08 Mar 2026 06:30 AM',
  },
];

const SEED_NURSING_ROUNDS: NursingRound[] = [
  {
    id: 'NR-5001',
    admissionId: 'ADM-2401',
    uhid: 'UHID-240003',
    patientName: 'Amit Kumar',
    ward: 'ICU',
    bed: 'ICU-03',
    nurse: 'Nurse Priya',
    shift: 'Morning',
    bp: '126/82',
    pulse: 92,
    temp: 99.1,
    spo2: 95,
    painScore: 4,
    notes: 'Patient stable. Continue oxygen support and hourly monitoring.',
    recordedAt: '08:10 AM',
  },
  {
    id: 'NR-5002',
    admissionId: 'ADM-2402',
    uhid: 'UHID-240008',
    patientName: 'Fatima Khan',
    ward: 'Maternity Ward',
    bed: 'MW-03',
    nurse: 'Nurse Sunita',
    shift: 'Morning',
    bp: '118/76',
    pulse: 84,
    temp: 98.4,
    spo2: 98,
    painScore: 3,
    notes: 'Mother and newborn doing well. Lactation counseling provided.',
    recordedAt: '08:35 AM',
  },
];

const SEED_DOCTOR_PROGRESS_NOTES: DoctorProgressNote[] = [
  {
    id: 'DRN-9001',
    admissionId: 'ADM-2401',
    uhid: 'UHID-240003',
    patientName: 'Amit Kumar',
    doctor: 'Dr. R. Mehta',
    subjective: 'Patient reports mild chest discomfort on deep breathing, no active chest pain at rest.',
    objective: 'BP 126/82, Pulse 92, Temp 99.1F, SpO2 95% on oxygen support.',
    assessment: 'Post-CABG recovery with stable hemodynamics and mild pain.',
    plan: 'Continue oxygen support, incentive spirometry, and analgesics. Repeat CBC today.',
    followUpRequired: true,
    createdAt: '08 Mar 2026 09:45 AM',
  },
  {
    id: 'DRN-9002',
    admissionId: 'ADM-2402',
    uhid: 'UHID-240008',
    patientName: 'Fatima Khan',
    doctor: 'Dr. S. Iyer',
    subjective: 'No fever, pain reduced, able to ambulate with support.',
    objective: 'BP 118/76, Pulse 84, Temp 98.4F, SpO2 98% room air.',
    assessment: 'Post-delivery recovery progressing well.',
    plan: 'Continue routine postnatal monitoring and counseling.',
    followUpRequired: false,
    createdAt: '08 Mar 2026 10:20 AM',
  },
];

const SEED_ADMISSION_TASKS: AdmissionTask[] = [
  {
    id: 'TASK-3001',
    admissionId: 'ADM-2401',
    uhid: 'UHID-240003',
    patientName: 'Amit Kumar',
    task: 'Repeat ECG at 2 PM and update doctor.',
    assignedTo: 'Nurse Priya',
    createdBy: 'Dr. R. Mehta',
    status: 'Pending',
    createdAt: '08 Mar 2026 09:50 AM',
  },
  {
    id: 'TASK-3002',
    admissionId: 'ADM-2402',
    uhid: 'UHID-240008',
    patientName: 'Fatima Khan',
    task: 'Ensure breastfeeding counseling documented.',
    assignedTo: 'Nurse Sunita',
    createdBy: 'Dr. S. Iyer',
    status: 'Completed',
    createdAt: '08 Mar 2026 10:25 AM',
    completedAt: '08 Mar 2026 12:00 PM',
  },
];

const SEED_INPATIENT_CARE_ORDERS: InpatientCareOrder[] = [
  {
    id: 'CO-7001',
    admissionId: 'ADM-2401',
    uhid: 'UHID-240003',
    patientName: 'Amit Kumar',
    type: 'Procedure',
    item: '2D Echo follow-up',
    priority: 'Urgent',
    orderedBy: 'Dr. R. Mehta',
    status: 'Pending',
    orderedAt: '08 Mar 2026 09:55 AM',
  },
  {
    id: 'CO-7002',
    admissionId: 'ADM-2402',
    uhid: 'UHID-240008',
    patientName: 'Fatima Khan',
    type: 'Diet',
    item: 'High-protein postnatal diet with hydration chart',
    priority: 'Routine',
    orderedBy: 'Dr. S. Iyer',
    status: 'Pending',
    orderedAt: '08 Mar 2026 10:30 AM',
  },
];

const SEED_WARD_MEDICINE_ISSUES: WardMedicineIssue[] = [];
const SEED_OT_RECORDS: OTSurgeryRecord[] = [];
const SEED_ROOM_SHIFTS: RoomShiftRecord[] = [];
const SEED_DEPARTMENT_TRANSFERS: DepartmentTransferRecord[] = [];
const SEED_NOTIFICATION_LOGS: NotificationLog[] = [];
const SEED_BILLING_TRANSACTIONS: BillingTransaction[] = [];

const DISCHARGE_SUMMARY_TEMPLATES: Record<'general' | 'post-op' | 'maternity' | 'icu', string> = {
  general: 'Diagnosis: {{diagnosis}}\nHospital Course: Stable inpatient recovery.\nTreatment Given: Standard inpatient management.\nDischarge Advice: Continue medicines, hydration, and follow-up in 7 days.',
  'post-op': 'Diagnosis: {{diagnosis}}\nProcedure: Post-operative care documented.\nHospital Course: Recovery monitored with pain and wound assessment.\nDischarge Advice: Wound care, antibiotics, and surgical OPD follow-up.',
  maternity: 'Diagnosis: {{diagnosis}}\nHospital Course: Post-delivery mother and baby monitoring completed.\nCounselling: Breastfeeding and nutrition counselling provided.\nDischarge Advice: Follow-up in maternity OPD in 5-7 days.',
  icu: 'Diagnosis: {{diagnosis}}\nHospital Course: Critical care support with close monitoring.\nStabilization: Parameters optimized before transfer/discharge.\nDischarge Advice: Continue specialist follow-up and warning signs explained.',
};

// ── Counter helpers ──
let patientCounter = 240009;
let appointmentCounter = 10007;
let tokenCounter = 103;
let labOrderCounter = 4522;
let rxCounter = 2402;
let radiologyCounter = 1002;
let invoiceCounter = 5005;
let estimateCounter = 101;
let emergencyCaseCounter = 893;
let admissionCounter = 2403;
let nursingRoundCounter = 5003;
let doctorProgressNoteCounter = 9003;
let admissionTaskCounter = 3003;
let careOrderCounter = 7003;
let wardMedicineIssueCounter = 1;
let otRecordCounter = 1;
let roomShiftCounter = 1;
let departmentTransferCounter = 1;
let notificationCounter = 1;
let billingTransactionCounter = 1;
let workflowEventCounter = 1;

const AUTO_ADMIT_JOURNEYS: PatientJourneyType[] = ['IPD', 'Maternity', 'Newborn', 'ICU', 'Surgery', 'Dialysis', 'Trauma'];

const DEPARTMENT_WARDS: Record<string, { ward: string; bedPrefix: string; nurse: string; nextDoctorRoundAt: string }> = {
  Cardiology: { ward: 'Cardiac Ward', bedPrefix: 'CW', nurse: 'Nurse Priya', nextDoctorRoundAt: '11:30 AM' },
  Orthopedics: { ward: 'Orthopedic Ward', bedPrefix: 'OW', nurse: 'Nurse Rekha', nextDoctorRoundAt: '12:00 PM' },
  Gynecology: { ward: 'Women & Mother Care', bedPrefix: 'MW', nurse: 'Nurse Sunita', nextDoctorRoundAt: '10:00 AM' },
  Pediatrics: { ward: 'Pediatric Ward', bedPrefix: 'PW', nurse: 'Nurse Rekha', nextDoctorRoundAt: '09:30 AM' },
  'General Medicine': { ward: 'General Ward', bedPrefix: 'GW', nurse: 'Nurse Priya', nextDoctorRoundAt: '11:00 AM' },
  Neurology: { ward: 'Neuro Ward', bedPrefix: 'NW', nurse: 'Nurse Kavita', nextDoctorRoundAt: '12:30 PM' },
  Surgery: { ward: 'Surgical Ward', bedPrefix: 'SW', nurse: 'Nurse Rekha', nextDoctorRoundAt: '08:30 AM' },
  ENT: { ward: 'ENT Ward', bedPrefix: 'EW', nurse: 'Nurse Sunita', nextDoctorRoundAt: '11:15 AM' },
  Urology: { ward: 'Urology Ward', bedPrefix: 'UW', nurse: 'Nurse Priya', nextDoctorRoundAt: '11:45 AM' },
};

const ADMISSION_PLANS: Record<Exclude<PatientJourneyType, 'Emergency' | 'OPD'>, { ward: string; bedPrefix: string; assignedNurse: string; nextDoctorRoundAt: string; source: AdmissionCase['admissionSource'] }> = {
  IPD: { ward: 'General Ward', bedPrefix: 'GW', assignedNurse: 'Nurse Priya', nextDoctorRoundAt: '11:00 AM', source: 'Direct' },
  Maternity: { ward: 'Maternity Ward', bedPrefix: 'MW', assignedNurse: 'Nurse Sunita', nextDoctorRoundAt: '10:00 AM', source: 'Maternity' },
  Newborn: { ward: 'Newborn Care Unit', bedPrefix: 'NB', assignedNurse: 'Nurse Rekha', nextDoctorRoundAt: '09:30 AM', source: 'Maternity' },
  ICU: { ward: 'ICU', bedPrefix: 'ICU', assignedNurse: 'Nurse Priya', nextDoctorRoundAt: 'Every hour', source: 'Direct' },
  Surgery: { ward: 'Surgical Ward', bedPrefix: 'SW', assignedNurse: 'Nurse Rekha', nextDoctorRoundAt: '08:30 AM', source: 'Surgery' },
  Dialysis: { ward: 'Dialysis Unit', bedPrefix: 'DL', assignedNurse: 'Nurse Sunita', nextDoctorRoundAt: 'During session', source: 'Direct' },
  Trauma: { ward: 'Trauma Observation', bedPrefix: 'TR', assignedNurse: 'Nurse Kavita', nextDoctorRoundAt: 'Every 2 hours', source: 'Direct' },
};

function resolveAdmissionPlacement(patient: Omit<HospitalPatient, 'uhid' | 'registeredOn'>) {
  if (patient.patientType === 'IPD') {
    const deptPlan = DEPARTMENT_WARDS[patient.department || 'General Medicine'] ?? DEPARTMENT_WARDS['General Medicine'];
    return {
      ward: deptPlan.ward,
      bedPrefix: deptPlan.bedPrefix,
      assignedNurse: deptPlan.nurse,
      nextDoctorRoundAt: deptPlan.nextDoctorRoundAt,
      source: 'Direct' as AdmissionCase['admissionSource'],
      roundingDoctor: patient.assignedDoctor || 'Doctor On Call',
    };
  }

  const plan = ADMISSION_PLANS[patient.patientType as Exclude<PatientJourneyType, 'Emergency' | 'OPD'>];
  return {
    ward: plan.ward,
    bedPrefix: plan.bedPrefix,
    assignedNurse: plan.assignedNurse,
    nextDoctorRoundAt: plan.nextDoctorRoundAt,
    source: plan.source,
    roundingDoctor: patient.assignedDoctor || 'Doctor On Call',
  };
}

function isAutoAdmissionJourney(patientType: PatientJourneyType) {
  return AUTO_ADMIT_JOURNEYS.includes(patientType);
}

function nextBedNumber(admissions: AdmissionCase[], bedPrefix: string) {
  const values = admissions
    .filter((item) => item.bed.startsWith(`${bedPrefix}-`))
    .map((item) => Number.parseInt(item.bed.split('-').pop() || '0', 10))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return 1;
  }

  return Math.max(...values) + 1;
}

// ── Context ──
interface HospitalStore {
  patients: HospitalPatient[];
  appointments: HospitalAppointment[];
  queue: QueueEntry[];
  labOrders: LabOrder[];
  prescriptions: PrescriptionOrder[];
  pharmacyInventory: PharmacyInventoryItem[];
  radiologyOrders: RadiologyOrder[];
  invoices: BillingInvoice[];
  estimates: BillingEstimate[];
  emergencyCases: EmergencyCase[];
  admissions: AdmissionCase[];
  nursingRounds: NursingRound[];
  doctorProgressNotes: DoctorProgressNote[];
  admissionTasks: AdmissionTask[];
  inpatientCareOrders: InpatientCareOrder[];
  wardMedicineIssues: WardMedicineIssue[];
  otRecords: OTSurgeryRecord[];
  roomShiftHistory: RoomShiftRecord[];
  departmentTransfers: DepartmentTransferRecord[];
  notificationLogs: NotificationLog[];
  billingTransactions: BillingTransaction[];
  workflowEvents: WorkflowEvent[];

  // Actions
  registerPatient: (data: Omit<HospitalPatient, 'uhid' | 'registeredOn'>) => string;
  startFrontDeskVisit: (data: {
    patient: Omit<HospitalPatient, 'uhid' | 'registeredOn'>;
    appointmentDate?: string;
    appointmentTime?: string;
    appointmentDuration?: number;
    appointmentType?: HospitalAppointment['type'];
    notes?: string;
    initialBillingItems?: { description: string; amount: number }[];
  }) => {
    uhid: string;
    appointmentId: string | null;
    tokenNo: number | null;
    invoiceId: string | null;
    admissionId: string | null;
  };
  admitPatient: (data: {
    uhid: string;
    patientName: string;
    journeyType: PatientJourneyType;
    admissionSource: AdmissionCase['admissionSource'];
    ward: string;
    room?: string;
    bed: string;
    attendingDoctor: string;
    assignedNurse?: string;
    roundingDoctor?: string;
    nextDoctorRoundAt?: string;
    primaryDiagnosis: string;
    nursingPriority?: AdmissionCase['nursingPriority'];
    linkedEmergencyId?: string;
    linkedMotherUhid?: string;
    initialNursingRound?: {
      nurse: string;
      shift: NursingRound['shift'];
      bp: string;
      pulse: number;
      temp: number;
      spo2: number;
      painScore: number;
      notes: string;
    };
  }) => string;
  transferOpdToIPD: (data: {
    uhid: string;
    patientName: string;
    attendingDoctor: string;
    department?: string;
    reason?: string;
    bedType?: 'General' | 'Semi-Private' | 'Private' | 'ICU';
    priority?: 'Routine' | 'Urgent' | 'Emergency';
    journeyType?: Exclude<PatientJourneyType, 'OPD' | 'Emergency'>;
    requestedBy?: string;
  }) => { admissionId: string; ward: string; bed: string };
  convertOpdToIPDByUHID: (data: {
    uhid: string;
    attendingDoctor?: string;
    reason?: string;
    bedType?: 'General' | 'Semi-Private' | 'Private' | 'ICU';
    priority?: 'Routine' | 'Urgent' | 'Emergency';
    requestedBy?: string;
  }) => { admissionId: string; ward: string; bed: string };
  bookAppointment: (data: Omit<HospitalAppointment, 'id'>) => string;
  updateAppointmentStatus: (id: string, status: HospitalAppointment['status']) => void;
  checkInPatient: (appointmentId: string, complaint?: string) => number;
  updateQueueStatus: (tokenNo: number, status: QueueEntry['status']) => void;
  nextQueuePatient: (doctor: string) => void;
  
  // Doctor consultation actions
  saveConsultation: (data: {
    uhid: string;
    patientName: string;
    doctor: string;
    department: string;
    labTests?: { tests: string; category: string; priority: 'Routine' | 'Urgent' | 'Emergency' }[];
    medications?: { drug: string; dosage: string; frequency: string; duration: string; route: string; qty: number }[];
    radiologyOrders?: { study: string; modality: string; priority: 'Routine' | 'Urgent' | 'Emergency' }[];
    consultationFee?: number;
  }) => void;

  // Lab actions
  updateLabStage: (orderId: string, stage: LabOrder['stage']) => void;
  updateLabOrder: (orderId: string, patch: Partial<LabOrder>) => void;

  // Pharmacy actions
  updatePrescriptionStatus: (rxId: string, status: PrescriptionOrder['status']) => void;
  updateMedicationLineStatus: (rxId: string, lineIndex: number, status: 'active' | 'stopped') => void;
  dispensePrescription: (rxId: string, quantities: Record<number, number>) => void;

  // Radiology actions
  updateRadiologyOrder: (orderId: string, patch: Partial<RadiologyOrder>) => void;

  // IPD operational actions
  addDailyServiceCharge: (data: {
    admissionId: string;
    description: string;
    amount: number;
    chargedBy: string;
    module?: WorkflowModule;
  }) => void;
  issueWardMedicine: (data: {
    admissionId: string;
    inventoryId: string;
    qty: number;
    issuedBy: string;
  }) => string;
  updateWardMedicineIssueStatus: (issueId: string, status: WardMedicineIssue['administrationStatus']) => void;
  addInvestigationOrder: (data: {
    admissionId: string;
    tests: string;
    category: string;
    priority: 'Routine' | 'Urgent' | 'Emergency';
    doctor: string;
  }) => string;
  upsertOTRecord: (data: {
    admissionId: string;
    procedureName: string;
    surgeon: string;
    anesthetist?: string;
    preOperativeNotes?: string;
    postOperativeNotes?: string;
    status: OTSurgeryRecord['status'];
    scheduledAt?: string;
  }) => string;
  assignConsultantDoctor: (admissionId: string, consultantDoctor: string) => void;
  transferAdmissionDepartment: (data: {
    admissionId: string;
    toDepartment: string;
    reason: string;
    transferredBy: string;
    newAttendingDoctor?: string;
  }) => void;

  // Emergency and nursing workflow actions
  createEmergencyCase: (data: {
    patientName: string;
    age?: number;
    gender?: string;
    phone?: string;
    guardianName?: string;
    guardianPhone?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    referralDoctor?: string;
    referralHospital?: string;
    mlcPoliceCase?: string;
    mlcReportingAuthority?: string;
    mlcIncidentDescription?: string;
    arrivalMode: EmergencyCase['arrivalMode'];
    complaint: string;
    vitals: string;
    mlcRequired?: boolean;
  }) => string;
  triageEmergencyCase: (emergencyId: string, data: {
    triage: NonNullable<EmergencyCase['triage']>;
    assignedNurse?: string;
    assignedDoctor?: string;
    status?: EmergencyCase['status'];
  }) => void;
  transferEmergencyToIPD: (emergencyId: string, data: {
    journeyType: PatientJourneyType;
    ward: string;
    bed: string;
    attendingDoctor: string;
    primaryDiagnosis: string;
    nursingPriority?: AdmissionCase['nursingPriority'];
  }) => { uhid: string; admissionId: string };
  addNursingRound: (data: {
    admissionId: string;
    nurse: string;
    shift: NursingRound['shift'];
    bp: string;
    pulse: number;
    temp: number;
    spo2: number;
    painScore: number;
    notes: string;
  }) => string;
  addDoctorProgressNote: (data: {
    admissionId: string;
    doctor: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    followUpRequired?: boolean;
  }) => string;
  markDoctorRoundCompleted: (admissionId: string, doctor: string) => void;
  addAdmissionTask: (data: {
    admissionId: string;
    task: string;
    assignedTo: string;
    createdBy: string;
  }) => string;
  updateAdmissionTaskStatus: (taskId: string, status: AdmissionTask['status']) => void;
  addInpatientCareOrder: (data: {
    admissionId: string;
    type: InpatientCareOrder['type'];
    item: string;
    priority: InpatientCareOrder['priority'];
    orderedBy: string;
  }) => string;
  updateInpatientCareOrderStatus: (orderId: string, status: InpatientCareOrder['status']) => void;
  applyDischargeSummaryTemplate: (admissionId: string, templateKey: 'general' | 'post-op' | 'maternity' | 'icu', doctor: string) => void;
  saveAdmissionDischargeSummary: (admissionId: string, summary: string, doctor: string) => void;
  updateAdmissionStatus: (admissionId: string, status: AdmissionCase['status']) => void;
  unlockAdmissionEditLock: (admissionId: string, adminName: string, reason: string) => void;
  assignAdmissionBed: (
    admissionId: string,
    ward: string,
    bed: string,
    assignedNurse?: string,
    nextDoctorRoundAt?: string,
    reason?: string,
    shiftedBy?: string,
  ) => void;

  // Billing lifecycle actions
  generateInterimBill: (admissionId: string, note?: string) => string | null;
  finalizeAdmissionBill: (admissionId: string) => string | null;
  applyFinalBillDiscount: (admissionId: string, amount: number, reason: string) => string | null;

  // Billing actions
  collectPayment: (invoiceId: string, amount: number, mode: PaymentMode, reference?: string) => void;
  refundPayment: (invoiceId: string, amount: number, mode: PaymentMode, reason?: string, reference?: string) => void;
  createInvoice: (data: Omit<BillingInvoice, 'id'>) => string;
  createEstimate: (data: Omit<BillingEstimate, 'id' | 'status'>) => string;
  convertEstimateToInvoice: (estimateId: string) => string | null;

  // Observability
  getPatientWorkflowTimeline: (uhid: string) => WorkflowEvent[];
}

const HospitalContext = createContext<HospitalStore | null>(null);

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<HospitalPatient[]>(SEED_PATIENTS);
  const [appointments, setAppointments] = useState<HospitalAppointment[]>(SEED_APPOINTMENTS);
  const [queue, setQueue] = useState<QueueEntry[]>(SEED_QUEUE);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(SEED_LAB_ORDERS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(SEED_PRESCRIPTIONS);
  const [pharmacyInventory, setPharmacyInventory] = useState<PharmacyInventoryItem[]>(SEED_PHARMACY_INVENTORY);
  const [radiologyOrders, setRadiologyOrders] = useState<RadiologyOrder[]>(SEED_RADIOLOGY);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(SEED_INVOICES);
  const [estimates, setEstimates] = useState<BillingEstimate[]>(SEED_ESTIMATES);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>(SEED_EMERGENCY_CASES);
  const [admissions, setAdmissions] = useState<AdmissionCase[]>(SEED_ADMISSIONS);
  const [nursingRounds, setNursingRounds] = useState<NursingRound[]>(SEED_NURSING_ROUNDS);
  const [doctorProgressNotes, setDoctorProgressNotes] = useState<DoctorProgressNote[]>(SEED_DOCTOR_PROGRESS_NOTES);
  const [admissionTasks, setAdmissionTasks] = useState<AdmissionTask[]>(SEED_ADMISSION_TASKS);
  const [inpatientCareOrders, setInpatientCareOrders] = useState<InpatientCareOrder[]>(SEED_INPATIENT_CARE_ORDERS);
  const [wardMedicineIssues, setWardMedicineIssues] = useState<WardMedicineIssue[]>(SEED_WARD_MEDICINE_ISSUES);
  const [otRecords, setOtRecords] = useState<OTSurgeryRecord[]>(SEED_OT_RECORDS);
  const [roomShiftHistory, setRoomShiftHistory] = useState<RoomShiftRecord[]>(SEED_ROOM_SHIFTS);
  const [departmentTransfers, setDepartmentTransfers] = useState<DepartmentTransferRecord[]>(SEED_DEPARTMENT_TRANSFERS);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(SEED_NOTIFICATION_LOGS);
  const [billingTransactions, setBillingTransactions] = useState<BillingTransaction[]>(SEED_BILLING_TRANSACTIONS);
  const [workflowEvents, setWorkflowEvents] = useState<WorkflowEvent[]>([]);

  const pushWorkflowEvent = useCallback((event: Omit<WorkflowEvent, 'id' | 'timestamp'>) => {
    const next: WorkflowEvent = {
      id: `WF-${workflowEventCounter++}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      ...event,
    };
    setWorkflowEvents(prev => [next, ...prev].slice(0, 1000));
  }, []);

  const nowStamp = useCallback(() => {
    return new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const sendSmsNotification = useCallback((data: {
    recipientType: 'patient' | 'doctor';
    recipient: string;
    message: string;
    uhid?: string;
    admissionId?: string;
  }) => {
    const sentAt = nowStamp();
    const log: NotificationLog = {
      id: `NTF-${notificationCounter++}`,
      type: 'sms',
      recipientType: data.recipientType,
      recipient: data.recipient,
      message: data.message,
      sentAt,
      status: 'sent',
      uhid: data.uhid,
      admissionId: data.admissionId,
    };

    setNotificationLogs(prev => [log, ...prev]);
  }, [nowStamp]);

  const isAdmissionLocked = useCallback((admissionId: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    return !!admission?.isIpLocked;
  }, [admissions]);

  const postServiceCharge = useCallback((input: ServiceChargeInput) => {
    let didPost = false;
    let postedInvoiceId = '';

    setInvoices(prev => {
      const activeAdmission = admissions.find(item => item.uhid === input.uhid && item.status !== 'discharged');
      const category: BillingInvoice['category'] = input.categoryOverride ?? (activeAdmission ? 'IPD' : 'OPD');
      const invoiceIndex = prev.findIndex(item => item.uhid === input.uhid && item.category === category && item.status !== 'paid');

      if (invoiceIndex >= 0) {
        const invoice = prev[invoiceIndex];
        if (invoice.items.some(item => item.description === input.description)) {
          return prev;
        }

        didPost = true;
        postedInvoiceId = invoice.id;
        const items = [...invoice.items, { description: input.description, amount: input.amount }];
        const total = items.reduce((sum, item) => sum + item.amount, 0);
        const next = [...prev];
        next[invoiceIndex] = { ...invoice, items, total, status: invoice.paid >= total ? 'paid' : invoice.paid > 0 ? 'partial' : 'pending' };
        return next;
      }

      didPost = true;
      postedInvoiceId = `INV-${invoiceCounter++}`;
      const invoice: BillingInvoice = {
        id: postedInvoiceId,
        uhid: input.uhid,
        patientName: input.patientName,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        category,
        items: [{ description: input.description, amount: input.amount }],
        total: input.amount,
        paid: 0,
        status: 'pending',
      };
      return [invoice, ...prev];
    });

    if (didPost) {
      pushWorkflowEvent({
        module: input.module,
        action: input.action,
        uhid: input.uhid,
        patientName: input.patientName,
        refId: postedInvoiceId || input.refId,
        details: `Charge posted: ${input.description} (₹${input.amount.toLocaleString('en-IN')})`,
      });
    }
  }, [admissions, pushWorkflowEvent]);

  const registerPatient = useCallback((data: Omit<HospitalPatient, 'uhid' | 'registeredOn'>) => {
    const uhid = `UHID-${patientCounter++}`;
    const patient: HospitalPatient = { ...data, uhid, registeredOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) };
    setPatients(prev => [patient, ...prev]);
    pushWorkflowEvent({
      module: 'reception',
      action: 'patient_registered',
      uhid,
      patientName: patient.name,
      refId: uhid,
      details: `Patient ${patient.name} registered under ${patient.patientType}`,
    });
    toast.success(`Patient registered: ${patient.name}`, { description: `UHID: ${uhid}` });
    return uhid;
  }, [pushWorkflowEvent]);

  const startFrontDeskVisit = useCallback((data: {
    patient: Omit<HospitalPatient, 'uhid' | 'registeredOn'>;
    appointmentDate?: string;
    appointmentTime?: string;
    appointmentDuration?: number;
    appointmentType?: HospitalAppointment['type'];
    notes?: string;
    initialBillingItems?: { description: string; amount: number }[];
  }) => {
    const registeredOn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const appointmentDate = data.appointmentDate ?? new Date().toISOString().split('T')[0];
    const appointmentTime = data.appointmentTime ?? new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const uhid = `UHID-${patientCounter++}`;
    const appointmentId = data.patient.department && data.patient.assignedDoctor ? `APT-${appointmentCounter++}` : null;
    const tokenNo = appointmentId ? tokenCounter++ : null;
    const invoiceId = data.initialBillingItems && data.initialBillingItems.length > 0 ? `INV-${invoiceCounter++}` : null;

    const patient: HospitalPatient = {
      ...data.patient,
      uhid,
      registeredOn,
    };

    setPatients(prev => [patient, ...prev]);
    pushWorkflowEvent({
      module: 'reception',
      action: 'front_desk_visit_started',
      uhid,
      patientName: patient.name,
      refId: appointmentId ?? uhid,
      details: `Front desk journey started for ${patient.patientType}`,
    });

    let admissionId: string | null = null;
    if (isAutoAdmissionJourney(patient.patientType)) {
      const placement = resolveAdmissionPlacement(patient);
      admissionId = admitPatient({
        uhid,
        patientName: patient.name,
        journeyType: patient.patientType,
        admissionSource: placement.source,
        ward: placement.ward,
        bed: `${placement.bedPrefix}-${String(admissionCounter).padStart(4, '0')}`,
        attendingDoctor: patient.assignedDoctor || 'Doctor On Call',
        assignedNurse: placement.assignedNurse,
        roundingDoctor: placement.roundingDoctor,
        nextDoctorRoundAt: placement.nextDoctorRoundAt,
        primaryDiagnosis: data.notes || `${patient.patientType} admission from reception`,
        nursingPriority: patient.patientType === 'ICU' || patient.patientType === 'Trauma'
          ? 'high'
          : patient.patientType === 'Maternity' || patient.patientType === 'Newborn'
            ? 'medium'
            : 'low',
        linkedMotherUhid: patient.patientType === 'Newborn' ? patient.abhaId : undefined,
        initialNursingRound: {
          nurse: placement.assignedNurse,
          shift: 'Morning',
          bp: '118/76',
          pulse: patient.patientType === 'ICU' ? 96 : 82,
          temp: patient.patientType === 'ICU' ? 99.2 : 98.4,
          spo2: patient.patientType === 'ICU' ? 94 : 98,
          painScore: patient.patientType === 'Trauma' ? 5 : 1,
          notes: `${patient.patientType} admission handoff from reception. ${placement.nextDoctorRoundAt ? `Doctor round planned at ${placement.nextDoctorRoundAt}.` : ''}`.trim(),
        },
      });
    }

    if (appointmentId) {
      const appointment: HospitalAppointment = {
        id: appointmentId,
        uhid,
        patientName: patient.name,
        phone: patient.phone,
        doctor: patient.assignedDoctor || 'Doctor On Call',
        department: patient.department || 'General Medicine',
        date: appointmentDate,
        time: appointmentTime,
        duration: data.appointmentDuration ?? 20,
        status: 'checked-in',
        type: data.appointmentType ?? 'new',
        notes: data.notes ?? 'Walk-in registration from reception',
      };

      const queueEntry: QueueEntry = {
        tokenNo: tokenNo || 0,
        uhid,
        patientName: patient.name,
        doctor: appointment.doctor,
        department: appointment.department,
        status: 'waiting',
        appointmentId,
        checkedInAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        complaint: appointment.notes,
      };

      setAppointments(prev => [appointment, ...prev]);
      setQueue(prev => [...prev, queueEntry]);
      pushWorkflowEvent({
        module: 'scheduling',
        action: 'appointment_checked_in',
        uhid,
        patientName: patient.name,
        refId: appointmentId,
        details: `Checked in with token #${tokenNo}`,
      });
    }

    if (invoiceId) {
      const items = data.initialBillingItems || [];
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      const category: BillingInvoice['category'] =
        patient.patientType === 'Emergency' || patient.patientType === 'Trauma'
          ? 'Emergency'
          : patient.patientType === 'IPD' || patient.patientType === 'ICU' || patient.patientType === 'Maternity' || patient.patientType === 'Surgery' || patient.patientType === 'Newborn'
            ? 'IPD'
            : 'OPD';
      const invoice: BillingInvoice = {
        id: invoiceId,
        uhid,
        patientName: patient.name,
        date: registeredOn,
        category,
        items,
        total,
        paid: 0,
        status: 'pending',
      };

      setInvoices(prev => [invoice, ...prev]);
      pushWorkflowEvent({
        module: 'billing',
        action: 'invoice_created',
        uhid,
        patientName: patient.name,
        refId: invoiceId,
        details: `Initial ${category} invoice created at front desk`,
      });
    }

    if (admissionId) {
      pushWorkflowEvent({
        module: 'reception',
        action: 'auto_admitted',
        uhid,
        patientName: patient.name,
        refId: admissionId,
        details: `Auto-admission created from ${patient.patientType} registration`,
      });
    }

    if (patient.phone) {
      sendSmsNotification({
        recipientType: 'patient',
        recipient: patient.phone,
        message: `Welcome ${patient.name}. Your UHID is ${uhid}${admissionId ? ` and admission ID is ${admissionId}` : ''}.`,
        uhid,
        admissionId: admissionId ?? undefined,
      });
    }

    if (patient.assignedDoctor) {
      sendSmsNotification({
        recipientType: 'doctor',
        recipient: patient.assignedDoctor,
        message: `New patient ${patient.name} (${uhid}) registered${admissionId ? ` and admitted (${admissionId})` : ''}.`,
        uhid,
        admissionId: admissionId ?? undefined,
      });
    }

    toast.success('Front-desk visit started', {
      description: `${patient.name} is now registered${admissionId ? ' and admitted' : ''}${tokenNo ? ` and queued as token #${tokenNo}` : ''}.`,
    });

    return {
      uhid,
      appointmentId,
      tokenNo,
      invoiceId,
      admissionId,
    };
  }, [pushWorkflowEvent, sendSmsNotification]);

  const admitPatient = useCallback((data: {
    uhid: string;
    patientName: string;
    journeyType: PatientJourneyType;
    admissionSource: AdmissionCase['admissionSource'];
    ward: string;
    room?: string;
    bed: string;
    attendingDoctor: string;
    assignedNurse?: string;
    roundingDoctor?: string;
    nextDoctorRoundAt?: string;
    primaryDiagnosis: string;
    nursingPriority?: AdmissionCase['nursingPriority'];
    linkedEmergencyId?: string;
    linkedMotherUhid?: string;
    initialNursingRound?: {
      nurse: string;
      shift: NursingRound['shift'];
      bp: string;
      pulse: number;
      temp: number;
      spo2: number;
      painScore: number;
      notes: string;
    };
  }) => {
    const admissionId = `ADM-${admissionCounter++}`;
    const patientProfile = patients.find(item => item.uhid === data.uhid);
    const admission: AdmissionCase = {
      id: admissionId,
      uhid: data.uhid,
      patientName: data.patientName,
      journeyType: data.journeyType,
      admissionSource: data.admissionSource,
      ward: data.ward,
      department: patientProfile?.department || 'General Medicine',
      room: data.room,
      bed: data.bed,
      attendingDoctor: data.attendingDoctor,
      consultantDoctors: [data.attendingDoctor],
      assignedNurse: data.assignedNurse,
      roundingDoctor: data.roundingDoctor ?? data.attendingDoctor,
      nextDoctorRoundAt: data.nextDoctorRoundAt,
      primaryDiagnosis: data.primaryDiagnosis,
      currentTreatmentPlan: data.primaryDiagnosis,
      nursingPriority: data.nursingPriority ?? 'medium',
      doctorRoundStatus: 'pending',
      status: data.journeyType === 'ICU' ? 'icu' : data.journeyType === 'Surgery' ? 'ot' : 'admitted',
      billingStage: 'estimate',
      admittedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isIpLocked: false,
      linkedEmergencyId: data.linkedEmergencyId,
      linkedMotherUhid: data.linkedMotherUhid,
    };

    setAdmissions(prev => [admission, ...prev]);
    setPatients(prev => prev.map(p => p.uhid === data.uhid ? { ...p, patientType: data.journeyType } : p));
    pushWorkflowEvent({
      module: 'nurse',
      action: 'admission_created',
      uhid: data.uhid,
      patientName: data.patientName,
      refId: admissionId,
      details: `${data.journeyType} admitted to ${data.ward} · ${data.bed}`,
    });

    postServiceCharge({
      uhid: data.uhid,
      patientName: data.patientName,
      description: `Admission and bed allocation (${data.ward} · ${data.bed})`,
      amount: 1500,
      module: 'billing',
      action: 'admission_charge_posted',
      refId: admissionId,
      categoryOverride: 'IPD',
    });

    if (data.initialNursingRound) {
      const round: NursingRound = {
        id: `NR-${nursingRoundCounter++}`,
        admissionId,
        uhid: data.uhid,
        patientName: data.patientName,
        ward: data.ward,
        bed: data.bed,
        nurse: data.initialNursingRound.nurse,
        shift: data.initialNursingRound.shift,
        bp: data.initialNursingRound.bp,
        pulse: data.initialNursingRound.pulse,
        temp: data.initialNursingRound.temp,
        spo2: data.initialNursingRound.spo2,
        painScore: data.initialNursingRound.painScore,
        notes: data.initialNursingRound.notes,
        recordedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };
      setNursingRounds(prev => [round, ...prev]);
      pushWorkflowEvent({
        module: 'nurse',
        action: 'initial_nursing_round_recorded',
        uhid: data.uhid,
        patientName: data.patientName,
        refId: round.id,
        details: `Initial round logged for admission ${admissionId}`,
      });
    }

    toast.success(`${data.patientName} admitted`, { description: `${data.ward} · ${data.bed}` });
    return admissionId;
  }, [patients, postServiceCharge, pushWorkflowEvent]);

  const transferOpdToIPD = useCallback((data: {
    uhid: string;
    patientName: string;
    attendingDoctor: string;
    department?: string;
    reason?: string;
    bedType?: 'General' | 'Semi-Private' | 'Private' | 'ICU';
    priority?: 'Routine' | 'Urgent' | 'Emergency';
    journeyType?: Exclude<PatientJourneyType, 'OPD' | 'Emergency'>;
    requestedBy?: string;
  }) => {
    const existingAdmission = admissions.find((item) => item.uhid === data.uhid && item.status !== 'discharged');
    if (existingAdmission) {
      toast.info(`${data.patientName} already has an active IPD admission`, {
        description: `${existingAdmission.ward} · ${existingAdmission.bed}`,
      });
      return {
        admissionId: existingAdmission.id,
        ward: existingAdmission.ward,
        bed: existingAdmission.bed,
      };
    }

    const patient = patients.find((item) => item.uhid === data.uhid);
    if (!patient) {
      throw new Error(`Patient not found: ${data.uhid}`);
    }

    const department = data.department || patient.department || 'General Medicine';
    const departmentPlan = DEPARTMENT_WARDS[department] ?? DEPARTMENT_WARDS['General Medicine'];

    const mappedJourneyType = data.journeyType ?? (
      data.bedType === 'ICU' || data.priority === 'Emergency' ? 'ICU' : 'IPD'
    );

    const ward = mappedJourneyType === 'ICU' ? 'ICU' : departmentPlan.ward;
    const bedPrefix = mappedJourneyType === 'ICU' ? 'ICU' : departmentPlan.bedPrefix;
    const bedNo = nextBedNumber(admissions, bedPrefix);
    const bed = `${bedPrefix}-${String(bedNo).padStart(2, '0')}`;
    const room = mappedJourneyType === 'ICU'
      ? `ICU Bay ${Math.max(1, Math.ceil(bedNo / 2))}`
      : `${ward} Room ${Math.max(1, Math.ceil(bedNo / 2))}`;

    const admissionId = admitPatient({
      uhid: data.uhid,
      patientName: data.patientName,
      journeyType: mappedJourneyType,
      admissionSource: 'OPD',
      ward,
      room,
      bed,
      attendingDoctor: data.attendingDoctor,
      assignedNurse: departmentPlan.nurse,
      roundingDoctor: data.attendingDoctor,
      nextDoctorRoundAt: departmentPlan.nextDoctorRoundAt,
      primaryDiagnosis: data.reason || 'Observation and inpatient care advised from OPD review',
      nursingPriority:
        data.priority === 'Emergency' ? 'high'
          : data.priority === 'Urgent' ? 'medium'
            : 'low',
      initialNursingRound: {
        nurse: departmentPlan.nurse,
        shift: 'Morning',
        bp: '120/80',
        pulse: 82,
        temp: 98.6,
        spo2: mappedJourneyType === 'ICU' ? 94 : 98,
        painScore: data.priority === 'Emergency' ? 5 : 2,
        notes: `OPD to IPD transfer initiated by ${data.requestedBy || data.attendingDoctor}. ${data.reason || 'Observation and inpatient monitoring required.'}`,
      },
    });

    setQueue(prev => prev.map((entry) => (
      entry.uhid === data.uhid && entry.status !== 'completed'
        ? { ...entry, status: 'completed' }
        : entry
    )));

    setAppointments(prev => prev.map((appointment) => (
      appointment.uhid === data.uhid && appointment.status !== 'completed' && appointment.status !== 'cancelled' && appointment.status !== 'no-show'
        ? { ...appointment, status: 'completed' }
        : appointment
    )));

    postServiceCharge({
      uhid: data.uhid,
      patientName: data.patientName,
      description: `OPD to IPD transfer coordination (${ward} · ${room} · ${bed})`,
      amount: 650,
      module: 'billing',
      action: 'opd_to_ipd_transfer_charge_posted',
      refId: admissionId,
      categoryOverride: 'IPD',
    });

    pushWorkflowEvent({
      module: 'doctor',
      action: 'opd_transferred_to_ipd',
      uhid: data.uhid,
      patientName: data.patientName,
      refId: admissionId,
      details: `OPD care escalated to IPD (${ward} · ${room} · ${bed}) by ${data.requestedBy || data.attendingDoctor}`,
    });

    toast.success('OPD patient transferred to IPD', {
      description: `${data.patientName} · ${ward} · ${bed}`,
    });

    if (patient.phone) {
      sendSmsNotification({
        recipientType: 'patient',
        recipient: patient.phone,
        message: `${data.patientName}, your care has been shifted from OPD to IPD (${ward}, ${bed}).`,
        uhid: data.uhid,
        admissionId,
      });
    }

    sendSmsNotification({
      recipientType: 'doctor',
      recipient: data.attendingDoctor,
      message: `IPD transfer alert: ${data.patientName} (${data.uhid}) admitted to ${ward} ${bed}.`,
      uhid: data.uhid,
      admissionId,
    });

    return { admissionId, ward, bed };
  }, [admissions, admitPatient, patients, postServiceCharge, pushWorkflowEvent, sendSmsNotification]);

  const convertOpdToIPDByUHID = useCallback((data: {
    uhid: string;
    attendingDoctor?: string;
    reason?: string;
    bedType?: 'General' | 'Semi-Private' | 'Private' | 'ICU';
    priority?: 'Routine' | 'Urgent' | 'Emergency';
    requestedBy?: string;
  }) => {
    const patient = patients.find(item => item.uhid === data.uhid);
    if (!patient) {
      throw new Error(`Patient not found: ${data.uhid}`);
    }

    return transferOpdToIPD({
      uhid: patient.uhid,
      patientName: patient.name,
      attendingDoctor: data.attendingDoctor || patient.assignedDoctor || 'Doctor On Call',
      department: patient.department,
      reason: data.reason,
      bedType: data.bedType,
      priority: data.priority,
      requestedBy: data.requestedBy,
    });
  }, [patients, transferOpdToIPD]);

  const bookAppointment = useCallback((data: Omit<HospitalAppointment, 'id'>) => {
    const id = `APT-${appointmentCounter++}`;
    setAppointments(prev => [{ ...data, id }, ...prev]);
    toast.success(`Appointment booked: ${data.patientName}`, { description: `${id} · ${data.doctor} · ${data.time}` });
    return id;
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: HospitalAppointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const checkInPatient = useCallback((appointmentId: string, complaint?: string) => {
    const token = tokenCounter++;
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) return token;
    
    const entry: QueueEntry = {
      tokenNo: token,
      uhid: appt.uhid,
      patientName: appt.patientName,
      doctor: appt.doctor,
      department: appt.department,
      status: 'waiting',
      appointmentId,
      checkedInAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      complaint: complaint || appt.notes,
    };
    setQueue(prev => [...prev, entry]);
    updateAppointmentStatus(appointmentId, 'checked-in');
    toast.success(`Checked in: ${appt.patientName}`, { description: `Token #${token}` });
    return token;
  }, [appointments, updateAppointmentStatus]);

  const updateQueueStatus = useCallback((tokenNo: number, status: QueueEntry['status']) => {
    setQueue(prev => prev.map(q => q.tokenNo === tokenNo ? { ...q, status } : q));
  }, []);

  const nextQueuePatient = useCallback((doctor: string) => {
    setQueue(prev => {
      const updated = [...prev];
      const currentIdx = updated.findIndex(q => q.doctor === doctor && q.status === 'in-consultation');
      if (currentIdx >= 0) updated[currentIdx].status = 'completed';
      const nextIdx = updated.findIndex(q => q.doctor === doctor && q.status === 'waiting');
      if (nextIdx >= 0) updated[nextIdx].status = 'in-consultation';
      return updated;
    });
  }, []);

  const saveConsultation = useCallback((data: {
    uhid: string; patientName: string; doctor: string; department: string;
    labTests?: { tests: string; category: string; priority: 'Routine' | 'Urgent' | 'Emergency' }[];
    medications?: { drug: string; dosage: string; frequency: string; duration: string; route: string; qty: number }[];
    radiologyOrders?: { study: string; modality: string; priority: 'Routine' | 'Urgent' | 'Emergency' }[];
    consultationFee?: number;
  }) => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    // Create lab orders
    if (data.labTests && data.labTests.length > 0) {
      const newLabOrders: LabOrder[] = data.labTests.map(t => ({
        orderId: `LO-${labOrderCounter++}`,
        sampleId: `S-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`,
        uhid: data.uhid,
        patientName: data.patientName,
        tests: t.tests,
        category: t.category,
        priority: t.priority,
        doctor: data.doctor,
        orderTime: now,
        stage: 'Pending Analysis' as const,
        sampleStatus: 'Ordered' as const,
        specimenType: 'Blood',
        methodName: 'Automated analyzer',
      }));
      setLabOrders(prev => [...newLabOrders, ...prev]);
      newLabOrders.forEach(order => {
        pushWorkflowEvent({
          module: 'lab',
          action: 'lab_order_created',
          uhid: order.uhid,
          patientName: order.patientName,
          refId: order.orderId,
          details: `${order.tests} ordered by ${order.doctor}`,
        });
      });
    }

    // Create prescriptions
    if (data.medications && data.medications.length > 0) {
      const medicationStartAt = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const rx: PrescriptionOrder = {
        id: `RX-${rxCounter++}`,
        uhid: data.uhid,
        patientName: data.patientName,
        doctor: data.doctor,
        department: data.department,
        date: new Date().toISOString().split('T')[0],
        priority: 'Routine',
        status: 'Pending',
        meds: data.medications.map(m => ({
          ...m,
          dispensed: 0,
          status: 'active',
          startAt: medicationStartAt,
        })),
      };
      setPrescriptions(prev => [rx, ...prev]);
      pushWorkflowEvent({
        module: 'pharmacy',
        action: 'prescription_created',
        uhid: rx.uhid,
        patientName: rx.patientName,
        refId: rx.id,
        details: `${rx.meds.length} medication line(s) prescribed`,
      });
    }

    // Create radiology orders
    if (data.radiologyOrders && data.radiologyOrders.length > 0) {
      const newRads: RadiologyOrder[] = data.radiologyOrders.map(r => ({
        orderId: `RD-${radiologyCounter++}`,
        uhid: data.uhid,
        patientName: data.patientName,
        study: r.study,
        bodyPart: r.study,
        modality: r.modality,
        priority: r.priority,
        doctor: data.doctor,
        orderTime: now,
        status: 'Ordered' as const,
        clinicalHistory: `Ordered during consultation by ${data.doctor}`,
      }));
      setRadiologyOrders(prev => [...newRads, ...prev]);
      newRads.forEach(order => {
        pushWorkflowEvent({
          module: 'radiology',
          action: 'radiology_order_created',
          uhid: order.uhid,
          patientName: order.patientName,
          refId: order.orderId,
          details: `${order.study} requested`,
        });
      });
    }

    // Post billing lines into running patient invoice (OPD/IPD decided automatically)
    if (data.consultationFee) {
      postServiceCharge({
        uhid: data.uhid,
        patientName: data.patientName,
        description: `Consultation - ${data.department} (${data.doctor})`,
        amount: data.consultationFee,
        module: 'billing',
        action: 'consultation_charge_posted',
      });
    }

    if (data.labTests && data.labTests.length > 0) {
      data.labTests.forEach((test) => {
        postServiceCharge({
          uhid: data.uhid,
          patientName: data.patientName,
          description: `Lab order - ${test.tests}`,
          amount: 500,
          module: 'lab',
          action: 'lab_charge_posted',
        });
      });
    }

    if (data.radiologyOrders && data.radiologyOrders.length > 0) {
      data.radiologyOrders.forEach((order) => {
        postServiceCharge({
          uhid: data.uhid,
          patientName: data.patientName,
          description: `Radiology order - ${order.study}`,
          amount: 1000,
          module: 'radiology',
          action: 'radiology_charge_posted',
        });
      });
    }

    // Update patient's last visit
    setPatients(prev => prev.map(p => p.uhid === data.uhid ? { ...p, lastVisit: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) } : p));

    // Complete queue entry
    setQueue(prev => prev.map(q =>
      q.uhid === data.uhid && (q.status === 'waiting' || q.status === 'called' || q.status === 'in-consultation')
        ? { ...q, status: 'completed' as const }
        : q
    ));

    toast.success('Consultation saved', {
      description: `${data.labTests?.length || 0} lab orders, ${data.medications?.length || 0} medications, ${data.radiologyOrders?.length || 0} radiology orders created`,
    });
  }, [postServiceCharge, pushWorkflowEvent]);

  const updateLabStage = useCallback((orderId: string, stage: LabOrder['stage']) => {
    setLabOrders(prev => prev.map(order => {
      if (order.orderId !== orderId) return order;

      const sampleStatus =
        stage === 'In Analysis' ? 'Processing'
        : stage === 'Awaiting Validation' ? 'Analysis Complete'
        : order.sampleStatus;

      return {
        ...order,
        stage,
        sampleStatus,
        reportedAt: stage === 'Reported'
          ? new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
          : order.reportedAt,
      };
    }));
    const order = labOrders.find(item => item.orderId === orderId);
    if (order) {
      pushWorkflowEvent({
        module: 'lab',
        action: 'lab_stage_updated',
        uhid: order.uhid,
        patientName: order.patientName,
        refId: orderId,
        details: `Lab stage moved to ${stage}`,
      });
    }
    toast.success(`Lab order ${orderId} updated to ${stage}`);
  }, [labOrders, pushWorkflowEvent]);

  const updateLabOrder = useCallback((orderId: string, patch: Partial<LabOrder>) => {
    setLabOrders(prev => prev.map(order => order.orderId === orderId ? { ...order, ...patch } : order));
    const order = labOrders.find(item => item.orderId === orderId);
    if (order) {
      pushWorkflowEvent({
        module: 'lab',
        action: 'lab_order_updated',
        uhid: order.uhid,
        patientName: order.patientName,
        refId: orderId,
        details: `Lab metadata updated: ${Object.keys(patch).join(', ') || 'no fields'}`,
      });
    }
  }, [labOrders, pushWorkflowEvent]);

  const updateMedicationLineStatus = useCallback((rxId: string, lineIndex: number, status: 'active' | 'stopped') => {
    const changedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setPrescriptions(prev => prev.map((rx) => {
      if (rx.id !== rxId) {
        return rx;
      }

      return {
        ...rx,
        meds: rx.meds.map((med, idx) => {
          if (idx !== lineIndex) {
            return med;
          }

          return {
            ...med,
            status,
            startAt: status === 'active' ? (med.startAt || changedAt) : med.startAt,
            stopAt: status === 'stopped' ? changedAt : undefined,
          };
        }),
      };
    }));

    const rx = prescriptions.find((item) => item.id === rxId);
    const med = rx?.meds[lineIndex];
    if (rx && med) {
      pushWorkflowEvent({
        module: 'doctor',
        action: 'medication_line_status_updated',
        uhid: rx.uhid,
        patientName: rx.patientName,
        refId: rxId,
        details: `${med.drug} marked as ${status}`,
      });
    }

    toast.success('Medication chart updated', {
      description: status === 'active' ? 'Medication restarted' : 'Medication stopped',
    });
  }, [prescriptions, pushWorkflowEvent]);

  const dispensePrescription = useCallback((rxId: string, quantities: Record<number, number>) => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id !== rxId) return rx;
      const updatedMeds = rx.meds.map((m, i) => ({
        ...m,
        dispensed: m.dispensed + (quantities[i] || 0),
      }));
      const allDispensed = updatedMeds.every(m => m.dispensed >= m.qty);
      const someDispensed = updatedMeds.some(m => m.dispensed > 0);
      return {
        ...rx,
        meds: updatedMeds,
        status: allDispensed ? 'Dispensed' as const : someDispensed ? 'Partially dispensed' as const : rx.status,
      };
    }));

    const rx = prescriptions.find(item => item.id === rxId);
    if (rx) {
      const billedAmount = rx.meds.reduce((sum, med, idx) => sum + ((quantities[idx] || 0) * 120), 0);
      if (billedAmount > 0) {
        const batchSummary = Object.entries(quantities)
          .filter(([, qty]) => qty > 0)
          .map(([idx, qty]) => `${rx.meds[Number(idx)]?.drug || 'Medication'} x${qty}`)
          .join(', ');
        postServiceCharge({
          uhid: rx.uhid,
          patientName: rx.patientName,
          description: `Pharmacy dispense - ${batchSummary || rxId}`,
          amount: billedAmount,
          module: 'pharmacy',
          action: 'pharmacy_charge_posted',
          refId: rxId,
        });
      }
    }

    toast.success(`Prescription ${rxId} dispensed`);
  }, [postServiceCharge, prescriptions]);

  const updatePrescriptionStatus = useCallback((rxId: string, status: PrescriptionOrder['status']) => {
    setPrescriptions(prev => prev.map(rx => rx.id === rxId ? { ...rx, status } : rx));
    toast.success(`Prescription ${rxId} updated to ${status}`);
  }, []);

  const updateRadiologyOrder = useCallback((orderId: string, patch: Partial<RadiologyOrder>) => {
    setRadiologyOrders(prev => prev.map(order => order.orderId === orderId ? { ...order, ...patch } : order));
    const order = radiologyOrders.find(item => item.orderId === orderId);
    if (order) {
      pushWorkflowEvent({
        module: 'radiology',
        action: patch.status ? 'radiology_stage_updated' : 'radiology_order_updated',
        uhid: order.uhid,
        patientName: order.patientName,
        refId: orderId,
        details: patch.status ? `Radiology status changed to ${patch.status}` : 'Radiology metadata updated',
      });
    }
    if (patch.status) {
      toast.success(`Radiology order ${orderId} updated to ${patch.status}`);
    }
  }, [pushWorkflowEvent, radiologyOrders]);

  const addDailyServiceCharge = useCallback((data: {
    admissionId: string;
    description: string;
    amount: number;
    chargedBy: string;
    module?: WorkflowModule;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      toast.error('Admission is locked after discharge. Admin unlock required.');
      return;
    }

    postServiceCharge({
      uhid: admission.uhid,
      patientName: admission.patientName,
      description: data.description,
      amount: data.amount,
      module: data.module || 'billing',
      action: 'daily_service_charge_posted',
      refId: data.admissionId,
      categoryOverride: 'IPD',
    });

    pushWorkflowEvent({
      module: data.module || 'billing',
      action: 'daily_service_charge_added',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: data.admissionId,
      details: `${data.description} by ${data.chargedBy}`,
    });
  }, [admissions, isAdmissionLocked, postServiceCharge, pushWorkflowEvent]);

  const issueWardMedicine = useCallback((data: {
    admissionId: string;
    inventoryId: string;
    qty: number;
    issuedBy: string;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const inventoryItem = pharmacyInventory.find(item => item.id === data.inventoryId);
    if (!inventoryItem) {
      throw new Error(`Inventory item not found: ${data.inventoryId}`);
    }

    if (data.qty <= 0 || data.qty > inventoryItem.qty) {
      throw new Error('Insufficient stock for ward issue');
    }

    setPharmacyInventory(prev => prev.map(item => item.id === data.inventoryId ? {
      ...item,
      qty: item.qty - data.qty,
    } : item));

    const issueId = `WMI-${wardMedicineIssueCounter++}`;
    const issuedAt = nowStamp();
    const issue: WardMedicineIssue = {
      id: issueId,
      admissionId: data.admissionId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      inventoryId: inventoryItem.id,
      drug: inventoryItem.drug,
      batch: inventoryItem.batch,
      expiry: inventoryItem.expiry,
      qty: data.qty,
      issuedBy: data.issuedBy,
      issuedAt,
      administrationStatus: 'issued',
    };

    setWardMedicineIssues(prev => [issue, ...prev]);

    postServiceCharge({
      uhid: admission.uhid,
      patientName: admission.patientName,
      description: `Ward medicine - ${inventoryItem.drug} (Batch ${inventoryItem.batch})`,
      amount: Number((inventoryItem.price * data.qty).toFixed(2)),
      module: 'pharmacy',
      action: 'ward_medicine_charge_posted',
      refId: issueId,
      categoryOverride: 'IPD',
    });

    pushWorkflowEvent({
      module: 'pharmacy',
      action: 'ward_medicine_issued',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: issueId,
      details: `${inventoryItem.drug} x${data.qty} issued by ${data.issuedBy}`,
    });

    return issueId;
  }, [admissions, isAdmissionLocked, nowStamp, pharmacyInventory, postServiceCharge, pushWorkflowEvent]);

  const updateWardMedicineIssueStatus = useCallback((issueId: string, status: WardMedicineIssue['administrationStatus']) => {
    setWardMedicineIssues(prev => prev.map(item => item.id === issueId ? {
      ...item,
      administrationStatus: status,
    } : item));

    const issue = wardMedicineIssues.find(item => item.id === issueId);
    if (issue) {
      pushWorkflowEvent({
        module: 'nurse',
        action: 'ward_medicine_issue_status_updated',
        uhid: issue.uhid,
        patientName: issue.patientName,
        refId: issueId,
        details: `${issue.drug} status moved to ${status}`,
      });
    }
  }, [pushWorkflowEvent, wardMedicineIssues]);

  const addInvestigationOrder = useCallback((data: {
    admissionId: string;
    tests: string;
    category: string;
    priority: 'Routine' | 'Urgent' | 'Emergency';
    doctor: string;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const orderId = `LO-${labOrderCounter++}`;
    const orderTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const order: LabOrder = {
      orderId,
      sampleId: `S-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`,
      uhid: admission.uhid,
      patientName: admission.patientName,
      tests: data.tests,
      category: data.category,
      priority: data.priority,
      doctor: data.doctor,
      orderTime,
      stage: 'Pending Analysis',
      sampleStatus: 'Ordered',
      specimenType: 'Blood',
      methodName: 'Automated analyzer',
    };

    setLabOrders(prev => [order, ...prev]);

    postServiceCharge({
      uhid: admission.uhid,
      patientName: admission.patientName,
      description: `Investigation - ${data.tests}`,
      amount: 500,
      module: 'lab',
      action: 'investigation_charge_posted',
      refId: orderId,
      categoryOverride: 'IPD',
    });

    pushWorkflowEvent({
      module: 'lab',
      action: 'investigation_order_created',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: orderId,
      details: `${data.tests} ordered (${data.priority})`,
    });

    return orderId;
  }, [admissions, isAdmissionLocked, postServiceCharge, pushWorkflowEvent]);

  const upsertOTRecord = useCallback((data: {
    admissionId: string;
    procedureName: string;
    surgeon: string;
    anesthetist?: string;
    preOperativeNotes?: string;
    postOperativeNotes?: string;
    status: OTSurgeryRecord['status'];
    scheduledAt?: string;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const existing = otRecords.find(item => item.admissionId === data.admissionId);
    const timestamp = nowStamp();

    if (existing) {
      const updated: OTSurgeryRecord = {
        ...existing,
        procedureName: data.procedureName || existing.procedureName,
        surgeon: data.surgeon || existing.surgeon,
        anesthetist: data.anesthetist ?? existing.anesthetist,
        preOperativeNotes: data.preOperativeNotes ?? existing.preOperativeNotes,
        postOperativeNotes: data.postOperativeNotes ?? existing.postOperativeNotes,
        status: data.status,
        scheduledAt: data.scheduledAt || existing.scheduledAt,
        updatedAt: timestamp,
      };

      setOtRecords(prev => prev.map(item => item.id === existing.id ? updated : item));
      setAdmissions(prev => prev.map(item => item.id === data.admissionId ? {
        ...item,
        status: data.status === 'completed' ? 'admitted' : 'ot',
      } : item));

      pushWorkflowEvent({
        module: 'ot',
        action: 'ot_record_updated',
        uhid: admission.uhid,
        patientName: admission.patientName,
        refId: existing.id,
        details: `OT record updated (${data.status})`,
      });

      return existing.id;
    }

    const otId = `OTR-${otRecordCounter++}`;
    const record: OTSurgeryRecord = {
      id: otId,
      admissionId: data.admissionId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      procedureName: data.procedureName,
      surgeon: data.surgeon,
      anesthetist: data.anesthetist,
      preOperativeNotes: data.preOperativeNotes,
      postOperativeNotes: data.postOperativeNotes,
      status: data.status,
      scheduledAt: data.scheduledAt || timestamp,
      updatedAt: timestamp,
    };

    setOtRecords(prev => [record, ...prev]);
    setAdmissions(prev => prev.map(item => item.id === data.admissionId ? {
      ...item,
      status: data.status === 'completed' ? 'admitted' : 'ot',
    } : item));

    postServiceCharge({
      uhid: admission.uhid,
      patientName: admission.patientName,
      description: `OT procedure - ${data.procedureName}`,
      amount: 2500,
      module: 'ot',
      action: 'ot_charge_posted',
      refId: otId,
      categoryOverride: 'IPD',
    });

    pushWorkflowEvent({
      module: 'ot',
      action: 'ot_record_created',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: otId,
      details: `OT record created for ${data.procedureName}`,
    });

    return otId;
  }, [admissions, isAdmissionLocked, nowStamp, otRecords, postServiceCharge, pushWorkflowEvent]);

  const assignConsultantDoctor = useCallback((admissionId: string, consultantDoctor: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (isAdmissionLocked(admissionId)) {
      toast.error('Admission is locked after discharge. Admin unlock required.');
      return;
    }

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      consultantDoctors: Array.from(new Set([...(item.consultantDoctors || []), consultantDoctor])),
    } : item));

    pushWorkflowEvent({
      module: 'doctor',
      action: 'consultant_assigned',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: admissionId,
      details: `Consultant assigned: ${consultantDoctor}`,
    });
  }, [admissions, isAdmissionLocked, pushWorkflowEvent]);

  const transferAdmissionDepartment = useCallback((data: {
    admissionId: string;
    toDepartment: string;
    reason: string;
    transferredBy: string;
    newAttendingDoctor?: string;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      toast.error('Admission is locked after discharge. Admin unlock required.');
      return;
    }

    const patient = patients.find(item => item.uhid === admission.uhid);
    const fromDepartment = admission.department || patient?.department || 'General Medicine';
    const transferredAt = nowStamp();
    const transferId = `DPT-${departmentTransferCounter++}`;

    const transferRecord: DepartmentTransferRecord = {
      id: transferId,
      admissionId: data.admissionId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      fromDepartment,
      toDepartment: data.toDepartment,
      reason: data.reason,
      transferredBy: data.transferredBy,
      transferredAt,
    };

    setDepartmentTransfers(prev => [transferRecord, ...prev]);
    setAdmissions(prev => prev.map(item => item.id === data.admissionId ? {
      ...item,
      department: data.toDepartment,
      attendingDoctor: data.newAttendingDoctor || item.attendingDoctor,
      roundingDoctor: data.newAttendingDoctor || item.roundingDoctor,
    } : item));
    setPatients(prev => prev.map(item => item.uhid === admission.uhid ? {
      ...item,
      department: data.toDepartment,
      assignedDoctor: data.newAttendingDoctor || item.assignedDoctor,
    } : item));

    pushWorkflowEvent({
      module: 'reception',
      action: 'admission_department_transferred',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: transferId,
      details: `${fromDepartment} -> ${data.toDepartment} by ${data.transferredBy}`,
    });
  }, [admissions, isAdmissionLocked, nowStamp, patients, pushWorkflowEvent]);

  const createEmergencyCase = useCallback((data: {
    patientName: string;
    age?: number;
    gender?: string;
    phone?: string;
    guardianName?: string;
    guardianPhone?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    referralDoctor?: string;
    referralHospital?: string;
    mlcPoliceCase?: string;
    mlcReportingAuthority?: string;
    mlcIncidentDescription?: string;
    arrivalMode: EmergencyCase['arrivalMode'];
    complaint: string;
    vitals: string;
    mlcRequired?: boolean;
  }) => {
    const emergencyId = `ER-${emergencyCaseCounter++}`;
    const emergencyCase: EmergencyCase = {
      id: emergencyId,
      patientName: data.patientName,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      emergencyContactRelation: data.emergencyContactRelation,
      referralDoctor: data.referralDoctor,
      referralHospital: data.referralHospital,
      mlcPoliceCase: data.mlcPoliceCase,
      mlcReportingAuthority: data.mlcReportingAuthority,
      mlcIncidentDescription: data.mlcIncidentDescription,
      arrivalMode: data.arrivalMode,
      complaint: data.complaint,
      vitals: data.vitals,
      triage: null,
      mlcRequired: data.mlcRequired ?? false,
      status: 'triage-pending',
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    setEmergencyCases(prev => [emergencyCase, ...prev]);
    pushWorkflowEvent({
      module: 'emergency',
      action: 'emergency_case_created',
      patientName: data.patientName,
      refId: emergencyId,
      details: `${data.arrivalMode} arrival logged with complaint: ${data.complaint}${data.mlcRequired ? ' (MLC)' : ''}`,
    });

    if (data.phone) {
      sendSmsNotification({
        recipientType: 'patient',
        recipient: data.phone,
        message: `Emergency case ${emergencyId} created for ${data.patientName}. ER team has been notified.`,
        uhid: undefined,
      });
    }

    toast.success('Emergency case created', { description: emergencyId });
    return emergencyId;
  }, [pushWorkflowEvent, sendSmsNotification]);

  const triageEmergencyCase = useCallback((emergencyId: string, data: {
    triage: NonNullable<EmergencyCase['triage']>;
    assignedNurse?: string;
    assignedDoctor?: string;
    status?: EmergencyCase['status'];
  }) => {
    setEmergencyCases(prev => prev.map(item => item.id === emergencyId ? {
      ...item,
      triage: data.triage,
      assignedNurse: data.assignedNurse ?? item.assignedNurse,
      assignedDoctor: data.assignedDoctor ?? item.assignedDoctor,
      status: data.status ?? 'triaged',
    } : item));
    const emergency = emergencyCases.find(item => item.id === emergencyId);
    pushWorkflowEvent({
      module: 'emergency',
      action: 'emergency_case_triaged',
      uhid: emergency?.uhid,
      patientName: emergency?.patientName,
      refId: emergencyId,
      details: `Triage set to ${data.triage}`,
    });
    toast.success(`Triage updated for ${emergencyId}`);
  }, [emergencyCases, pushWorkflowEvent]);

  const transferEmergencyToIPD = useCallback((emergencyId: string, data: {
    journeyType: PatientJourneyType;
    ward: string;
    bed: string;
    attendingDoctor: string;
    primaryDiagnosis: string;
    nursingPriority?: AdmissionCase['nursingPriority'];
  }) => {
    const emergency = emergencyCases.find(item => item.id === emergencyId);
    if (!emergency) {
      throw new Error(`Emergency case not found: ${emergencyId}`);
    }

    const placement = resolveAdmissionPlacement({
      name: emergency.patientName,
      age: emergency.age ?? 30,
      gender: emergency.gender ?? 'M',
      phone: `900000${Math.floor(Math.random() * 9000 + 1000)}`,
      category: emergency.mlcRequired ? 'government' : 'general',
      patientType: data.journeyType,
      department: 'Emergency',
      assignedDoctor: data.attendingDoctor,
      branch: 'Main Hospital',
      isMLC: emergency.mlcRequired,
    });

    const uhid = emergency.uhid ?? registerPatient({
      name: emergency.patientName,
      age: emergency.age ?? 30,
      gender: emergency.gender ?? 'M',
      phone: `900000${Math.floor(Math.random() * 9000 + 1000)}`,
      category: emergency.mlcRequired ? 'government' : 'general',
      patientType: data.journeyType,
      department: 'Emergency',
      assignedDoctor: data.attendingDoctor,
      branch: 'Main Hospital',
      isMLC: emergency.mlcRequired,
    });

    const admissionId = admitPatient({
      uhid,
      patientName: emergency.patientName,
      journeyType: data.journeyType,
      admissionSource: 'Emergency',
      ward: data.ward,
      room: data.ward === 'ICU' ? 'ICU Bay 1' : `${data.ward} Room 1`,
      bed: data.bed,
      attendingDoctor: data.attendingDoctor,
      assignedNurse: placement.assignedNurse,
      roundingDoctor: data.attendingDoctor,
      nextDoctorRoundAt: placement.nextDoctorRoundAt,
      primaryDiagnosis: data.primaryDiagnosis,
      nursingPriority: data.nursingPriority,
      linkedEmergencyId: emergencyId,
      initialNursingRound: {
        nurse: placement.assignedNurse,
        shift: 'Morning',
        bp: '122/78',
        pulse: 90,
        temp: 98.8,
        spo2: 97,
        painScore: 3,
        notes: `Emergency transfer from ${emergencyId}. Doctor round planned at ${placement.nextDoctorRoundAt}.`,
      },
    });

    setEmergencyCases(prev => prev.map(item => item.id === emergencyId ? {
      ...item,
      uhid,
      status: 'transferred-ipd',
      assignedDoctor: data.attendingDoctor,
    } : item));

    const invoice: BillingInvoice = {
      id: `INV-${invoiceCounter++}`,
      uhid,
      patientName: emergency.patientName,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: 'Emergency',
      items: [
        { description: 'Emergency triage and stabilization', amount: 2200 },
        { description: `Transfer to ${data.ward} (${data.bed})`, amount: 850 },
      ],
      total: 3050,
      paid: 0,
      status: 'pending',
    };
    setInvoices(prev => [invoice, ...prev]);

    pushWorkflowEvent({
      module: 'emergency',
      action: 'emergency_transferred_to_ipd',
      uhid,
      patientName: emergency.patientName,
      refId: admissionId,
      details: `Transferred from ER ${emergencyId} to ${data.ward} · ${data.bed}`,
    });

    pushWorkflowEvent({
      module: 'billing',
      action: 'emergency_invoice_created',
      uhid,
      patientName: emergency.patientName,
      refId: invoice.id,
      details: 'Emergency stabilization and transfer charges generated',
    });

    if (emergency.phone) {
      sendSmsNotification({
        recipientType: 'patient',
        recipient: emergency.phone,
        message: `${emergency.patientName}, your emergency case has been shifted to inpatient care (${data.ward} ${data.bed}).`,
        uhid,
        admissionId,
      });
    }

    sendSmsNotification({
      recipientType: 'doctor',
      recipient: data.attendingDoctor,
      message: `Emergency-to-IPD handoff: ${emergency.patientName} (${uhid}) shifted to ${data.ward} ${data.bed}.`,
      uhid,
      admissionId,
    });

    return { uhid, admissionId };
  }, [admitPatient, emergencyCases, pushWorkflowEvent, registerPatient, sendSmsNotification]);

  const addNursingRound = useCallback((data: {
    admissionId: string;
    nurse: string;
    shift: NursingRound['shift'];
    bp: string;
    pulse: number;
    temp: number;
    spo2: number;
    painScore: number;
    notes: string;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const roundId = `NR-${nursingRoundCounter++}`;
    const round: NursingRound = {
      id: roundId,
      admissionId: data.admissionId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      ward: admission.ward,
      bed: admission.bed,
      nurse: data.nurse,
      shift: data.shift,
      bp: data.bp,
      pulse: data.pulse,
      temp: data.temp,
      spo2: data.spo2,
      painScore: data.painScore,
      notes: data.notes,
      recordedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    setNursingRounds(prev => [round, ...prev]);

    const roundCharge = admission.ward.includes('ICU') ? 600 : 350;
    postServiceCharge({
      uhid: admission.uhid,
      patientName: admission.patientName,
      description: `Nursing round (${data.shift}) - ${admission.ward}`,
      amount: roundCharge,
      module: 'nurse',
      action: 'nursing_charge_posted',
      refId: roundId,
      categoryOverride: 'IPD',
    });

    pushWorkflowEvent({
      module: 'nurse',
      action: 'nursing_round_recorded',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: roundId,
      details: `Round recorded for ${admission.ward} · ${admission.bed}`,
    });
    toast.success('Nursing round recorded', { description: `${admission.patientName} · ${admission.bed}` });
    return roundId;
  }, [admissions, isAdmissionLocked, postServiceCharge, pushWorkflowEvent]);

  const addDoctorProgressNote = useCallback((data: {
    admissionId: string;
    doctor: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    followUpRequired?: boolean;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const createdAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const noteId = `DRN-${doctorProgressNoteCounter++}`;
    const note: DoctorProgressNote = {
      id: noteId,
      admissionId: data.admissionId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      doctor: data.doctor,
      subjective: data.subjective,
      objective: data.objective,
      assessment: data.assessment,
      plan: data.plan,
      followUpRequired: !!data.followUpRequired,
      createdAt,
    };

    setDoctorProgressNotes(prev => [note, ...prev]);
    setAdmissions(prev => prev.map(item => item.id === data.admissionId ? {
      ...item,
      currentTreatmentPlan: data.plan || item.currentTreatmentPlan,
      doctorRoundStatus: data.followUpRequired ? 'follow-up-required' : 'seen',
      lastDoctorRoundAt: createdAt,
    } : item));

    pushWorkflowEvent({
      module: 'doctor',
      action: 'doctor_progress_note_added',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: noteId,
      details: `SOAP progress note saved by ${data.doctor}`,
    });

    toast.success('Doctor progress note added', {
      description: data.followUpRequired ? 'Follow-up marked as required' : 'Round status updated to seen',
    });

    return noteId;
  }, [admissions, isAdmissionLocked, pushWorkflowEvent]);

  const markDoctorRoundCompleted = useCallback((admissionId: string, doctor: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (isAdmissionLocked(admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const completedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      doctorRoundStatus: 'seen',
      lastDoctorRoundAt: completedAt,
    } : item));

    pushWorkflowEvent({
      module: 'doctor',
      action: 'doctor_round_completed',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: admissionId,
      details: `Doctor round completed by ${doctor}`,
    });

    toast.success('Round marked as completed', {
      description: `${admission.patientName} · ${completedAt}`,
    });
  }, [admissions, isAdmissionLocked, pushWorkflowEvent]);

  const addAdmissionTask = useCallback((data: {
    admissionId: string;
    task: string;
    assignedTo: string;
    createdBy: string;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    if (isAdmissionLocked(data.admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const createdAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const taskId = `TASK-${admissionTaskCounter++}`;
    const task: AdmissionTask = {
      id: taskId,
      admissionId: data.admissionId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      task: data.task,
      assignedTo: data.assignedTo,
      createdBy: data.createdBy,
      status: 'Pending',
      createdAt,
    };

    setAdmissionTasks(prev => [task, ...prev]);
    setAdmissions(prev => prev.map(item => item.id === data.admissionId ? {
      ...item,
      doctorRoundStatus: 'follow-up-required',
    } : item));

    pushWorkflowEvent({
      module: 'doctor',
      action: 'admission_task_created',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: taskId,
      details: `Task assigned to ${data.assignedTo}: ${data.task}`,
    });

    toast.success('Task assigned to nursing', {
      description: `${data.assignedTo} · ${admission.patientName}`,
    });

    return taskId;
  }, [admissions, isAdmissionLocked, pushWorkflowEvent]);

  const updateAdmissionTaskStatus = useCallback((taskId: string, status: AdmissionTask['status']) => {
    const updatedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setAdmissionTasks(prev => prev.map(item => item.id === taskId ? {
      ...item,
      status,
      completedAt: status === 'Completed' ? updatedAt : undefined,
    } : item));

    const task = admissionTasks.find(item => item.id === taskId);
    if (task) {
      pushWorkflowEvent({
        module: 'nurse',
        action: 'admission_task_status_updated',
        uhid: task.uhid,
        patientName: task.patientName,
        refId: taskId,
        details: `Task moved to ${status}`,
      });
    }

    toast.success('Task status updated', { description: `${taskId} · ${status}` });
  }, [admissionTasks, pushWorkflowEvent]);

  const addInpatientCareOrder = useCallback((data: {
    admissionId: string;
    type: InpatientCareOrder['type'];
    item: string;
    priority: InpatientCareOrder['priority'];
    orderedBy: string;
  }) => {
    const admission = admissions.find(item => item.id === data.admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${data.admissionId}`);
    }

    const orderedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const orderId = `CO-${careOrderCounter++}`;
    const order: InpatientCareOrder = {
      id: orderId,
      admissionId: data.admissionId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      type: data.type,
      item: data.item,
      priority: data.priority,
      orderedBy: data.orderedBy,
      status: 'Pending',
      orderedAt,
    };

    setInpatientCareOrders(prev => [order, ...prev]);

    if (data.type === 'Procedure') {
      postServiceCharge({
        uhid: admission.uhid,
        patientName: admission.patientName,
        description: `Procedure order - ${data.item}`,
        amount: 900,
        module: 'doctor',
        action: 'procedure_charge_posted',
        refId: orderId,
        categoryOverride: 'IPD',
      });
    }

    if (data.type === 'Diet') {
      pushWorkflowEvent({
        module: 'nurse',
        action: 'diet_instruction_recorded',
        uhid: admission.uhid,
        patientName: admission.patientName,
        refId: orderId,
        details: `Diet instruction: ${data.item}`,
      });
    }

    pushWorkflowEvent({
      module: 'doctor',
      action: 'inpatient_care_order_created',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: orderId,
      details: `${data.type} order placed by ${data.orderedBy}`,
    });

    toast.success(`${data.type} order added`, { description: `${admission.patientName}` });
    return orderId;
  }, [admissions, postServiceCharge, pushWorkflowEvent]);

  const updateInpatientCareOrderStatus = useCallback((orderId: string, status: InpatientCareOrder['status']) => {
    setInpatientCareOrders(prev => prev.map(item => item.id === orderId ? { ...item, status } : item));
    const order = inpatientCareOrders.find(item => item.id === orderId);
    if (order) {
      pushWorkflowEvent({
        module: order.type === 'Diet' ? 'nurse' : 'doctor',
        action: 'inpatient_care_order_status_updated',
        uhid: order.uhid,
        patientName: order.patientName,
        refId: orderId,
        details: `${order.type} order moved to ${status}`,
      });
    }
    toast.success('Order status updated', { description: `${orderId} · ${status}` });
  }, [inpatientCareOrders, pushWorkflowEvent]);

  const applyDischargeSummaryTemplate = useCallback((
    admissionId: string,
    templateKey: 'general' | 'post-op' | 'maternity' | 'icu',
    doctor: string,
  ) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (isAdmissionLocked(admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    const baseTemplate = DISCHARGE_SUMMARY_TEMPLATES[templateKey];
    const summary = baseTemplate
      .replace('{{diagnosis}}', admission.primaryDiagnosis || 'Inpatient management');

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      dischargeSummary: summary,
    } : item));

    pushWorkflowEvent({
      module: 'doctor',
      action: 'discharge_template_applied',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: admissionId,
      details: `${templateKey} template applied by ${doctor}`,
    });
  }, [admissions, isAdmissionLocked, pushWorkflowEvent]);

  const saveAdmissionDischargeSummary = useCallback((admissionId: string, summary: string, doctor: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (isAdmissionLocked(admissionId)) {
      throw new Error('Admission is locked after discharge. Admin unlock required.');
    }

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      dischargeSummary: summary,
    } : item));

    pushWorkflowEvent({
      module: 'doctor',
      action: 'discharge_summary_saved',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: admissionId,
      details: `Discharge summary draft saved by ${doctor}`,
    });

    toast.success('Discharge summary saved');
  }, [admissions, isAdmissionLocked, pushWorkflowEvent]);

  const updateAdmissionStatus = useCallback((admissionId: string, status: AdmissionCase['status']) => {
    const statusChangedAt = nowStamp();
    const admission = admissions.find(item => item.id === admissionId);

    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (admission.isIpLocked && status !== 'discharged') {
      toast.error('Admission is locked after discharge. Admin unlock required.');
      return;
    }

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      status,
      dischargeReadyAt: status === 'discharge-ready' ? statusChangedAt : item.dischargeReadyAt,
      doctorRoundStatus: status === 'discharged' ? 'seen' : item.doctorRoundStatus,
      lastDoctorRoundAt: status === 'discharged' ? (item.lastDoctorRoundAt || statusChangedAt) : item.lastDoctorRoundAt,
      billingStage: status === 'discharge-ready' ? (item.billingStage === 'finalized' ? item.billingStage : 'interim') : item.billingStage,
      isIpLocked: status === 'discharged' ? true : item.isIpLocked,
      ipLockedAt: status === 'discharged' ? statusChangedAt : item.ipLockedAt,
      ipLockReason: status === 'discharged' ? 'Auto lock after discharge' : item.ipLockReason,
    } : item));

    if (admission && status === 'discharge-ready') {
      postServiceCharge({
        uhid: admission.uhid,
        patientName: admission.patientName,
        description: `Discharge planning and summary (${admissionId})`,
        amount: 950,
        module: 'doctor',
        action: 'discharge_planning_charge_posted',
        refId: admissionId,
        categoryOverride: 'IPD',
      });
    }

    if (admission && status === 'discharged') {
      postServiceCharge({
        uhid: admission.uhid,
        patientName: admission.patientName,
        description: `Nursing discharge handover (${admissionId})`,
        amount: 500,
        module: 'nurse',
        action: 'nursing_discharge_charge_posted',
        refId: admissionId,
        categoryOverride: 'IPD',
      });
    }

    pushWorkflowEvent({
      module: 'doctor',
      action: 'admission_status_updated',
      uhid: admission?.uhid,
      patientName: admission?.patientName,
      refId: admissionId,
      details: `Admission status moved to ${status}`,
    });

    const patient = patients.find(item => item.uhid === admission.uhid);
    if (status === 'discharge-ready' && patient?.phone) {
      sendSmsNotification({
        recipientType: 'patient',
        recipient: patient.phone,
        message: `${admission.patientName}, your discharge process has started. Please connect with billing desk for final settlement.`,
        uhid: admission.uhid,
        admissionId,
      });
    }

    if (status === 'discharged' && patient?.phone) {
      sendSmsNotification({
        recipientType: 'patient',
        recipient: patient.phone,
        message: `${admission.patientName}, you are discharged. We wish you a healthy recovery.`,
        uhid: admission.uhid,
        admissionId,
      });
    }

    toast.success(`Admission ${admissionId} updated to ${status}`);
  }, [admissions, nowStamp, patients, postServiceCharge, pushWorkflowEvent, sendSmsNotification]);

  const unlockAdmissionEditLock = useCallback((admissionId: string, adminName: string, reason: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (!admission.isIpLocked) {
      toast.info('Admission is already editable.');
      return;
    }

    const unlockedAt = nowStamp();
    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      isIpLocked: false,
      ipUnlockedAt: unlockedAt,
      ipUnlockReason: reason,
    } : item));

    pushWorkflowEvent({
      module: 'admin',
      action: 'admission_lock_released',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: admissionId,
      details: `Unlock by ${adminName}: ${reason}`,
    });

    toast.success(`Admission ${admissionId} unlocked for edits`);
  }, [admissions, nowStamp, pushWorkflowEvent]);

  const assignAdmissionBed = useCallback((
    admissionId: string,
    ward: string,
    bed: string,
    assignedNurse?: string,
    nextDoctorRoundAt?: string,
    reason?: string,
    shiftedBy?: string,
  ) => {
    const admission = admissions.find(item => item.id === admissionId);

    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (isAdmissionLocked(admissionId)) {
      toast.error('Admission is locked after discharge. Admin unlock required.');
      return;
    }

    const bedNo = Number.parseInt(bed.split('-').pop() || '1', 10);
    const roomNo = Number.isNaN(bedNo) ? 1 : Math.max(1, Math.ceil(bedNo / 2));
    const room = ward === 'ICU' ? `ICU Bay ${roomNo}` : `${ward} Room ${roomNo}`;

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      ward,
      room,
      bed,
      assignedNurse: assignedNurse ?? item.assignedNurse,
      nextDoctorRoundAt: nextDoctorRoundAt ?? item.nextDoctorRoundAt,
    } : item));

    if (admission.ward !== ward || admission.bed !== bed) {
      const shiftedAt = nowStamp();
      const shiftId = `RSH-${roomShiftCounter++}`;
      const shiftRecord: RoomShiftRecord = {
        id: shiftId,
        admissionId,
        uhid: admission.uhid,
        patientName: admission.patientName,
        fromWard: admission.ward,
        fromRoom: admission.room,
        fromBed: admission.bed,
        toWard: ward,
        toRoom: room,
        toBed: bed,
        reason: reason || 'Bed reassignment',
        shiftedBy: shiftedBy || assignedNurse || 'Ward Desk',
        shiftedAt,
      };
      setRoomShiftHistory(prev => [shiftRecord, ...prev]);
    }

    pushWorkflowEvent({
      module: 'nurse',
      action: 'admission_bed_reassigned',
      uhid: admission?.uhid,
      patientName: admission?.patientName,
      refId: admissionId,
      details: `Moved to ${ward} · ${room} · ${bed}${assignedNurse ? ` (nurse: ${assignedNurse})` : ''}${reason ? ` · reason: ${reason}` : ''}`,
    });
    toast.success(`Bed assigned: ${ward} · ${bed}`);
  }, [admissions, isAdmissionLocked, nowStamp, pushWorkflowEvent]);

  const generateInterimBill = useCallback((admissionId: string, note?: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    const openInvoice = invoices.find(
      item => item.uhid === admission.uhid
        && item.category === 'IPD'
        && (item.status === 'pending' || item.status === 'partial'),
    );
    if (!openInvoice) {
      toast.info('No open IPD invoice found to create interim bill.');
      return null;
    }

    const balance = Math.max(0, openInvoice.total - openInvoice.paid);
    if (balance <= 0) {
      toast.info('No outstanding amount available for interim bill.');
      return null;
    }

    const interimId = `INV-${invoiceCounter++}`;
    const interimInvoice: BillingInvoice = {
      id: interimId,
      uhid: admission.uhid,
      patientName: admission.patientName,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: 'IPD',
      items: [{ description: note || `Interim billing snapshot from ${openInvoice.id}`, amount: balance }],
      total: balance,
      paid: 0,
      status: 'pending',
    };

    setInvoices(prev => [interimInvoice, ...prev]);
    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      billingStage: 'interim',
    } : item));

    pushWorkflowEvent({
      module: 'billing',
      action: 'interim_bill_generated',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: interimId,
      details: `Interim invoice generated from ${openInvoice.id}`,
    });

    toast.success('Interim bill generated', { description: interimId });
    return interimId;
  }, [admissions, invoices, pushWorkflowEvent]);

  const applyFinalBillDiscount = useCallback((admissionId: string, amount: number, reason: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    if (amount <= 0) {
      toast.error('Discount amount must be greater than zero.');
      return null;
    }

    const activeInvoice = invoices.find(
      item => item.uhid === admission.uhid
        && item.category === 'IPD'
        && (item.status === 'pending' || item.status === 'partial'),
    );

    if (!activeInvoice) {
      toast.error('No active IPD invoice found for discount.');
      return null;
    }

    const cappedDiscount = Math.min(amount, activeInvoice.total);
    setInvoices(prev => prev.map(item => {
      if (item.id !== activeInvoice.id) {
        return item;
      }

      const nextItems = [...item.items, {
        description: `Final bill discount${reason ? ` (${reason})` : ''}`,
        amount: -cappedDiscount,
      }];
      const nextTotal = Math.max(0, item.total - cappedDiscount);
      return {
        ...item,
        items: nextItems,
        total: nextTotal,
        discountAmount: (item.discountAmount || 0) + cappedDiscount,
        discountReason: reason,
        status: item.paid >= nextTotal ? 'paid' : item.paid > 0 ? 'partial' : 'pending',
      };
    }));

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      finalBillDiscountAmount: (item.finalBillDiscountAmount || 0) + cappedDiscount,
      finalBillDiscountReason: reason,
    } : item));

    pushWorkflowEvent({
      module: 'billing',
      action: 'final_bill_discount_applied',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: activeInvoice.id,
      details: `Discount ₹${cappedDiscount.toLocaleString('en-IN')} applied${reason ? ` · ${reason}` : ''}`,
    });

    toast.success('Final bill discount applied');
    return activeInvoice.id;
  }, [admissions, invoices, pushWorkflowEvent]);

  const finalizeAdmissionBill = useCallback((admissionId: string) => {
    const admission = admissions.find(item => item.id === admissionId);
    if (!admission) {
      throw new Error(`Admission not found: ${admissionId}`);
    }

    const activeInvoice = invoices.find(
      item => item.uhid === admission.uhid
        && item.category === 'IPD'
        && (item.status === 'pending' || item.status === 'partial' || item.status === 'paid'),
    );

    if (!activeInvoice) {
      toast.error('No IPD invoice available to finalize.');
      return null;
    }

    setInvoices(prev => prev.map(item => item.id === activeInvoice.id ? {
      ...item,
      finalized: true,
      status: item.paid >= item.total ? 'paid' : item.paid > 0 ? 'partial' : 'pending',
    } : item));

    setAdmissions(prev => prev.map(item => item.id === admissionId ? {
      ...item,
      billingStage: 'finalized',
    } : item));

    pushWorkflowEvent({
      module: 'billing',
      action: 'final_bill_generated',
      uhid: admission.uhid,
      patientName: admission.patientName,
      refId: activeInvoice.id,
      details: `Final IPD bill generated for ${admissionId}`,
    });

    toast.success('Final bill generated', { description: activeInvoice.id });
    return activeInvoice.id;
  }, [admissions, invoices, pushWorkflowEvent]);

  const collectPayment = useCallback((invoiceId: string, amount: number, mode: PaymentMode, reference?: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const balance = Math.max(0, inv.total - inv.paid);
      const collected = Math.min(balance, Math.max(0, amount));
      const newPaid = inv.paid + collected;
      return {
        ...inv,
        paid: newPaid,
        status: newPaid === 0 ? 'pending' as const : newPaid >= inv.total ? 'paid' as const : 'partial' as const,
        paymentMode: mode,
      };
    }));
    const invoice = invoices.find(item => item.id === invoiceId);
    if (invoice) {
      const transaction: BillingTransaction = {
        id: `TXN-${billingTransactionCounter++}`,
        invoiceId,
        uhid: invoice.uhid,
        patientName: invoice.patientName,
        kind: 'payment',
        amount,
        mode,
        reference,
        createdAt: nowStamp(),
      };
      setBillingTransactions(prev => [transaction, ...prev]);
    }

    pushWorkflowEvent({
      module: 'billing',
      action: 'payment_collected',
      uhid: invoice?.uhid,
      patientName: invoice?.patientName,
      refId: invoiceId,
      details: `Received ₹${amount.toLocaleString('en-IN')} via ${mode}${reference ? ` · ref ${reference}` : ''}`,
    });
    toast.success(`Payment ₹${amount.toLocaleString('en-IN')} collected`, { description: `Invoice: ${invoiceId}` });
  }, [invoices, nowStamp, pushWorkflowEvent]);

  const refundPayment = useCallback((invoiceId: string, amount: number, mode: PaymentMode, reason?: string, reference?: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const refundable = Math.min(inv.paid, Math.max(0, amount));
      const newPaid = inv.paid - refundable;
      return {
        ...inv,
        paid: newPaid,
        status: newPaid === 0 ? 'pending' as const : newPaid >= inv.total ? 'paid' as const : 'partial' as const,
        paymentMode: mode,
      };
    }));

    const invoice = invoices.find(item => item.id === invoiceId);
    if (invoice) {
      const transaction: BillingTransaction = {
        id: `TXN-${billingTransactionCounter++}`,
        invoiceId,
        uhid: invoice.uhid,
        patientName: invoice.patientName,
        kind: 'refund',
        amount,
        mode,
        reason,
        reference,
        createdAt: nowStamp(),
      };
      setBillingTransactions(prev => [transaction, ...prev]);
    }

    pushWorkflowEvent({
      module: 'billing',
      action: 'payment_refunded',
      uhid: invoice?.uhid,
      patientName: invoice?.patientName,
      refId: invoiceId,
      details: `Refunded ₹${amount.toLocaleString('en-IN')} via ${mode}${reference ? ` · ref ${reference}` : ''}${reason ? ` · ${reason}` : ''}`,
    });
    toast.success(`Refund ₹${amount.toLocaleString('en-IN')} processed`, { description: `Invoice: ${invoiceId}` });
  }, [invoices, nowStamp, pushWorkflowEvent]);

  const createInvoice = useCallback((data: Omit<BillingInvoice, 'id'>) => {
    const id = `INV-${invoiceCounter++}`;
    setInvoices(prev => [{ ...data, id }, ...prev]);
    pushWorkflowEvent({
      module: 'billing',
      action: 'invoice_created_manual',
      uhid: data.uhid,
      patientName: data.patientName,
      refId: id,
      details: `Manual ${data.category} invoice generated`,
    });
    return id;
  }, [pushWorkflowEvent]);

  const createEstimate = useCallback((data: Omit<BillingEstimate, 'id' | 'status'>) => {
    const id = `EST-${estimateCounter++}`;
    setEstimates(prev => [{ ...data, id, status: 'draft' }, ...prev]);
    pushWorkflowEvent({
      module: 'billing',
      action: 'estimate_created',
      uhid: data.uhid,
      patientName: data.patientName,
      refId: id,
      details: `Estimate generated for ${data.category} with ${data.items.length} item(s)`,
    });
    return id;
  }, [pushWorkflowEvent]);

  const convertEstimateToInvoice = useCallback((estimateId: string) => {
    const estimate = estimates.find(item => item.id === estimateId && item.status === 'draft');
    if (!estimate) {
      return null;
    }

    const invoiceId = `INV-${invoiceCounter++}`;
    setInvoices(prev => [{
      id: invoiceId,
      uhid: estimate.uhid,
      patientName: estimate.patientName,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: estimate.category,
      items: estimate.items,
      total: estimate.total,
      paid: 0,
      status: 'pending',
    }, ...prev]);

    setEstimates(prev => prev.map(item => item.id === estimateId ? { ...item, status: 'converted' } : item));

    pushWorkflowEvent({
      module: 'billing',
      action: 'estimate_converted_to_invoice',
      uhid: estimate.uhid,
      patientName: estimate.patientName,
      refId: invoiceId,
      details: `Estimate ${estimateId} converted to invoice ${invoiceId}`,
    });

    toast.success(`Estimate ${estimateId} converted`, { description: `Invoice: ${invoiceId}` });
    return invoiceId;
  }, [estimates, pushWorkflowEvent]);

  const getPatientWorkflowTimeline = useCallback((uhid: string) => {
    return workflowEvents.filter(event => event.uhid === uhid);
  }, [workflowEvents]);

  return (
    <HospitalContext.Provider value={{
      patients, appointments, queue, labOrders, prescriptions, pharmacyInventory, radiologyOrders, invoices,
      estimates,
      emergencyCases, admissions, nursingRounds, doctorProgressNotes, admissionTasks, inpatientCareOrders,
      wardMedicineIssues, otRecords, roomShiftHistory, departmentTransfers, notificationLogs, billingTransactions,
      workflowEvents,
      registerPatient, startFrontDeskVisit, admitPatient, transferOpdToIPD, convertOpdToIPDByUHID, bookAppointment, updateAppointmentStatus, checkInPatient,
      updateQueueStatus, nextQueuePatient, saveConsultation, updateLabStage, updateLabOrder,
      updatePrescriptionStatus, updateMedicationLineStatus, dispensePrescription, updateRadiologyOrder,
      addDailyServiceCharge, issueWardMedicine, updateWardMedicineIssueStatus,
      addInvestigationOrder, upsertOTRecord, assignConsultantDoctor, transferAdmissionDepartment,
      createEmergencyCase, triageEmergencyCase, transferEmergencyToIPD,
      addNursingRound, addDoctorProgressNote, markDoctorRoundCompleted,
      addAdmissionTask, updateAdmissionTaskStatus,
      addInpatientCareOrder, updateInpatientCareOrderStatus,
      applyDischargeSummaryTemplate, saveAdmissionDischargeSummary,
      updateAdmissionStatus, unlockAdmissionEditLock, assignAdmissionBed,
      generateInterimBill, finalizeAdmissionBill, applyFinalBillDiscount,
      collectPayment, refundPayment, createInvoice, createEstimate, convertEstimateToInvoice, getPatientWorkflowTimeline,
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be used within HospitalProvider');
  return ctx;
}
