import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Clock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface CheckInPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
  doctor: string;
  department: string;
  status: 'waiting' | 'checked-in' | 'with-doctor' | 'completed';
  arrivalTime?: string;
  tokenNo?: number;
}

const patients: CheckInPatient[] = [
  { id: 'P-2401', name: 'Rajesh Sharma', age: 45, gender: 'M', appointmentTime: '09:00 AM', doctor: 'Dr. R. Mehta', department: 'Cardiology', status: 'waiting', arrivalTime: '08:45 AM' },
  { id: 'P-2402', name: 'Priya Patel', age: 28, gender: 'F', appointmentTime: '09:30 AM', doctor: 'Dr. S. Iyer', department: 'Gynecology', status: 'checked-in', arrivalTime: '09:20 AM', tokenNo: 12 },
  { id: 'P-2403', name: 'Amit Kumar', age: 62, gender: 'M', appointmentTime: '10:00 AM', doctor: 'Dr. A. Shah', department: 'General Medicine', status: 'with-doctor', arrivalTime: '09:50 AM', tokenNo: 13 },
  { id: 'P-2404', name: 'Sunita Devi', age: 55, gender: 'F', appointmentTime: '10:30 AM', doctor: 'Dr. K. Rao', department: 'Orthopedics', status: 'waiting', arrivalTime: '10:15 AM' },
  { id: 'P-2405', name: 'Vikram Singh', age: 38, gender: 'M', appointmentTime: '11:00 AM', doctor: 'Dr. P. Nair', department: 'ENT', status: 'completed', arrivalTime: '10:40 AM', tokenNo: 14 },
  { id: 'P-2406', name: 'Neha Gupta', age: 32, gender: 'F', appointmentTime: '11:30 AM', doctor: 'Dr. R. Mehta', department: 'Cardiology', status: 'waiting' },
  { id: 'P-2407', name: 'Arjun Reddy', age: 50, gender: 'M', appointmentTime: '12:00 PM', doctor: 'Dr. S. Iyer', department: 'Orthopedics', status: 'checked-in', arrivalTime: '11:45 AM', tokenNo: 15 },
];

const statusConfig = {
  'waiting': { label: 'Waiting', color: 'bg-warning/10 text-warning', icon: Clock },
  'checked-in': { label: 'Checked In', color: 'bg-info/10 text-info', icon: UserCheck },
  'with-doctor': { label: 'With Doctor', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  'completed': { label: 'Completed', color: 'bg-muted text-muted-foreground', icon: CheckCircle2 },
};

export default function ReceptionCheckIn() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: patients.length,
    waiting: patients.filter(p => p.status === 'waiting').length,
    'checked-in': patients.filter(p => p.status === 'checked-in').length,
    'with-doctor': patients.filter(p => p.status === 'with-doctor').length,
    completed: patients.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Patient Check-In</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage patient arrivals and check-in process</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}>
            {key === 'all' ? 'All' : key === 'checked-in' ? 'Checked In' : key === 'with-doctor' ? 'With Doctor' : key.charAt(0).toUpperCase() + key.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm" placeholder="Search patients..." />
      </div>

      <div className="space-y-2">
        {filtered.map((p, i) => {
          const config = statusConfig[p.status];
          const StatusIcon = config.icon;
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-xl border bg-card p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{p.name}</p>
                    {p.tokenNo && <span className="text-xs px-1.5 py-0.5 rounded bg-muted font-mono">#{p.tokenNo}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.id} · {p.age}{p.gender} · {p.doctor} · {p.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{p.appointmentTime}</p>
                  {p.arrivalTime && <p className="text-xs text-muted-foreground">Arrived {p.arrivalTime}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${config.color}`}>
                  <StatusIcon className="w-3 h-3" /> {config.label}
                </span>
                {p.status === 'waiting' && (
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1">
                    Check In <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
