import { motion } from 'framer-motion';
import {
  Users, CalendarDays, FlaskConical, Building2, Clock,
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle,
  Stethoscope, FileText, Activity, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

const stats = [
  { label: 'My Patients', value: '47', change: '+3 today', up: true, icon: Users },
  { label: 'OPD Queue', value: '12', change: '3 urgent', up: false, icon: CalendarDays },
  { label: 'Pending Reports', value: '8', change: '-2 since AM', up: true, icon: FlaskConical },
  { label: 'IPD Rounds Due', value: '6', change: '2 critical', up: false, icon: Building2 },
];

const weeklyPatients = [
  { day: 'Mon', opd: 18, ipd: 4 },
  { day: 'Tue', opd: 22, ipd: 5 },
  { day: 'Wed', opd: 15, ipd: 3 },
  { day: 'Thu', opd: 24, ipd: 6 },
  { day: 'Fri', opd: 20, ipd: 4 },
  { day: 'Sat', opd: 12, ipd: 2 },
  { day: 'Sun', opd: 5, ipd: 1 },
];

const consultationTrend = [
  { hour: '9AM', count: 3 },
  { hour: '10AM', count: 5 },
  { hour: '11AM', count: 4 },
  { hour: '12PM', count: 6 },
  { hour: '1PM', count: 2 },
  { hour: '2PM', count: 5 },
  { hour: '3PM', count: 7 },
  { hour: '4PM', count: 4 },
  { hour: '5PM', count: 3 },
];

const todayAppointments = [
  { time: '10:00 AM', patient: 'Rajesh Kumar', age: 45, type: 'Follow-up', status: 'completed' },
  { time: '10:30 AM', patient: 'Priya Sharma', age: 32, type: 'New Visit', status: 'in-progress' },
  { time: '11:00 AM', patient: 'Amit Singh', age: 58, type: 'Follow-up', status: 'waiting' },
  { time: '11:30 AM', patient: 'Sunita Devi', age: 41, type: 'Emergency', status: 'waiting' },
  { time: '12:00 PM', patient: 'Mohammed Ali', age: 67, type: 'Follow-up', status: 'scheduled' },
  { time: '2:00 PM', patient: 'Kavita Reddy', age: 29, type: 'New Visit', status: 'scheduled' },
  { time: '2:30 PM', patient: 'Suresh Patel', age: 53, type: 'Review', status: 'scheduled' },
  { time: '3:00 PM', patient: 'Anita Gupta', age: 38, type: 'Follow-up', status: 'scheduled' },
];

const pendingLabs = [
  { patient: 'Rajesh Kumar', test: 'CBC + ESR', ordered: '2h ago', priority: 'routine' },
  { patient: 'Priya Sharma', test: 'Lipid Profile', ordered: '3h ago', priority: 'routine' },
  { patient: 'Amit Singh', test: 'HbA1c + FBS', ordered: '1h ago', priority: 'urgent' },
  { patient: 'Sunita Devi', test: 'Thyroid Panel', ordered: '4h ago', priority: 'routine' },
  { patient: 'Mohammed Ali', test: 'Renal Function', ordered: '30m ago', priority: 'urgent' },
];

const criticalAlerts = [
  { patient: 'Bed 12A — Rajesh Kumar', message: 'SpO2 dropped to 89%, needs review', time: '5 min ago', severity: 'critical' },
  { patient: 'Bed 8B — Sunita Devi', message: 'Blood sugar 320 mg/dL, insulin adjustment needed', time: '15 min ago', severity: 'warning' },
  { patient: 'Bed 3C — Mohammed Ali', message: 'Post-op vitals stable, ready for ward transfer', time: '25 min ago', severity: 'info' },
];

const statusStyle: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-600',
  'in-progress': 'bg-blue-500/10 text-blue-600',
  waiting: 'bg-amber-500/10 text-amber-600',
  scheduled: 'bg-muted text-muted-foreground',
};

const severityStyle: Record<string, string> = {
  critical: 'bg-destructive/10 text-destructive',
  warning: 'bg-amber-500/10 text-amber-600',
  info: 'bg-blue-500/10 text-blue-600',
};

export default function DoctorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn(0)}>
        <h1 className="text-2xl font-bold tracking-tight">
          Good Morning, {user?.name ?? 'Doctor'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — You have <span className="font-semibold text-foreground">8 appointments</span> today
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i + 1)} className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div {...fadeIn(5)} className="lg:col-span-2 border rounded-xl bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm">Patient Volume</h2>
              <p className="text-xs text-muted-foreground mt-0.5">This week OPD vs IPD</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-foreground" /> OPD</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/50" /> IPD</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyPatients} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(0,0%,90%)' }} />
              <Bar dataKey="opd" fill="hsl(0,0%,15%)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="ipd" fill="hsl(0,0%,65%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeIn(6)} className="border rounded-xl bg-card p-5">
          <h2 className="font-semibold text-sm mb-1">Today's Consultation Flow</h2>
          <p className="text-xs text-muted-foreground mb-4">Patients seen by hour</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={consultationTrend}>
              <defs>
                <linearGradient id="gradConsult" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0,0%,15%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(0,0%,15%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(0,0%,70%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(0,0%,70%)" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(0,0%,90%)' }} />
              <Area type="monotone" dataKey="count" stroke="hsl(0,0%,15%)" fill="url(#gradConsult)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Appointments */}
        <motion.div {...fadeIn(7)} className="lg:col-span-2 border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Today's Appointments</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{todayAppointments.length} scheduled</p>
            </div>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y">
            {todayAppointments.map((apt) => (
              <div key={apt.time + apt.patient} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors">
                <span className="text-xs font-mono font-medium text-muted-foreground w-16 shrink-0">{apt.time}</span>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold">{apt.patient.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{apt.patient}</p>
                  <p className="text-[11px] text-muted-foreground">{apt.age}y · {apt.type}</p>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyle[apt.status]}`}>
                  {apt.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Alerts + Pending Labs */}
        <div className="space-y-4">
          {/* Critical Alerts */}
          <motion.div {...fadeIn(8)} className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                Critical Alerts
              </h2>
            </div>
            <div className="divide-y">
              {criticalAlerts.map((alert, i) => (
                <div key={i} className="px-4 py-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${severityStyle[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-xs font-medium">{alert.patient}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{alert.message}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending Labs */}
          <motion.div {...fadeIn(9)} className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-sm flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-muted-foreground" />
                Pending Lab Reports
              </h2>
              <span className="text-[11px] font-medium bg-muted px-2 py-0.5 rounded-full">{pendingLabs.length}</span>
            </div>
            <div className="divide-y">
              {pendingLabs.map((lab, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{lab.patient}</p>
                    <p className="text-[11px] text-muted-foreground">{lab.test}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold uppercase ${lab.priority === 'urgent' ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {lab.priority}
                    </span>
                    <p className="text-[10px] text-muted-foreground">{lab.ordered}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
