import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, MapPin, AlertCircle, Activity, Calendar, FileText, Pill, CreditCard, Syringe, Heart, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface PatientDetail {
  id: string; name: string; initials: string; uhid: string; age: number; gender: string;
  bloodGroup: string; abhaId: string; phone: string; email: string; city: string;
  allergies: { name: string; type: string; severity: string; reaction: string }[];
  vitals: { bp: string; hr: string; spo2: string; temp: string; rr: string; weight: string; height: string; bmi: string };
  healthScore: number; healthLabel: string;
  visits: { date: string; complaint: string; doctor: string; status: string; type: string }[];
  prescriptions: { date: string; doctor: string; drugs: { name: string; dosage: string; frequency: string; duration: string }[] }[];
  labReports: { date: string; test: string; status: string; flagged: boolean }[];
  surgicalHistory: { date: string; procedure: string; surgeon: string; outcome: string }[];
  chronicDiseases: string[];
  familyHistory: { relation: string; condition: string }[];
  immunizations: { name: string; date: string; dueDate?: string }[];
  dischargeSummaries: { date: string; diagnosis: string; stayDays: number }[];
  pastMedicalHistory: string[];
}

const mockPatient: Record<string, PatientDetail> = {
  '1': {
    id: '1', name: 'Rajesh Kumar', initials: 'RK', uhid: 'ADR-2024-0001', age: 45, gender: 'Male', bloodGroup: 'B+',
    abhaId: '12345678901234', phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', city: 'Mumbai',
    allergies: [
      { name: 'Penicillin', type: 'Drug', severity: 'Severe', reaction: 'Anaphylaxis' },
      { name: 'Sulfa drugs', type: 'Drug', severity: 'Moderate', reaction: 'Skin rash' },
    ],
    vitals: { bp: '120/80', hr: '78', spo2: '98', temp: '98.6', rr: '18', weight: '70', height: '170', bmi: '24.2' },
    healthScore: 81, healthLabel: 'GOOD',
    visits: [
      { date: '2026-03-08', complaint: 'Fever and headache since 2 days', doctor: 'Dr. Amit Sharma', status: 'Checked-in', type: 'OPD' },
      { date: '2026-02-15', complaint: 'Blood sugar monitoring', doctor: 'Dr. Amit Sharma', status: 'Completed', type: 'OPD' },
      { date: '2026-01-20', complaint: 'Routine diabetes follow-up', doctor: 'Dr. Amit Sharma', status: 'Completed', type: 'OPD' },
      { date: '2025-11-10', complaint: 'Chest pain evaluation', doctor: 'Dr. Kavita Reddy', status: 'Completed', type: 'Emergency' },
      { date: '2025-09-05', complaint: 'Annual health checkup', doctor: 'Dr. Amit Sharma', status: 'Completed', type: 'OPD' },
    ],
    prescriptions: [
      { date: '2026-02-15', doctor: 'Dr. Amit Sharma', drugs: [
        { name: 'Tab. Metformin 500mg', dosage: '1 tab', frequency: 'BD', duration: '30 days' },
        { name: 'Tab. Glimepiride 1mg', dosage: '1 tab', frequency: 'OD', duration: '30 days' },
      ]},
      { date: '2026-01-20', doctor: 'Dr. Amit Sharma', drugs: [
        { name: 'Tab. Metformin 500mg', dosage: '1 tab', frequency: 'BD', duration: '30 days' },
        { name: 'Tab. Amlodipine 5mg', dosage: '1 tab', frequency: 'OD', duration: '30 days' },
      ]},
    ],
    labReports: [
      { date: '2026-02-15', test: 'HbA1c', status: 'Completed', flagged: true },
      { date: '2026-02-15', test: 'Fasting Blood Sugar', status: 'Completed', flagged: true },
      { date: '2026-01-20', test: 'Lipid Profile', status: 'Completed', flagged: false },
      { date: '2025-11-10', test: 'Troponin I', status: 'Completed', flagged: false },
      { date: '2025-09-05', test: 'CBC, LFT, RFT', status: 'Completed', flagged: false },
    ],
    surgicalHistory: [
      { date: '2022-06-15', procedure: 'Appendectomy', surgeon: 'Dr. Vikram Singh', outcome: 'Successful' },
    ],
    chronicDiseases: ['Type 2 Diabetes Mellitus (since 2018)', 'Essential Hypertension (since 2020)'],
    familyHistory: [
      { relation: 'Father', condition: 'Coronary Artery Disease, Diabetes' },
      { relation: 'Mother', condition: 'Hypertension' },
    ],
    immunizations: [
      { name: 'COVID-19 (Covishield)', date: '2021-08-15' },
      { name: 'Influenza', date: '2025-10-01', dueDate: '2026-10-01' },
      { name: 'Hepatitis B', date: '2019-03-20' },
    ],
    dischargeSummaries: [
      { date: '2022-06-18', diagnosis: 'Acute Appendicitis', stayDays: 3 },
    ],
    pastMedicalHistory: ['Dengue fever (2019)', 'COVID-19 mild infection (2021)', 'Vitamin D deficiency (2020)'],
  },
};

// Generate for IDs 2-10
['Priya Sharma','Amit Singh','Sunita Devi','Mohammed Ali','Kavita Reddy','Suresh Patel','Anita Gupta','Deepak Verma','Lakshmi Nair'].forEach((name, i) => {
  const id = String(i + 2);
  const initials = name.split(' ').map(n => n[0]).join('');
  mockPatient[id] = {
    id, name, initials, uhid: `ADR-2024-${String(i + 2).padStart(4, '0')}`, age: 28 + i * 5, gender: i % 2 === 0 ? 'Male' : 'Female',
    bloodGroup: ['A+','O+','AB+','B-','O-','A-','AB-','B+','O+'][i], abhaId: `${23456789012345 + i}`,
    phone: `+91 ${87654 - i * 1000} ${32109 - i * 100}`, email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    city: ['Delhi','Pune','Jaipur','Hyderabad','Chennai','Ahmedabad','Kolkata','Lucknow','Kochi'][i],
    allergies: i === 0 ? [{ name: 'Aspirin', type: 'Drug', severity: 'Mild', reaction: 'GI upset' }] : [],
    vitals: { bp: '118/76', hr: '74', spo2: '99', temp: '98.2', rr: '16', weight: '65', height: '165', bmi: '23.9' },
    healthScore: 70 + i * 3, healthLabel: i > 4 ? 'GOOD' : 'FAIR',
    visits: [{ date: '2026-03-01', complaint: 'Follow-up visit', doctor: 'Dr. Amit Sharma', status: 'Completed', type: 'OPD' }],
    prescriptions: [], labReports: [], surgicalHistory: [], chronicDiseases: [], familyHistory: [],
    immunizations: [], dischargeSummaries: [], pastMedicalHistory: [],
  };
});

const tabOptions = ['History', 'Prescriptions', 'Labs', 'Medical History', 'ABDM'];

export default function DoctorPatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');

  const patient = mockPatient[patientId ?? '1'] ?? mockPatient['1'];
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
        <Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90"
          onClick={() => navigate(`/doctor/consultation/${patient.id}`)}>
          Start Consultation
        </Button>
      </motion.div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-5">
        {/* Left Column */}
        <motion.div {...fadeIn(1)} className="space-y-4">
          {/* Contact */}
          <div className="border rounded-xl bg-card p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contact</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /><span>{patient.phone}</span></div>
              <div className="flex items-center gap-2.5 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /><span>{patient.email}</span></div>
              <div className="flex items-center gap-2.5 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{patient.city}</span></div>
            </div>
          </div>

          {/* Allergies */}
          {patient.allergies.length > 0 && (
            <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-destructive font-semibold flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5" /> Allergies
              </p>
              <div className="space-y-1.5">
                {patient.allergies.map(a => (
                  <div key={a.name} className="text-xs">
                    <span className="font-medium text-destructive border border-destructive/30 rounded-full px-2.5 py-0.5">{a.name}</span>
                    <p className="text-[10px] text-destructive/70 mt-0.5 ml-1">{a.type} · {a.severity} · {a.reaction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vitals */}
          <div className="border rounded-xl bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Latest Vitals</p>
            <div className="space-y-3">
              {[
                { label: 'BP', value: patient.vitals.bp, unit: 'mmHg' },
                { label: 'HR', value: patient.vitals.hr, unit: 'bpm' },
                { label: 'SpO2', value: patient.vitals.spo2, unit: '%' },
                { label: 'Temp', value: patient.vitals.temp, unit: '°F' },
                { label: 'RR', value: patient.vitals.rr, unit: '/min' },
                { label: 'Weight', value: patient.vitals.weight, unit: 'kg' },
                { label: 'BMI', value: patient.vitals.bmi, unit: '' },
              ].map(v => (
                <div key={v.label} className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground uppercase">{v.label}</p>
                  <p className="text-sm font-bold">{v.value} <span className="text-xs font-normal text-muted-foreground">{v.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Chronic Diseases */}
          {patient.chronicDiseases.length > 0 && (
            <div className="border rounded-xl bg-card p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5" /> Chronic Conditions
              </p>
              <div className="space-y-1">
                {patient.chronicDiseases.map(d => (
                  <p key={d} className="text-xs text-foreground">{d}</p>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Center — Tabs */}
        <motion.div {...fadeIn(2)} className="border rounded-xl bg-card overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {tabOptions.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {tab}
                  {activeTab === tab && <motion.div layoutId="patientTab" className="absolute inset-x-2 -bottom-px h-0.5 bg-foreground rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            {/* Visit History */}
            {activeTab === 'History' && (
              <div className="space-y-3">
                {patient.visits.map((visit, i) => (
                  <div key={i} className="flex items-start justify-between py-3 border-b last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{visit.date}</p>
                        <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${
                          visit.type === 'Emergency' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                        }`}>{visit.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{visit.complaint}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{visit.doctor}</p>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-full shrink-0">{visit.status}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Prescriptions */}
            {activeTab === 'Prescriptions' && (
              <div className="space-y-4">
                {patient.prescriptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Pill className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">No prescriptions yet</p>
                  </div>
                ) : patient.prescriptions.map((rx, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold">{rx.date}</p>
                        <p className="text-xs text-muted-foreground">{rx.doctor}</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7">Copy Rx</Button>
                    </div>
                    <div className="space-y-1.5">
                      {rx.drugs.map((d, j) => (
                        <div key={j} className="flex items-center justify-between text-xs">
                          <span className="font-medium">{j + 1}. {d.name}</span>
                          <span className="text-muted-foreground">{d.dosage} · {d.frequency} · {d.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Labs */}
            {activeTab === 'Labs' && (
              <div className="space-y-2">
                {patient.labReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Activity className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">No lab results</p>
                  </div>
                ) : patient.labReports.map((lab, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{lab.test}</p>
                      <p className="text-xs text-muted-foreground">{lab.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {lab.flagged && <span className="text-[9px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">FLAGGED</span>}
                      <span className="text-xs text-muted-foreground">{lab.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Medical History */}
            {activeTab === 'Medical History' && (
              <div className="space-y-6">
                {/* Past Medical */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Past Medical History</p>
                  {patient.pastMedicalHistory.length > 0 ? (
                    <div className="space-y-1">{patient.pastMedicalHistory.map(h => <p key={h} className="text-sm">{h}</p>)}</div>
                  ) : <p className="text-sm text-muted-foreground">No records</p>}
                </div>

                {/* Surgical History */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-2">
                    <Syringe className="w-3.5 h-3.5" /> Surgical History
                  </p>
                  {patient.surgicalHistory.length > 0 ? (
                    <div className="space-y-2">
                      {patient.surgicalHistory.map((s, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <p className="text-sm font-medium">{s.procedure}</p>
                          <p className="text-xs text-muted-foreground">{s.date} · {s.surgeon} · {s.outcome}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No surgical history</p>}
                </div>

                {/* Family History */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Family Medical History</p>
                  {patient.familyHistory.length > 0 ? (
                    <div className="space-y-1.5">
                      {patient.familyHistory.map((f, i) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <span className="font-medium text-muted-foreground w-16">{f.relation}:</span>
                          <span>{f.condition}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No records</p>}
                </div>

                {/* Immunizations */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Immunization Records
                  </p>
                  {patient.immunizations.length > 0 ? (
                    <div className="space-y-1.5">
                      {patient.immunizations.map((im, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>{im.name}</span>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground">{im.date}</span>
                            {im.dueDate && <span className="text-[10px] text-amber-600 ml-2">Due: {im.dueDate}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No records</p>}
                </div>

                {/* Discharge Summaries */}
                {patient.dischargeSummaries.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Discharge Summaries</p>
                    <div className="space-y-2">
                      {patient.dischargeSummaries.map((ds, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <p className="text-sm font-medium">{ds.diagnosis}</p>
                          <p className="text-xs text-muted-foreground">{ds.date} · {ds.stayDays} days stay</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ABDM */}
            {activeTab === 'ABDM' && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CreditCard className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">ABDM Health Records</p>
                <p className="text-xs text-muted-foreground mt-1">Health records linked via ABHA ID: {patient.abhaId}</p>
                <Button variant="outline" size="sm" className="mt-4 text-xs">Fetch ABDM Records</Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column — Health Score + Upcoming */}
        <motion.div {...fadeIn(3)} className="space-y-4">
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

          <div className="border rounded-xl bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Quick Summary</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Visits</span><span className="font-semibold">{patient.visits.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Active Rx</span><span className="font-semibold">{patient.prescriptions.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lab Reports</span><span className="font-semibold">{patient.labReports.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Surgeries</span><span className="font-semibold">{patient.surgicalHistory.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Admissions</span><span className="font-semibold">{patient.dischargeSummaries.length}</span></div>
            </div>
          </div>

          <div className="border rounded-xl bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Upcoming</p>
            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
