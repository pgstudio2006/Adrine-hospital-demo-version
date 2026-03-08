import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, UserPlus, BedDouble, Clock, Activity, ArrowUpRight } from 'lucide-react';

interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  bed: string;
  ward: string;
  admittedOn: string;
  doctor: string;
  diagnosis: string;
  status: 'active' | 'discharge-pending' | 'discharged';
  condition: 'stable' | 'critical' | 'improving' | 'observation';
}

const admissions: Admission[] = [
  { id: 'ADM-301', patientId: 'P-2401', patientName: 'Rajesh Sharma', age: 45, gender: 'M', bed: 'A-01', ward: 'General Ward A', admittedOn: '5 Mar 2026', doctor: 'Dr. R. Mehta', diagnosis: 'Pneumonia', status: 'active', condition: 'improving' },
  { id: 'ADM-302', patientId: 'P-2402', patientName: 'Priya Patel', age: 28, gender: 'F', bed: 'A-03', ward: 'General Ward A', admittedOn: '6 Mar 2026', doctor: 'Dr. S. Iyer', diagnosis: 'Post-surgery recovery', status: 'active', condition: 'stable' },
  { id: 'ADM-303', patientId: 'P-2403', patientName: 'Amit Kumar', age: 62, gender: 'M', bed: 'B-01', ward: 'General Ward B', admittedOn: '4 Mar 2026', doctor: 'Dr. R. Mehta', diagnosis: 'Cardiac monitoring', status: 'discharge-pending', condition: 'stable' },
  { id: 'ADM-304', patientId: 'P-2404', patientName: 'Sunita Devi', age: 55, gender: 'F', bed: 'B-02', ward: 'General Ward B', admittedOn: '7 Mar 2026', doctor: 'Dr. K. Rao', diagnosis: 'Fracture - Femur', status: 'active', condition: 'observation' },
  { id: 'ADM-305', patientId: 'P-2405', patientName: 'Vikram Singh', age: 38, gender: 'M', bed: 'ICU-01', ward: 'ICU', admittedOn: '3 Mar 2026', doctor: 'Dr. A. Shah', diagnosis: 'Sepsis', status: 'active', condition: 'critical' },
  { id: 'ADM-306', patientId: 'P-2406', patientName: 'Neha Gupta', age: 32, gender: 'F', bed: 'ICU-02', ward: 'ICU', admittedOn: '6 Mar 2026', doctor: 'Dr. P. Nair', diagnosis: 'Post-op ICU care', status: 'active', condition: 'improving' },
  { id: 'ADM-307', patientId: 'P-2407', patientName: 'Arjun Reddy', age: 50, gender: 'M', bed: 'PVT-01', ward: 'Private Room', admittedOn: '7 Mar 2026', doctor: 'Dr. K. Rao', diagnosis: 'Knee replacement', status: 'active', condition: 'stable' },
];

const conditionStyles: Record<string, string> = {
  stable: 'bg-success/10 text-success',
  critical: 'bg-destructive/10 text-destructive',
  improving: 'bg-info/10 text-info',
  observation: 'bg-warning/10 text-warning',
};

const statusStyles: Record<string, string> = {
  active: 'bg-success/10 text-success',
  'discharge-pending': 'bg-warning/10 text-warning',
  discharged: 'bg-muted text-muted-foreground',
};

export default function ReceptionIPD() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = admissions.filter(a => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search) || a.bed.includes(search);
    const matchFilter = filter === 'all' || a.status === filter || a.condition === filter;
    return matchSearch && matchFilter;
  });

  const activeCount = admissions.filter(a => a.status === 'active').length;
  const criticalCount = admissions.filter(a => a.condition === 'critical').length;
  const dischargePending = admissions.filter(a => a.status === 'discharge-pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IPD Admissions</h1>
          <p className="text-sm text-muted-foreground mt-1">{activeCount} active admissions · {criticalCount} critical</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <UserPlus className="w-4 h-4" /> New Admission
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><Activity className="w-5 h-5 text-success" /></div>
          <div>
            <p className="text-xl font-bold">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><Activity className="w-5 h-5 text-destructive" /></div>
          <div>
            <p className="text-xl font-bold">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><Clock className="w-5 h-5 text-warning" /></div>
          <div>
            <p className="text-xl font-bold">{dischargePending}</p>
            <p className="text-xs text-muted-foreground">Discharge Pending</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card text-sm" placeholder="Search admissions..." />
        </div>
        <div className="flex gap-1.5">
          {['all', 'active', 'critical', 'discharge-pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f === 'all' ? 'All' : f === 'discharge-pending' ? 'Discharge Pending' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Admissions List */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Bed / Ward</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Doctor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Admitted</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Condition</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a, i) => (
              <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-accent/50 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {a.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.patientName}</p>
                      <p className="text-xs text-muted-foreground">{a.id} · {a.age}{a.gender} · {a.diagnosis}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm">{a.bed}</span>
                    <span className="text-xs text-muted-foreground">· {a.ward}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{a.doctor}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{a.admittedOn}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${conditionStyles[a.condition]}`}>{a.condition}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[a.status]}`}>
                    {a.status === 'discharge-pending' ? 'Discharge Pending' : a.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
