import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BedDouble, Search, AlertTriangle, Clock,
  Activity, Plus
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
  roundsDue: boolean;
}

const ipdPatients: IPDPatient[] = [
  { id: '1', bed: '3A-01', ward: 'General Ward 3A', name: 'Rajesh Kumar', age: 45, gender: 'M', diagnosis: 'Diabetic Ketoacidosis', admittedOn: '05 Mar', daysAdmitted: 3, condition: 'improving', roundsDue: true },
  { id: '2', bed: 'ICU-04', ward: 'ICU', name: 'Mohammed Ali', age: 67, gender: 'M', diagnosis: 'COPD Acute Exacerbation + Pneumonia', admittedOn: '06 Mar', daysAdmitted: 2, condition: 'critical', roundsDue: true },
  { id: '3', bed: '3A-05', ward: 'General Ward 3A', name: 'Sunita Devi', age: 41, gender: 'F', diagnosis: 'Acute Kidney Injury — CKD Stage 4', admittedOn: '04 Mar', daysAdmitted: 4, condition: 'stable', roundsDue: true },
  { id: '4', bed: '2B-08', ward: 'Surgical Ward 2B', name: 'Vikram Malhotra', age: 48, gender: 'M', diagnosis: 'Post-op Appendectomy (Day 2)', admittedOn: '06 Mar', daysAdmitted: 2, condition: 'improving', roundsDue: false },
  { id: '5', bed: '3A-12', ward: 'General Ward 3A', name: 'Lakshmi Nair', age: 62, gender: 'F', diagnosis: 'Congestive Heart Failure — NYHA Class III', admittedOn: '03 Mar', daysAdmitted: 5, condition: 'observation', roundsDue: true },
  { id: '6', bed: 'ICU-02', ward: 'ICU', name: 'Anil Sharma', age: 55, gender: 'M', diagnosis: 'Acute MI — Post PTCA (Day 1)', admittedOn: '07 Mar', daysAdmitted: 1, condition: 'critical', roundsDue: false },
];

const conditionStyle: Record<string, { badge: string; dot: string }> = {
  stable: { badge: 'bg-emerald-500/10 text-emerald-600', dot: 'bg-emerald-500' },
  critical: { badge: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  improving: { badge: 'bg-blue-500/10 text-blue-600', dot: 'bg-blue-500' },
  observation: { badge: 'bg-amber-500/10 text-amber-600', dot: 'bg-amber-500' },
};

export default function DoctorIPD() {
  const [search, setSearch] = useState('');
  const [condFilter, setCondFilter] = useState('All');
  const navigate = useNavigate();

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

      {/* Bed Cards Grid */}
      <motion.div {...fadeIn(3)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(p => {
          const cond = conditionStyle[p.condition];
          return (
            <div
              key={p.id}
              onClick={() => navigate(`/doctor/ipd/${p.id}`)}
              className="border rounded-xl p-4 bg-card hover:shadow-md transition-all cursor-pointer"
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
    </div>
  );
}
