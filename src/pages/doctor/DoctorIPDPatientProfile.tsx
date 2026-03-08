import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Activity, Droplets, Thermometer, Pill, FileText, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface IPDDetail {
  id: string;
  name: string;
  bed: string;
  ward: string;
  uhid: string;
  abhaId: string;
  age: number;
  gender: string;
  diagnosis: string;
  condition: 'stable' | 'critical' | 'improving' | 'observation';
  vitals: { hr: string; bp: string; spo2: string; temp: string };
  admitted: string;
  doctor: string;
  recentActivity: { author: string; note: string; time: string }[];
}

const conditionColors: Record<string, string> = {
  stable: 'bg-emerald-500/10 text-emerald-600',
  critical: 'bg-destructive/10 text-destructive',
  improving: 'bg-blue-500/10 text-blue-600',
  observation: 'bg-amber-500/10 text-amber-600',
};

const mockIPD: Record<string, IPDDetail> = {
  '1': {
    id: '1', name: 'Rajesh Kumar', bed: '3A-01', ward: 'General Ward 3A', uhid: 'ADR-2024-0001', abhaId: '12345678901234',
    age: 45, gender: 'Male', diagnosis: 'Diabetic Ketoacidosis', condition: 'improving',
    vitals: { hr: '78', bp: '120/80', spo2: '98', temp: '98.6' },
    admitted: '05/03/2026', doctor: 'Dr. Amit Sharma',
    recentActivity: [
      { author: 'Dr. Rajesh Gupta', note: 'Patient stable. Blood sugar levels improving with insulin therapy.', time: 'Today, 10:30 AM' },
      { author: 'Nurse Priya', note: 'Evening meds administered. Patient resting comfortably.', time: 'Yesterday, 08:00 PM' },
    ],
  },
  '2': {
    id: '2', name: 'Mohammed Ali', bed: 'ICU-04', ward: 'ICU', uhid: 'ADR-2024-0003', abhaId: '56789012345678',
    age: 67, gender: 'Male', diagnosis: 'COPD Acute Exacerbation + Pneumonia', condition: 'critical',
    vitals: { hr: '96', bp: '142/90', spo2: '89', temp: '101.2' },
    admitted: '06/03/2026', doctor: 'Dr. Amit Sharma',
    recentActivity: [
      { author: 'Dr. Rajesh Gupta', note: 'Patient stable. O2 saturation improved to 94% on 2L nasal cannula.', time: 'Today, 10:30 AM' },
      { author: 'Nurse Priya', note: 'Evening meds administered. Patient complained of mild headache.', time: 'Yesterday, 08:00 PM' },
    ],
  },
  '3': {
    id: '3', name: 'Sunita Devi', bed: '3A-05', ward: 'General Ward 3A', uhid: 'ADR-2024-0004', abhaId: '67890123456789',
    age: 41, gender: 'Female', diagnosis: 'Acute Kidney Injury — CKD Stage 4', condition: 'stable',
    vitals: { hr: '82', bp: '148/94', spo2: '96', temp: '98.8' },
    admitted: '04/03/2026', doctor: 'Dr. Amit Sharma',
    recentActivity: [
      { author: 'Dr. Amit Sharma', note: 'Dialysis session completed. Creatinine trending down.', time: 'Today, 09:00 AM' },
    ],
  },
};

// Fill remaining
['Vikram Malhotra', 'Lakshmi Nair', 'Anil Sharma'].forEach((name, i) => {
  const id = String(i + 4);
  mockIPD[id] = {
    id, name, bed: `W${i + 1}-0${i + 1}`, ward: i === 2 ? 'ICU' : `Ward ${i + 1}`, uhid: `ADR-2024-${String(i + 5).padStart(4, '0')}`,
    abhaId: `${78901234567890 + i}`, age: 48 + i * 5, gender: i % 2 === 0 ? 'Male' : 'Female',
    diagnosis: ['Post-op Appendectomy', 'CHF NYHA Class III', 'Acute MI Post PTCA'][i],
    condition: (['improving', 'observation', 'critical'] as const)[i],
    vitals: { hr: '74', bp: '124/78', spo2: '99', temp: '99.0' },
    admitted: `0${6 + i}/03/2026`, doctor: 'Dr. Amit Sharma',
    recentActivity: [{ author: 'Dr. Amit Sharma', note: 'Patient progressing well.', time: 'Today, 08:00 AM' }],
  };
});

const tabOptions = ['Summary', 'Vitals', 'Medications', 'Labs', 'Notes', 'ABDM Records'];

export default function DoctorIPDPatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Summary');

  const patient = mockIPD[patientId ?? '2'] ?? mockIPD['2'];

  const vitalsCards = [
    { label: 'Heart Rate', value: patient.vitals.hr, unit: 'bpm', icon: Heart, color: 'text-red-500' },
    { label: 'Blood Pressure', value: patient.vitals.bp, unit: 'mmHg', icon: Activity, color: 'text-blue-500' },
    { label: 'SpO2', value: patient.vitals.spo2 + '%', unit: '', icon: Droplets, color: 'text-amber-500' },
    { label: 'Temperature', value: patient.vitals.temp, unit: '°F', icon: Thermometer, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/doctor/ipd')} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">{patient.name}</h1>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${conditionColors[patient.condition]}`}>
                {patient.condition}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              ⌂ {patient.bed}
              <span className="mx-2">·</span>UHID: {patient.uhid}
              <span className="mx-2">·</span>
              <span className="text-blue-600 font-medium">◯ {patient.abhaId}</span>
              <span className="mx-2">{patient.age}y</span>· {patient.gender}
              <span className="mx-2">·</span>{patient.diagnosis}
            </p>
          </div>
        </div>
        <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
          Discharge
        </Button>
      </motion.div>

      {/* Vitals Cards */}
      <motion.div {...fadeIn(1)} className="grid grid-cols-4 gap-4">
        {vitalsCards.map(v => (
          <div key={v.label} className="border rounded-xl bg-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <v.icon className={`w-5 h-5 ${v.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{v.label}</p>
              <p className="text-xl font-bold">{v.value} <span className="text-xs font-normal text-muted-foreground">{v.unit}</span></p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Tabs */}
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
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="ipdTab" className="absolute inset-x-2 -bottom-px h-0.5 bg-foreground rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'Summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Admission Info */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Admission Info</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Admitted', value: patient.admitted },
                      { label: 'Ward', value: patient.ward },
                      { label: 'Bed', value: patient.bed },
                      { label: 'Doctor', value: patient.doctor },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Diagnosis</p>
                  <p className="text-sm font-medium">{patient.diagnosis}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Recent Activity</p>
                <div className="space-y-3">
                  {patient.recentActivity.map((act, i) => (
                    <div key={i} className="border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold">{act.author}</p>
                        <p className="text-xs text-muted-foreground">{act.time}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{act.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Vitals' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Activity className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Vitals Trend</p>
              <p className="text-xs text-muted-foreground mt-1">Detailed vitals charts will appear here</p>
            </div>
          )}

          {activeTab === 'Medications' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Pill className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Current Medications</p>
              <p className="text-xs text-muted-foreground mt-1">Active medication orders will appear here</p>
            </div>
          )}

          {activeTab === 'Labs' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Activity className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Lab Results</p>
              <p className="text-xs text-muted-foreground mt-1">IPD lab reports will appear here</p>
            </div>
          )}

          {activeTab === 'Notes' && (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Clinical Notes</p>
              <p className="text-xs text-muted-foreground mt-1">Progress notes and round notes will appear here</p>
            </div>
          )}

          {activeTab === 'ABDM Records' && (
            <div className="flex flex-col items-center justify-center py-16">
              <CreditCard className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">ABDM Records</p>
              <p className="text-xs text-muted-foreground mt-1">Health records linked via ABHA ID</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
