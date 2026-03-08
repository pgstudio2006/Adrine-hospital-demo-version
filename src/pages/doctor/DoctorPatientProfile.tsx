import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, MapPin, AlertCircle, Activity, Calendar, FileText, Pill, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface PatientDetail {
  id: string;
  name: string;
  initials: string;
  uhid: string;
  age: number;
  gender: string;
  bloodGroup: string;
  abhaId: string;
  phone: string;
  email: string;
  city: string;
  allergies: string[];
  vitals: { bp: string; hr: string; spo2: string; temp: string };
  vitalsHistory: number[][];
  healthScore: number;
  healthLabel: string;
  visits: Visit[];
}

interface Visit {
  date: string;
  complaint: string;
  doctor: string;
  status: string;
}

const mockPatient: Record<string, PatientDetail> = {
  '1': {
    id: '1', name: 'Rajesh Kumar', initials: 'RK', uhid: 'ADR-2024-0001', age: 45, gender: 'Male', bloodGroup: 'B+',
    abhaId: '12345678901234', phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', city: 'Mumbai',
    allergies: ['Penicillin'],
    vitals: { bp: '120/80', hr: '78', spo2: '98', temp: '98.6' },
    vitalsHistory: [[120, 80], [122, 82], [118, 78], [124, 84]],
    healthScore: 81, healthLabel: 'GOOD',
    visits: [
      { date: '2026-03-08', complaint: 'Fever and headache since 2 days', doctor: 'Dr. Amit Sharma', status: 'Checked-in' },
      { date: '2026-02-15', complaint: 'Blood sugar monitoring', doctor: 'Dr. Amit Sharma', status: 'Completed' },
      { date: '2026-01-20', complaint: 'Routine diabetes follow-up', doctor: 'Dr. Amit Sharma', status: 'Completed' },
    ],
  },
  '2': {
    id: '2', name: 'Priya Sharma', initials: 'PS', uhid: 'ADR-2024-0002', age: 32, gender: 'Female', bloodGroup: 'A+',
    abhaId: '23456789012345', phone: '+91 87654 32109', email: 'priya.sharma@email.com', city: 'Delhi',
    allergies: ['Sulfa drugs', 'Aspirin'],
    vitals: { bp: '110/72', hr: '74', spo2: '99', temp: '98.2' },
    vitalsHistory: [[110, 72], [112, 74], [108, 70], [114, 76]],
    healthScore: 92, healthLabel: 'EXCELLENT',
    visits: [
      { date: '2026-03-07', complaint: 'Thyroid medication review', doctor: 'Dr. Amit Sharma', status: 'Completed' },
    ],
  },
};

// Generate entries for IDs 3-10
['Amit Singh', 'Sunita Devi', 'Mohammed Ali', 'Kavita Reddy', 'Suresh Patel', 'Anita Gupta', 'Deepak Verma', 'Lakshmi Nair'].forEach((name, i) => {
  const id = String(i + 3);
  const initials = name.split(' ').map(n => n[0]).join('');
  mockPatient[id] = {
    id, name, initials, uhid: `ADR-2024-${String(i + 3).padStart(4, '0')}`, age: 30 + i * 5, gender: i % 2 === 0 ? 'Male' : 'Female',
    bloodGroup: ['O+', 'AB+', 'B-', 'O-', 'A-', 'AB-', 'B+', 'O+'][i], abhaId: `${34567890123456 + i}`,
    phone: `+91 ${76543 + i * 1000} ${21098 - i * 100}`, email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    city: ['Pune', 'Jaipur', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata', 'Lucknow', 'Kochi'][i],
    allergies: i === 0 ? ['NSAIDs'] : [],
    vitals: { bp: '120/80', hr: '76', spo2: '97', temp: '98.4' },
    vitalsHistory: [[120, 80], [118, 78], [122, 82], [120, 80]],
    healthScore: 70 + i * 3, healthLabel: i > 4 ? 'GOOD' : 'FAIR',
    visits: [{ date: '2026-03-01', complaint: 'Follow-up visit', doctor: 'Dr. Amit Sharma', status: 'Completed' }],
  };
});

const tabOptions = ['History', 'Prescriptions', 'Labs', 'ABDM'];

export default function DoctorPatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');

  const patient = mockPatient[patientId ?? '1'] ?? mockPatient['1'];

  // Health score arc
  const scoreAngle = (patient.healthScore / 100) * 270;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/doctor/patients')} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border">
            <span className="text-lg font-bold">{patient.initials}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-xs">{patient.uhid}</span>
              <span className="mx-2">·</span>{patient.age}y
              <span className="mx-2">·</span>{patient.gender}
              <span className="mx-2">·</span>{patient.bloodGroup}
              <span className="mx-2">·</span>
              <span className="text-blue-600 font-medium">◯ {patient.abhaId}</span>
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90">
          Start Consultation
        </Button>
      </motion.div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-5">
        {/* Left Column — Contact, Allergies, Vitals */}
        <motion.div {...fadeIn(1)} className="space-y-4">
          {/* Contact */}
          <div className="border rounded-xl bg-card p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contact</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{patient.city}</span>
              </div>
            </div>
          </div>

          {/* Allergies */}
          {patient.allergies.length > 0 && (
            <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-destructive font-semibold flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5" /> Allergies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.map(a => (
                  <span key={a} className="text-xs font-medium text-destructive border border-destructive/30 rounded-full px-2.5 py-0.5">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vitals */}
          <div className="border rounded-xl bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Vitals</p>
            <div className="space-y-4">
              {[
                { label: 'BP', value: patient.vitals.bp, unit: 'mmHg' },
                { label: 'HR', value: patient.vitals.hr, unit: 'bpm' },
                { label: 'SpO2', value: patient.vitals.spo2, unit: '%' },
                { label: 'Temp', value: patient.vitals.temp, unit: '°F' },
              ].map(v => (
                <div key={v.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">{v.label}</p>
                    <p className="text-lg font-bold">{v.value} <span className="text-xs font-normal text-muted-foreground">{v.unit}</span></p>
                  </div>
                  {/* Mini sparkline bar */}
                  <div className="flex items-end gap-0.5 h-6">
                    {[0.6, 0.8, 0.7, 0.9].map((h, i) => (
                      <div key={i} className="w-3 bg-foreground rounded-sm" style={{ height: `${h * 100}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center — Tabs (History / Prescriptions / Labs / ABDM) */}
        <motion.div {...fadeIn(2)} className="border rounded-xl bg-card overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {tabOptions.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'ABDM' && <span className="mr-1">☰</span>}
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="patientTab" className="absolute inset-x-2 -bottom-px h-0.5 bg-foreground rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            {activeTab === 'History' && (
              <div className="space-y-3">
                {patient.visits.map((visit, i) => (
                  <div key={i} className="flex items-start justify-between py-4 border-b last:border-0">
                    <div>
                      <p className="text-sm font-semibold">{visit.date}</p>
                      <p className="text-sm text-muted-foreground mt-1">{visit.complaint}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{visit.doctor}</p>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-full shrink-0">{visit.status}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Prescriptions' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Pill className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No prescriptions yet</p>
                <p className="text-xs text-muted-foreground mt-1">Prescriptions will appear here after consultation</p>
              </div>
            )}

            {activeTab === 'Labs' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Activity className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No lab results</p>
                <p className="text-xs text-muted-foreground mt-1">Lab reports will appear here</p>
              </div>
            )}

            {activeTab === 'ABDM' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CreditCard className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">ABDM Records</p>
                <p className="text-xs text-muted-foreground mt-1">Health records linked via ABHA ID</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column — Health Score + Upcoming */}
        <motion.div {...fadeIn(3)} className="space-y-4">
          {/* Health Score */}
          <div className="border rounded-xl bg-card p-5 flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-4 self-start">Health Score</p>
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" strokeDasharray={`${(270 / 360) * 314} 314`} strokeLinecap="round" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--foreground))" strokeWidth="10" strokeDasharray={`${(scoreAngle / 360) * 314} 314`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{patient.healthScore}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{patient.healthLabel}</span>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="border rounded-xl bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Upcoming</p>
            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
