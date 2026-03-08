import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Users, CalendarDays, BedDouble, TrendingUp, Activity,
  Clock, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Stethoscope, FlaskConical, Pill, Building2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

// ── Data ──────────────────────────────────────────
const statsAdmin = [
  { label: 'Total Patients', value: '12,847', change: '+12.5%', up: true, icon: Users },
  { label: "Today's OPD", value: '184', change: '+8%', up: true, icon: Stethoscope },
  { label: 'Beds Occupied', value: '156/200', change: '78%', up: true, icon: BedDouble },
  { label: 'Revenue Today', value: '₹4.2L', change: '+18.3%', up: true, icon: TrendingUp },
];

const statsDoctor = [
  { label: 'My Patients', value: '47', change: '+3', up: true, icon: Users },
  { label: 'OPD Queue', value: '12', change: '3 waiting', up: false, icon: CalendarDays },
  { label: 'Pending Reports', value: '8', change: '-2', up: false, icon: FlaskConical },
  { label: 'IPD Rounds', value: '6', change: 'Due today', up: true, icon: Building2 },
];

const statsReception = [
  { label: 'Check-ins Today', value: '67', change: '+15%', up: true, icon: Users },
  { label: 'Appointments', value: '94', change: '12 pending', up: true, icon: CalendarDays },
  { label: 'Available Beds', value: '44', change: '-3', up: false, icon: BedDouble },
  { label: 'Billing Pending', value: '₹1.8L', change: '23 bills', up: false, icon: TrendingUp },
];

const statsPharmacy = [
  { label: 'Prescriptions', value: '156', change: '+22', up: true, icon: Pill },
  { label: 'Dispensed', value: '134', change: '86%', up: true, icon: CheckCircle2 },
  { label: 'Low Stock Items', value: '12', change: '+3', up: false, icon: AlertTriangle },
  { label: 'Revenue', value: '₹89K', change: '+14%', up: true, icon: TrendingUp },
];

const revenueData = [
  { name: 'Mon', opd: 42000, ipd: 78000, pharmacy: 23000, lab: 18000 },
  { name: 'Tue', opd: 38000, ipd: 82000, pharmacy: 21000, lab: 22000 },
  { name: 'Wed', opd: 45000, ipd: 75000, pharmacy: 28000, lab: 19000 },
  { name: 'Thu', opd: 51000, ipd: 91000, pharmacy: 25000, lab: 24000 },
  { name: 'Fri', opd: 48000, ipd: 88000, pharmacy: 27000, lab: 21000 },
  { name: 'Sat', opd: 35000, ipd: 65000, pharmacy: 19000, lab: 15000 },
  { name: 'Sun', opd: 22000, ipd: 45000, pharmacy: 12000, lab: 9000 },
];

const departmentData = [
  { name: 'General Medicine', value: 35 },
  { name: 'Surgery', value: 25 },
  { name: 'Pediatrics', value: 18 },
  { name: 'Orthopedics', value: 12 },
  { name: 'Others', value: 10 },
];
const COLORS = ['hsl(0,0%,15%)', 'hsl(0,0%,30%)', 'hsl(0,0%,45%)', 'hsl(0,0%,60%)', 'hsl(0,0%,75%)'];

const opdQueue = [
  { token: 'T-045', patient: 'Rajesh Kumar', doctor: 'Dr. Sharma', dept: 'General', status: 'In Consultation', time: '10:30 AM' },
  { token: 'T-046', patient: 'Priya Patel', doctor: 'Dr. Mehta', dept: 'Pediatrics', status: 'Waiting', time: '10:45 AM' },
  { token: 'T-047', patient: 'Amit Singh', doctor: 'Dr. Sharma', dept: 'General', status: 'Waiting', time: '11:00 AM' },
  { token: 'T-048', patient: 'Sunita Devi', doctor: 'Dr. Gupta', dept: 'Gynecology', status: 'Checked In', time: '11:15 AM' },
  { token: 'T-049', patient: 'Mohammed Ali', doctor: 'Dr. Reddy', dept: 'Orthopedics', status: 'Waiting', time: '11:30 AM' },
];

const recentActivity = [
  { text: 'Patient Rajesh Kumar admitted to ICU Ward', time: '2 min ago', type: 'alert' as const },
  { text: 'Lab report ready — Patient #1089 CBC Complete', time: '5 min ago', type: 'success' as const },
  { text: 'OPD Token #45 assigned to Dr. Sharma', time: '8 min ago', type: 'info' as const },
  { text: 'Discharge summary generated — Bed 12A', time: '15 min ago', type: 'success' as const },
  { text: 'Low stock alert: Paracetamol 500mg (23 units)', time: '22 min ago', type: 'warning' as const },
  { text: 'Insurance pre-auth approved — Claim #4521', time: '30 min ago', type: 'success' as const },
];

const typeStyles = {
  alert: 'bg-destructive/10 text-destructive',
  success: 'bg-emerald-500/10 text-emerald-600',
  info: 'bg-blue-500/10 text-blue-600',
  warning: 'bg-amber-500/10 text-amber-600',
};

const typeIcons = {
  alert: AlertTriangle,
  success: CheckCircle2,
  info: Activity,
  warning: Clock,
};

// ── Component ──────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role ?? 'admin';

  const stats = role === 'doctor' ? statsDoctor
    : role === 'receptionist' ? statsReception
    : role === 'pharmacist' ? statsPharmacy
    : statsAdmin;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn(0)}>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeIn(i + 1)}
            className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${stat.up ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div {...fadeIn(5)} className="lg:col-span-2 border rounded-xl bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-foreground" /> OPD</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/50" /> IPD</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gradOPD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0,0%,15%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(0,0%,15%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(0,0%,90%)' }}
                formatter={(value: number) => [`₹${(value/1000).toFixed(1)}K`, '']}
              />
              <Area type="monotone" dataKey="opd" stroke="hsl(0,0%,15%)" fill="url(#gradOPD)" strokeWidth={2} />
              <Area type="monotone" dataKey="ipd" stroke="hsl(0,0%,55%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Distribution */}
        <motion.div {...fadeIn(6)} className="border rounded-xl bg-card p-5">
          <h2 className="font-semibold text-sm mb-1">Department Load</h2>
          <p className="text-xs text-muted-foreground mb-4">Patient distribution today</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={departmentData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {departmentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {departmentData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {d.name}
                </span>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Queue + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* OPD Queue */}
        <motion.div {...fadeIn(7)} className="border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Live OPD Queue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">5 patients in queue</p>
            </div>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </button>
          </div>
          <div className="divide-y">
            {opdQueue.map((item) => (
              <div key={item.token} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors">
                <span className="text-xs font-mono font-semibold bg-muted px-2 py-1 rounded">{item.token}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.patient}</p>
                  <p className="text-[11px] text-muted-foreground">{item.doctor} · {item.dept}</p>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.status === 'In Consultation' ? 'bg-emerald-500/10 text-emerald-600'
                  : item.status === 'Checked In' ? 'bg-blue-500/10 text-blue-600'
                  : 'bg-muted text-muted-foreground'
                }`}>
                  {item.status}
                </span>
                <span className="text-[11px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div {...fadeIn(8)} className="border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Recent Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">System-wide updates</p>
            </div>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </button>
          </div>
          <div className="divide-y">
            {recentActivity.map((item, i) => {
              const Icon = typeIcons[item.type];
              return (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${typeStyles[item.type]}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Bar */}
      <motion.div {...fadeIn(9)} className="border rounded-xl bg-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'ICU Beds', value: '4/8', status: 'critical' },
            { label: 'Emergency', value: '2 active', status: 'alert' },
            { label: 'OT Scheduled', value: '3 today', status: 'normal' },
            { label: 'Lab Pending', value: '18 reports', status: 'warning' },
            { label: 'Pharmacy Queue', value: '7 Rx', status: 'normal' },
            { label: 'Discharges', value: '5 pending', status: 'normal' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className={`text-lg font-bold ${
                item.status === 'critical' ? 'text-destructive'
                : item.status === 'alert' ? 'text-amber-600'
                : item.status === 'warning' ? 'text-amber-500'
                : 'text-foreground'
              }`}>{item.value}</p>
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
