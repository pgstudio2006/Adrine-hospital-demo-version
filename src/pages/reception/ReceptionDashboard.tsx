import { motion } from 'framer-motion';
import { Users, CalendarCheck, Clock, BedDouble, AlertTriangle, UserPlus, ArrowRight, Activity, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Today\'s Registrations', value: '34', change: '+8 from yesterday', icon: UserPlus, trend: 'up' },
  { label: 'Appointments', value: '67', change: '12 remaining', icon: CalendarCheck, trend: 'neutral' },
  { label: 'In Queue', value: '18', change: '3 urgent', icon: Clock, trend: 'warning' },
  { label: 'Beds Available', value: '24/120', change: '80% occupied', icon: BedDouble, trend: 'neutral' },
];

const recentRegistrations = [
  { id: 'UHID-240034', name: 'Rajesh Sharma', age: 45, gender: 'M', time: '10:32 AM', type: 'Walk-in', department: 'General Medicine' },
  { id: 'UHID-240035', name: 'Priya Patel', age: 28, gender: 'F', time: '10:45 AM', type: 'Appointment', department: 'Gynecology' },
  { id: 'UHID-240036', name: 'Amit Kumar', age: 62, gender: 'M', time: '11:00 AM', type: 'Emergency', department: 'Cardiology' },
  { id: 'UHID-240037', name: 'Sunita Devi', age: 55, gender: 'F', time: '11:15 AM', type: 'Walk-in', department: 'Orthopedics' },
  { id: 'UHID-240038', name: 'Vikram Singh', age: 38, gender: 'M', time: '11:30 AM', type: 'Referral', department: 'ENT' },
];

const upcomingAppointments = [
  { time: '11:45 AM', patient: 'Neha Gupta', doctor: 'Dr. R. Mehta', dept: 'Dermatology', status: 'confirmed', type: 'Follow-up' },
  { time: '12:00 PM', patient: 'Arjun Reddy', doctor: 'Dr. S. Iyer', dept: 'Orthopedics', status: 'confirmed', type: 'New' },
  { time: '12:15 PM', patient: 'Fatima Khan', doctor: 'Dr. A. Shah', dept: 'Pediatrics', status: 'pending', type: 'Teleconsult' },
  { time: '12:30 PM', patient: 'Ravi Teja', doctor: 'Dr. P. Nair', dept: 'General Medicine', status: 'confirmed', type: 'Walk-in' },
];

const alerts = [
  { message: 'Emergency registration pending — Bed 12A ICU required', type: 'urgent', time: '2 min ago' },
  { message: '3 patients waiting >30 min in General Medicine queue', type: 'warning', time: '5 min ago' },
  { message: 'Insurance verification pending for UHID-240034 (Star Health)', type: 'info', time: '12 min ago' },
  { message: 'Walk-in patient Ravi Teja needs appointment assignment', type: 'info', time: '15 min ago' },
];

const walkIns = [
  { name: 'Kavita Joshi', age: 35, gender: 'F', time: '10:50 AM', reason: 'Fever & body ache', status: 'pending-assignment' },
  { name: 'Deepak Verma', age: 48, gender: 'M', time: '11:10 AM', reason: 'Back pain', status: 'assigned', doctor: 'Dr. K. Rao' },
  { name: 'Ravi Teja', age: 30, gender: 'M', time: '11:25 AM', reason: 'Skin rash', status: 'pending-assignment' },
];

const quickReports = [
  { label: 'OPD Visits', value: '34', change: '+12%' },
  { label: 'Walk-ins', value: '8', change: '+3' },
  { label: 'Referrals', value: '5', change: '' },
  { label: 'Avg Wait Time', value: '22 min', change: '-3 min' },
];

export default function ReceptionDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reception Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Sunday, 8 March 2026 · Morning Shift</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/reception/registration?mode=emergency')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
          >
            <Zap className="w-4 h-4" /> Emergency
          </button>
          <button
            onClick={() => navigate('/reception/registration')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> New Registration
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <p className={`text-xs mt-1 ${s.trend === 'warning' ? 'text-warning' : s.trend === 'up' ? 'text-success' : 'text-muted-foreground'}`}>{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold">Active Alerts</span>
            <span className="text-xs text-muted-foreground ml-auto">{alerts.length} alerts</span>
          </div>
          {alerts.map((a, i) => (
            <div key={i} className={`text-sm px-3 py-2 rounded-lg flex items-center justify-between ${
              a.type === 'urgent' ? 'bg-destructive/10 text-destructive' :
              a.type === 'warning' ? 'bg-warning/10 text-warning-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              <span>{a.message}</span>
              <span className="text-xs opacity-70 ml-2 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <div className="rounded-xl border bg-card lg:col-span-2">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Recent Registrations</h2>
            <button onClick={() => navigate('/reception/registration')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y">
            {recentRegistrations.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.id} · {p.age}{p.gender} · {p.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.type === 'Emergency' ? 'bg-destructive/10 text-destructive' :
                    p.type === 'Appointment' ? 'bg-info/10 text-info' :
                    p.type === 'Referral' ? 'bg-accent text-accent-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>{p.type}</span>
                  <p className="text-xs text-muted-foreground mt-1">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Walk-in Management */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2"><Activity className="w-4 h-4" /> Walk-ins</h2>
            <span className="text-xs text-muted-foreground">{walkIns.length} today</span>
          </div>
          <div className="divide-y">
            {walkIns.map((w, i) => (
              <div key={i} className="px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{w.name} <span className="text-xs text-muted-foreground">{w.age}{w.gender}</span></p>
                  <span className="text-xs text-muted-foreground">{w.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{w.reason}</p>
                {w.status === 'pending-assignment' ? (
                  <button className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90">Assign Doctor</button>
                ) : (
                  <span className="text-xs text-success">✓ Assigned to {w.doctor}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Upcoming Appointments</h2>
            <button onClick={() => navigate('/reception/appointments')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y">
            {upcomingAppointments.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-mono font-medium w-16">{a.time}</div>
                  <div>
                    <p className="text-sm font-medium">{a.patient}</p>
                    <p className="text-xs text-muted-foreground">{a.doctor} · {a.dept} · {a.type}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  a.status === 'confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reports */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Today's Snapshot</h2>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border">
            {quickReports.map(r => (
              <div key={r.label} className="bg-card p-4">
                <p className="text-xs text-muted-foreground">{r.label}</p>
                <p className="text-xl font-bold mt-1">{r.value}</p>
                {r.change && <p className="text-xs text-success mt-0.5">{r.change}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
