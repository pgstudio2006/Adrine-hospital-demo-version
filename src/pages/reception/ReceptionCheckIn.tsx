import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Clock, UserCheck, ArrowRight, Bell, MapPin, Hash } from 'lucide-react';

interface CheckInPatient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
  doctor: string;
  department: string;
  roomNo: string;
  status: 'waiting' | 'checked-in' | 'with-doctor' | 'completed';
  arrivalTime?: string;
  tokenNo?: number;
  appointmentType: 'scheduled' | 'walk-in' | 'follow-up';
  phone: string;
}

const patients: CheckInPatient[] = [
  { id: 'APT-10001', uhid: 'UHID-240001', name: 'Rajesh Sharma', age: 45, gender: 'M', appointmentTime: '09:00 AM', doctor: 'Dr. R. Mehta', department: 'Cardiology', roomNo: 'Room 201', status: 'waiting', arrivalTime: '08:45 AM', appointmentType: 'follow-up', phone: '9876543210' },
  { id: 'APT-10002', uhid: 'UHID-240002', name: 'Priya Patel', age: 28, gender: 'F', appointmentTime: '09:30 AM', doctor: 'Dr. S. Iyer', department: 'Gynecology', roomNo: 'Room 305', status: 'checked-in', arrivalTime: '09:20 AM', tokenNo: 12, appointmentType: 'scheduled', phone: '9876543211' },
  { id: 'APT-10003', uhid: 'UHID-240003', name: 'Amit Kumar', age: 62, gender: 'M', appointmentTime: '10:00 AM', doctor: 'Dr. A. Shah', department: 'General Medicine', roomNo: 'Room 102', status: 'with-doctor', arrivalTime: '09:50 AM', tokenNo: 13, appointmentType: 'scheduled', phone: '9876543212' },
  { id: 'APT-10004', uhid: 'UHID-240004', name: 'Sunita Devi', age: 55, gender: 'F', appointmentTime: '10:30 AM', doctor: 'Dr. K. Rao', department: 'Orthopedics', roomNo: 'Room 204', status: 'waiting', arrivalTime: '10:15 AM', appointmentType: 'walk-in', phone: '9876543213' },
  { id: 'APT-10005', uhid: 'UHID-240005', name: 'Vikram Singh', age: 38, gender: 'M', appointmentTime: '11:00 AM', doctor: 'Dr. P. Nair', department: 'ENT', roomNo: 'Room 108', status: 'completed', arrivalTime: '10:40 AM', tokenNo: 14, appointmentType: 'scheduled', phone: '9876543214' },
  { id: 'APT-10006', uhid: 'UHID-240006', name: 'Neha Gupta', age: 32, gender: 'F', appointmentTime: '11:30 AM', doctor: 'Dr. R. Mehta', department: 'Cardiology', roomNo: 'Room 201', status: 'waiting', appointmentType: 'scheduled', phone: '9876543215' },
  { id: 'APT-10007', uhid: 'UHID-240007', name: 'Arjun Reddy', age: 50, gender: 'M', appointmentTime: '12:00 PM', doctor: 'Dr. K. Rao', department: 'Orthopedics', roomNo: 'Room 204', status: 'checked-in', arrivalTime: '11:45 AM', tokenNo: 15, appointmentType: 'follow-up', phone: '9876543216' },
  { id: 'APT-10008', uhid: 'UHID-240008', name: 'Fatima Khan', age: 41, gender: 'F', appointmentTime: '12:30 PM', doctor: 'Dr. P. Nair', department: 'Pediatrics', roomNo: 'Room 110', status: 'waiting', arrivalTime: '12:10 PM', appointmentType: 'walk-in', phone: '9876543217' },
];

const statusConfig = {
  'waiting': { label: 'Waiting for Check-In', color: 'bg-warning/10 text-warning', icon: Clock },
  'checked-in': { label: 'Checked In', color: 'bg-info/10 text-info', icon: UserCheck },
  'with-doctor': { label: 'With Doctor', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  'completed': { label: 'Completed', color: 'bg-muted text-muted-foreground', icon: CheckCircle2 },
};

let nextToken = 16;

export default function ReceptionCheckIn() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [checkedInPatients, setCheckedInPatients] = useState<Record<string, number>>({});

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search) || p.uhid.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
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

  const handleCheckIn = (patientId: string) => {
    const token = nextToken++;
    setCheckedInPatients(prev => ({ ...prev, [patientId]: token }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Patient Check-In</h1>
        <p className="text-sm text-muted-foreground mt-1">Confirm patient arrival, assign tokens, and direct to departments</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = counts[key as keyof typeof counts];
          const Icon = config.icon;
          return (
            <div key={key} className={`rounded-xl border p-4 flex items-center gap-3 ${config.color.replace('text-', 'border-').split(' ')[0]}/20`}>
              <Icon className="w-5 h-5" />
              <div>
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{config.label}</p>
              </div>
            </div>
          );
        })}
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
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm" placeholder="Search by name, UHID, appointment ID, or phone..." />
      </div>

      <div className="space-y-2">
        {filtered.map((p, i) => {
          const config = statusConfig[p.status];
          const StatusIcon = config.icon;
          const assignedToken = checkedInPatients[p.id];
          const displayToken = p.tokenNo || assignedToken;

          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-xl border bg-card p-4 hover:bg-accent/30 transition-colors">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{p.name}</p>
                      {displayToken && <span className="text-xs px-1.5 py-0.5 rounded bg-muted font-mono">#{displayToken}</span>}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        p.appointmentType === 'walk-in' ? 'bg-accent text-accent-foreground' :
                        p.appointmentType === 'follow-up' ? 'bg-info/10 text-info' :
                        'bg-muted text-muted-foreground'
                      }`}>{p.appointmentType}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.uhid} · {p.age}{p.gender} · {p.doctor} · {p.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> {p.appointmentTime}</p>
                    {p.arrivalTime && <p className="text-xs text-muted-foreground">Arrived {p.arrivalTime}</p>}
                  </div>

                  {/* Navigation info */}
                  <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground border rounded-lg px-2 py-1">
                    <MapPin className="w-3 h-3" /> {p.roomNo}
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${config.color}`}>
                    <StatusIcon className="w-3 h-3" /> {config.label.split(' ').slice(-1)[0]}
                  </span>

                  {p.status === 'waiting' && !assignedToken && (
                    <button onClick={() => handleCheckIn(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Check In & Assign Token
                    </button>
                  )}
                  {assignedToken && p.status === 'waiting' && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-success font-medium">✓ Token #{assignedToken}</span>
                      <button className="p-1 rounded hover:bg-accent" title="Notify department">
                        <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">No patients found</div>
        )}
      </div>
    </div>
  );
}
