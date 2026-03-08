import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BedDouble, Search, AlertTriangle, CheckCircle2, Clock,
  Activity, FileText, Pill, Stethoscope, ChevronRight, Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface IPDPatient {
  id: string;
  bed: string;
  ward: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  diagnosis: string;
  admittedOn: string;
  daysAdmitted: number;
  condition: 'stable' | 'critical' | 'improving' | 'observation';
  lastRound: string;
  roundsDue: boolean;
  vitals: { bp: string; pulse: string; spo2: string; temp: string };
  pendingOrders: string[];
}

const ipdPatients: IPDPatient[] = [
  {
    id: '1', bed: '3A-01', ward: 'General Ward 3A', name: 'Rajesh Kumar', age: 45, gender: 'M',
    diagnosis: 'Diabetic Ketoacidosis', admittedOn: '05 Mar', daysAdmitted: 3,
    condition: 'improving', lastRound: '07 Mar, 4:30 PM', roundsDue: true,
    vitals: { bp: '128/82', pulse: '78', spo2: '97%', temp: '98.6°F' },
    pendingOrders: ['Insulin sliding scale', 'RBS Q4H'],
  },
  {
    id: '2', bed: 'ICU-04', ward: 'ICU', name: 'Mohammed Ali', age: 67, gender: 'M',
    diagnosis: 'COPD Acute Exacerbation + Pneumonia', admittedOn: '06 Mar', daysAdmitted: 2,
    condition: 'critical', lastRound: '08 Mar, 06:00 AM', roundsDue: true,
    vitals: { bp: '142/90', pulse: '96', spo2: '89%', temp: '101.2°F' },
    pendingOrders: ['ABG', 'Chest X-ray', 'Adjust BiPAP settings'],
  },
  {
    id: '3', bed: '3A-05', ward: 'General Ward 3A', name: 'Sunita Devi', age: 41, gender: 'F',
    diagnosis: 'Acute Kidney Injury — CKD Stage 4', admittedOn: '04 Mar', daysAdmitted: 4,
    condition: 'stable', lastRound: '07 Mar, 5:00 PM', roundsDue: true,
    vitals: { bp: '148/94', pulse: '82', spo2: '96%', temp: '98.8°F' },
    pendingOrders: ['Dialysis scheduling', 'Renal diet'],
  },
  {
    id: '4', bed: '2B-08', ward: 'Surgical Ward 2B', name: 'Vikram Malhotra', age: 48, gender: 'M',
    diagnosis: 'Post-op Appendectomy (Day 2)', admittedOn: '06 Mar', daysAdmitted: 2,
    condition: 'improving', lastRound: '08 Mar, 07:00 AM', roundsDue: false,
    vitals: { bp: '124/78', pulse: '74', spo2: '99%', temp: '99.0°F' },
    pendingOrders: ['Wound dressing', 'Ambulation'],
  },
  {
    id: '5', bed: '3A-12', ward: 'General Ward 3A', name: 'Lakshmi Nair', age: 62, gender: 'F',
    diagnosis: 'Congestive Heart Failure — NYHA Class III', admittedOn: '03 Mar', daysAdmitted: 5,
    condition: 'observation', lastRound: '07 Mar, 6:00 PM', roundsDue: true,
    vitals: { bp: '136/86', pulse: '88', spo2: '94%', temp: '98.4°F' },
    pendingOrders: ['Echo follow-up', 'Diuretic adjustment', 'Daily weight'],
  },
  {
    id: '6', bed: 'ICU-02', ward: 'ICU', name: 'Anil Sharma', age: 55, gender: 'M',
    diagnosis: 'Acute MI — Post PTCA (Day 1)', admittedOn: '07 Mar', daysAdmitted: 1,
    condition: 'critical', lastRound: '08 Mar, 06:30 AM', roundsDue: false,
    vitals: { bp: '108/68', pulse: '92', spo2: '95%', temp: '98.4°F' },
    pendingOrders: ['Serial Troponin', 'ECG Q6H', 'Dual antiplatelet'],
  },
];

const conditionStyle: Record<string, { badge: string; dot: string }> = {
  stable: { badge: 'bg-emerald-500/10 text-emerald-600', dot: 'bg-emerald-500' },
  critical: { badge: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  improving: { badge: 'bg-blue-500/10 text-blue-600', dot: 'bg-blue-500' },
  observation: { badge: 'bg-amber-500/10 text-amber-600', dot: 'bg-amber-500' },
};

export default function DoctorIPD() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<IPDPatient | null>(ipdPatients[1]);
  const [condFilter, setCondFilter] = useState('All');

  const filtered = ipdPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.bed.toLowerCase().includes(search.toLowerCase());
    const matchFilter = condFilter === 'All' || p.condition === condFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const summary = {
    total: ipdPatients.length,
    critical: ipdPatients.filter(p => p.condition === 'critical').length,
    roundsDue: ipdPatients.filter(p => p.roundsDue).length,
    icu: ipdPatients.filter(p => p.ward === 'ICU').length,
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IPD Rounds</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-destructive">{summary.roundsDue} rounds due</span> · {summary.critical} critical · {summary.icu} in ICU
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Admit Patient
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div {...fadeIn(1)} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total IPD', value: summary.total, icon: BedDouble, color: '' },
          { label: 'Critical', value: summary.critical, icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Rounds Due', value: summary.roundsDue, icon: Clock, color: 'text-amber-600' },
          { label: 'ICU', value: summary.icu, icon: Activity, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="border rounded-xl p-4 bg-card flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search & Filter */}
      <motion.div {...fadeIn(2)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient or bed..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5">
          {['All', 'Critical', 'Stable', 'Improving', 'Observation'].map(f => (
            <button key={f} onClick={() => setCondFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${condFilter === f ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient Cards */}
        <motion.div {...fadeIn(3)} className="lg:col-span-1 space-y-2 max-h-[650px] overflow-y-auto pr-1">
          {filtered.map(p => {
            const cond = conditionStyle[p.condition];
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`border rounded-xl p-4 bg-card hover:shadow-md transition-all cursor-pointer ${
                  selectedPatient?.id === p.id ? 'ring-2 ring-foreground/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded">{p.bed}</span>
                    {p.roundsDue && (
                      <span className="text-[9px] font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full">ROUND DUE</span>
                    )}
                  </div>
                  <span className={`w-2 h-2 rounded-full ${cond.dot}`} />
                </div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.age}y/{p.gender} · Day {p.daysAdmitted}</p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{p.diagnosis}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${cond.badge}`}>
                    {p.condition}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{p.ward}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Detail Panel */}
        <motion.div {...fadeIn(4)} className="lg:col-span-2 border rounded-xl bg-card">
          {selectedPatient ? (
            <div className="p-5 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${conditionStyle[selectedPatient.condition].badge}`}>
                      {selectedPatient.condition}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bed {selectedPatient.bed} · {selectedPatient.ward} · {selectedPatient.age}y/{selectedPatient.gender === 'M' ? 'Male' : 'Female'} · Day {selectedPatient.daysAdmitted}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Admitted: {selectedPatient.admittedOn} · Last Round: {selectedPatient.lastRound}</p>
                </div>
                {selectedPatient.roundsDue && (
                  <Button size="sm" className="gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" /> Start Round
                  </Button>
                )}
              </div>

              {/* Diagnosis */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Diagnosis</p>
                <p className="text-sm font-medium">{selectedPatient.diagnosis}</p>
              </div>

              {/* Vitals */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Vitals</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'BP', value: selectedPatient.vitals.bp },
                    { label: 'Pulse', value: selectedPatient.vitals.pulse + ' bpm' },
                    { label: 'SpO2', value: selectedPatient.vitals.spo2 },
                    { label: 'Temp', value: selectedPatient.vitals.temp },
                  ].map(v => (
                    <div key={v.label} className="border rounded-lg p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">{v.label}</p>
                      <p className="text-sm font-bold mt-0.5">{v.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Orders */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Pending Orders ({selectedPatient.pendingOrders.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedPatient.pendingOrders.map((order, i) => (
                    <div key={i} className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <p className="text-xs">{order}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Progress Note', icon: FileText },
                  { label: 'Medications', icon: Pill },
                  { label: 'Order Lab', icon: Activity },
                  { label: 'Discharge Plan', icon: CheckCircle2 },
                ].map(a => (
                  <Button key={a.label} variant="outline" size="sm" className="gap-1.5 text-xs">
                    <a.icon className="w-3.5 h-3.5" /> {a.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <BedDouble className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Select a patient</p>
              <p className="text-xs text-muted-foreground mt-1">Click on a bed card to view details</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
