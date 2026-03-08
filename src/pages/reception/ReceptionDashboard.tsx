import { motion } from 'framer-motion';
import { Users, CalendarCheck, Clock, BedDouble, AlertTriangle, TrendingUp, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Today\'s Registrations', value: '34', change: '+8', icon: UserPlus, trend: 'up' },
  { label: 'Appointments', value: '67', change: '12 remaining', icon: CalendarCheck, trend: 'neutral' },
  { label: 'In Queue', value: '18', change: '3 urgent', icon: Clock, trend: 'warning' },
  { label: 'Beds Available', value: '24/120', change: '80% occupied', icon: BedDouble, trend: 'neutral' },
];

const recentRegistrations = [
  { id: 'P-2401', name: 'Rajesh Sharma', age: 45, gender: 'M', time: '10:32 AM', type: 'Walk-in', department: 'General Medicine' },
  { id: 'P-2402', name: 'Priya Patel', age: 28, gender: 'F', time: '10:45 AM', type: 'Appointment', department: 'Gynecology' },
  { id: 'P-2403', name: 'Amit Kumar', age: 62, gender: 'M', time: '11:00 AM', type: 'Emergency', department: 'Cardiology' },
  { id: 'P-2404', name: 'Sunita Devi', age: 55, gender: 'F', time: '11:15 AM', type: 'Walk-in', department: 'Orthopedics' },
  { id: 'P-2405', name: 'Vikram Singh', age: 38, gender: 'M', time: '11:30 AM', type: 'Referral', department: 'ENT' },
];

const upcomingAppointments = [
  { time: '11:45 AM', patient: 'Neha Gupta', doctor: 'Dr. R. Mehta', dept: 'Dermatology', status: 'confirmed' },
  { time: '12:00 PM', patient: 'Arjun Reddy', doctor: 'Dr. S. Iyer', dept: 'Orthopedics', status: 'confirmed' },
  { time: '12:15 PM', patient: 'Fatima Khan', doctor: 'Dr. A. Shah', dept: 'Pediatrics', status: 'pending' },
  { time: '12:30 PM', patient: 'Ravi Teja', doctor: 'Dr. P. Nair', dept: 'General Medicine', status: 'confirmed' },
];

const alerts = [
  { message: 'Emergency registration pending — Bed 12A required', type: 'urgent' },
  { message: '3 patients waiting >30 min in queue', type: 'warning' },
  { message: 'Insurance verification pending for P-2401', type: 'info' },
];

export default function ReceptionDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reception Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Sunday, 8 March 2026 · Morning Shift</p>
        </div>
        <button
          onClick={() => navigate('/reception/registration')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          New Registration
        </button>
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
            <p className={`text-xs mt-1 ${s.trend === 'warning' ? 'text-warning' : 'text-muted-foreground'}`}>{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold">Active Alerts</span>
          </div>
          {alerts.map((a, i) => (
            <div key={i} className={`text-sm px-3 py-2 rounded-lg ${
              a.type === 'urgent' ? 'bg-destructive/10 text-destructive' :
              a.type === 'warning' ? 'bg-warning/10 text-warning-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {a.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="rounded-xl border bg-card">
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
                    'bg-muted text-muted-foreground'
                  }`}>{p.type}</span>
                  <p className="text-xs text-muted-foreground mt-1">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                    <p className="text-xs text-muted-foreground">{a.doctor} · {a.dept}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  a.status === 'confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
