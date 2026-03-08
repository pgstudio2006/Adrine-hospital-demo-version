import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

// ── Shared Types ──
export interface HospitalPatient {
  uhid: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup?: string;
  abhaId?: string;
  aadhaar?: string;
  category: 'general' | 'corporate' | 'insurance' | 'government' | 'vip';
  patientType: 'OPD' | 'IPD' | 'Emergency';
  department?: string;
  assignedDoctor?: string;
  allergies?: string;
  chronicDiseases?: string;
  registeredOn: string;
  lastVisit?: string;
  branch: string;
  insuranceProvider?: string;
  policyNo?: string;
  isMLC?: boolean;
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
  meds: { drug: string; dosage: string; frequency: string; duration: string; route: string; qty: number; dispensed: number }[];
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
  paymentMode?: string;
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
  { orderId: 'LO-4521', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', tests: 'CBC, Lipid Profile, HbA1c', category: 'Hematology', priority: 'Urgent', doctor: 'Dr. R. Mehta', orderTime: '10:15 AM', stage: 'Pending Analysis', sampleStatus: 'Received' },
  { orderId: 'LO-4520', uhid: 'UHID-240003', patientName: 'Amit Kumar', tests: 'ABG, Electrolytes, RFT', category: 'Biochemistry', priority: 'Emergency', doctor: 'Dr. A. Shah', orderTime: '10:00 AM', stage: 'In Analysis', sampleStatus: 'Processing' },
];

const SEED_PRESCRIPTIONS: PrescriptionOrder[] = [
  { id: 'RX-2401', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', doctor: 'Dr. R. Mehta', department: 'Cardiology', date: '2026-03-08', priority: 'Routine', status: 'Pending', meds: [
    { drug: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'OD', duration: '30 days', route: 'Oral', qty: 30, dispensed: 0 },
    { drug: 'Aspirin 75mg', dosage: '75mg', frequency: 'OD', duration: '30 days', route: 'Oral', qty: 30, dispensed: 0 },
  ]},
];

const SEED_RADIOLOGY: RadiologyOrder[] = [
  { orderId: 'RD-1001', uhid: 'UHID-240003', patientName: 'Amit Kumar', study: 'Chest X-Ray PA', modality: 'X-Ray', priority: 'Urgent', doctor: 'Dr. A. Shah', orderTime: '10:05 AM', status: 'Ordered' },
];

const SEED_INVOICES: BillingInvoice[] = [
  { id: 'INV-5001', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', date: '8 Mar 2026', category: 'OPD', items: [{ description: 'Consultation - Cardiology', amount: 800 }, { description: 'ECG', amount: 500 }], total: 1300, paid: 1300, status: 'paid', paymentMode: 'upi' },
  { id: 'INV-5002', uhid: 'UHID-240002', patientName: 'Priya Patel', date: '8 Mar 2026', category: 'OPD', items: [{ description: 'Consultation - Gynecology', amount: 1000 }], total: 1000, paid: 0, status: 'pending' },
];

// ── Counter helpers ──
let patientCounter = 240009;
let appointmentCounter = 10007;
let tokenCounter = 103;
let labOrderCounter = 4522;
let rxCounter = 2402;
let radiologyCounter = 1002;
let invoiceCounter = 5003;

// ── Context ──
interface HospitalStore {
  patients: HospitalPatient[];
  appointments: HospitalAppointment[];
  queue: QueueEntry[];
  labOrders: LabOrder[];
  prescriptions: PrescriptionOrder[];
  radiologyOrders: RadiologyOrder[];
  invoices: BillingInvoice[];

  // Actions
  registerPatient: (data: Omit<HospitalPatient, 'uhid' | 'registeredOn'>) => string;
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

  // Pharmacy actions
  dispensePrescription: (rxId: string, quantities: Record<number, number>) => void;

  // Billing actions
  collectPayment: (invoiceId: string, amount: number, mode: string) => void;
  createInvoice: (data: Omit<BillingInvoice, 'id'>) => string;
}

const HospitalContext = createContext<HospitalStore | null>(null);

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<HospitalPatient[]>(SEED_PATIENTS);
  const [appointments, setAppointments] = useState<HospitalAppointment[]>(SEED_APPOINTMENTS);
  const [queue, setQueue] = useState<QueueEntry[]>(SEED_QUEUE);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(SEED_LAB_ORDERS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(SEED_PRESCRIPTIONS);
  const [radiologyOrders, setRadiologyOrders] = useState<RadiologyOrder[]>(SEED_RADIOLOGY);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(SEED_INVOICES);

  const registerPatient = useCallback((data: Omit<HospitalPatient, 'uhid' | 'registeredOn'>) => {
    const uhid = `UHID-${patientCounter++}`;
    const patient: HospitalPatient = { ...data, uhid, registeredOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) };
    setPatients(prev => [patient, ...prev]);
    toast.success(`Patient registered: ${patient.name}`, { description: `UHID: ${uhid}` });
    return uhid;
  }, []);

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
        uhid: data.uhid,
        patientName: data.patientName,
        tests: t.tests,
        category: t.category,
        priority: t.priority,
        doctor: data.doctor,
        orderTime: now,
        stage: 'Pending Analysis' as const,
        sampleStatus: 'Ordered' as const,
      }));
      setLabOrders(prev => [...newLabOrders, ...prev]);
    }

    // Create prescriptions
    if (data.medications && data.medications.length > 0) {
      const rx: PrescriptionOrder = {
        id: `RX-${rxCounter++}`,
        uhid: data.uhid,
        patientName: data.patientName,
        doctor: data.doctor,
        department: data.department,
        date: new Date().toISOString().split('T')[0],
        priority: 'Routine',
        status: 'Pending',
        meds: data.medications.map(m => ({ ...m, dispensed: 0 })),
      };
      setPrescriptions(prev => [rx, ...prev]);
    }

    // Create radiology orders
    if (data.radiologyOrders && data.radiologyOrders.length > 0) {
      const newRads: RadiologyOrder[] = data.radiologyOrders.map(r => ({
        orderId: `RD-${radiologyCounter++}`,
        uhid: data.uhid,
        patientName: data.patientName,
        study: r.study,
        modality: r.modality,
        priority: r.priority,
        doctor: data.doctor,
        orderTime: now,
        status: 'Ordered' as const,
      }));
      setRadiologyOrders(prev => [...newRads, ...prev]);
    }

    // Create billing invoice
    const billingItems: { description: string; amount: number }[] = [];
    if (data.consultationFee) billingItems.push({ description: `Consultation - ${data.department}`, amount: data.consultationFee });
    if (data.labTests) data.labTests.forEach(t => billingItems.push({ description: `Lab: ${t.tests}`, amount: 500 }));
    if (data.radiologyOrders) data.radiologyOrders.forEach(r => billingItems.push({ description: `Radiology: ${r.study}`, amount: 1000 }));

    if (billingItems.length > 0) {
      const total = billingItems.reduce((s, i) => s + i.amount, 0);
      const inv: BillingInvoice = {
        id: `INV-${invoiceCounter++}`,
        uhid: data.uhid,
        patientName: data.patientName,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        category: 'OPD',
        items: billingItems,
        total,
        paid: 0,
        status: 'pending',
      };
      setInvoices(prev => [inv, ...prev]);
    }

    // Update patient's last visit
    setPatients(prev => prev.map(p => p.uhid === data.uhid ? { ...p, lastVisit: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) } : p));

    // Complete queue entry
    setQueue(prev => prev.map(q => q.uhid === data.uhid && q.status === 'in-consultation' ? { ...q, status: 'completed' as const } : q));

    toast.success('Consultation saved', {
      description: `${data.labTests?.length || 0} lab orders, ${data.medications?.length || 0} medications, ${data.radiologyOrders?.length || 0} radiology orders created`,
    });
  }, []);

  const updateLabStage = useCallback((orderId: string, stage: LabOrder['stage']) => {
    setLabOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, stage } : o));
    toast.success(`Lab order ${orderId} updated to ${stage}`);
  }, []);

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
    toast.success(`Prescription ${rxId} dispensed`);
  }, []);

  const collectPayment = useCallback((invoiceId: string, amount: number, mode: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const newPaid = inv.paid + amount;
      return {
        ...inv,
        paid: newPaid,
        status: newPaid >= inv.total ? 'paid' as const : 'partial' as const,
        paymentMode: mode,
      };
    }));
    toast.success(`Payment ₹${amount.toLocaleString('en-IN')} collected`, { description: `Invoice: ${invoiceId}` });
  }, []);

  const createInvoice = useCallback((data: Omit<BillingInvoice, 'id'>) => {
    const id = `INV-${invoiceCounter++}`;
    setInvoices(prev => [{ ...data, id }, ...prev]);
    return id;
  }, []);

  return (
    <HospitalContext.Provider value={{
      patients, appointments, queue, labOrders, prescriptions, radiologyOrders, invoices,
      registerPatient, bookAppointment, updateAppointmentStatus, checkInPatient,
      updateQueueStatus, nextQueuePatient, saveConsultation, updateLabStage,
      dispensePrescription, collectPayment, createInvoice,
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
