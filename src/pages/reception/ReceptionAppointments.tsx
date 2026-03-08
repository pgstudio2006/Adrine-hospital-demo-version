import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Search, Filter } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

const appointments = [
  { id: 1, patient: 'Rajesh Sharma', doctor: 'Dr. R. Mehta', dept: 'Cardiology', time: '09:00', duration: 30, status: 'confirmed', day: 0 },
  { id: 2, patient: 'Priya Patel', doctor: 'Dr. S. Iyer', dept: 'Gynecology', time: '09:30', duration: 30, status: 'confirmed', day: 0 },
  { id: 3, patient: 'Amit Kumar', doctor: 'Dr. A. Shah', dept: 'General Medicine', time: '10:00', duration: 45, status: 'pending', day: 0 },
  { id: 4, patient: 'Neha Gupta', doctor: 'Dr. P. Nair', dept: 'Dermatology', time: '10:30', duration: 30, status: 'confirmed', day: 1 },
  { id: 5, patient: 'Vikram Singh', doctor: 'Dr. R. Mehta', dept: 'Cardiology', time: '11:00', duration: 30, status: 'cancelled', day: 0 },
  { id: 6, patient: 'Sunita Devi', doctor: 'Dr. K. Rao', dept: 'Orthopedics', time: '11:30', duration: 30, status: 'confirmed', day: 2 },
  { id: 7, patient: 'Arjun Reddy', doctor: 'Dr. S. Iyer', dept: 'Gynecology', time: '14:00', duration: 30, status: 'confirmed', day: 0 },
  { id: 8, patient: 'Fatima Khan', doctor: 'Dr. A. Shah', dept: 'Pediatrics', time: '14:30', duration: 45, status: 'pending', day: 3 },
];

const todayAppointments = appointments.filter(a => a.day === 0);
const stats = [
  { label: 'Total Today', value: todayAppointments.length },
  { label: 'Confirmed', value: todayAppointments.filter(a => a.status === 'confirmed').length },
  { label: 'Pending', value: todayAppointments.filter(a => a.status === 'pending').length },
  { label: 'Cancelled', value: todayAppointments.filter(a => a.status === 'cancelled').length },
];

export default function ReceptionAppointments() {
  const [view, setView] = useState<'day' | 'week'>('day');
  const [search, setSearch] = useState('');

  const filteredAppts = todayAppointments.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage patient appointments and scheduling</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card text-sm" placeholder="Search appointments..." />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            <button onClick={() => setView('day')} className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === 'day' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>Day</button>
            <button onClick={() => setView('week')} className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === 'week' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>Week</button>
          </div>
          <div className="flex items-center gap-1 border rounded-lg px-2">
            <button className="p-1 hover:bg-accent rounded"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-medium px-2">8 Mar 2026</span>
            <button className="p-1 hover:bg-accent rounded"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Day View Timeline */}
      {view === 'day' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="divide-y">
            {HOURS.map(hour => {
              const slotAppts = filteredAppts.filter(a => a.time.startsWith(hour.split(':')[0]));
              return (
                <div key={hour} className="flex min-h-[60px]">
                  <div className="w-20 shrink-0 px-3 py-2 text-xs text-muted-foreground font-mono border-r bg-muted/20">
                    {hour}
                  </div>
                  <div className="flex-1 p-2 flex gap-2 flex-wrap">
                    {slotAppts.map(a => (
                      <div key={a.id} className={`px-3 py-2 rounded-lg text-sm flex-1 min-w-[200px] max-w-[300px] border ${
                        a.status === 'confirmed' ? 'bg-success/5 border-success/20' :
                        a.status === 'pending' ? 'bg-warning/5 border-warning/20' :
                        'bg-muted/50 border-muted line-through opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{a.patient}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            a.status === 'confirmed' ? 'bg-success/10 text-success' :
                            a.status === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-muted text-muted-foreground'
                          }`}>{a.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.doctor} · {a.dept} · {a.duration}min</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="grid grid-cols-7 border-b">
            {DAYS.map((day, i) => (
              <div key={day} className={`px-3 py-2 text-center text-xs font-semibold border-r last:border-r-0 ${i === 0 ? 'bg-primary/5' : ''}`}>
                <div className="text-muted-foreground">{day}</div>
                <div className={`text-lg font-bold mt-0.5 ${i === 0 ? 'text-primary' : ''}`}>{8 + i}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[400px]">
            {DAYS.map((_, dayIdx) => {
              const dayAppts = appointments.filter(a => a.day === dayIdx);
              return (
                <div key={dayIdx} className={`border-r last:border-r-0 p-2 space-y-1 ${dayIdx === 0 ? 'bg-primary/5' : ''}`}>
                  {dayAppts.map(a => (
                    <div key={a.id} className={`px-2 py-1.5 rounded text-xs border ${
                      a.status === 'confirmed' ? 'bg-success/5 border-success/20' :
                      a.status === 'pending' ? 'bg-warning/5 border-warning/20' :
                      'bg-muted/50 border-muted opacity-60'
                    }`}>
                      <p className="font-medium truncate">{a.patient}</p>
                      <p className="text-muted-foreground">{a.time} · {a.doctor.split(' ')[1]}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
