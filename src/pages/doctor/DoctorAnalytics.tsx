import { motion } from 'framer-motion';
import {
  TrendingUp, Users, CalendarDays, Clock, Star,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

const stats = [
  { label: 'Total Patients (Month)', value: '342', change: '+12.5%', up: true, icon: Users },
  { label: 'Avg Consult Time', value: '14 min', change: '-2 min', up: true, icon: Clock },
  { label: 'Revenue (Month)', value: '₹4.8L', change: '+18.3%', up: true, icon: TrendingUp },
  { label: 'Patient Satisfaction', value: '4.7/5', change: '+0.2', up: true, icon: Star },
];

const monthlyPatients = [
  { month: 'Oct', opd: 280, ipd: 32 },
  { month: 'Nov', opd: 310, ipd: 38 },
  { month: 'Dec', opd: 265, ipd: 28 },
  { month: 'Jan', opd: 295, ipd: 35 },
  { month: 'Feb', opd: 320, ipd: 40 },
  { month: 'Mar', opd: 342, ipd: 42 },
];

const revenueData = [
  { month: 'Oct', consultation: 320000, procedures: 180000 },
  { month: 'Nov', consultation: 358000, procedures: 195000 },
  { month: 'Dec', consultation: 290000, procedures: 160000 },
  { month: 'Jan', consultation: 340000, procedures: 210000 },
  { month: 'Feb', consultation: 375000, procedures: 225000 },
  { month: 'Mar', consultation: 410000, procedures: 240000 },
];

const diagnosisDistribution = [
  { name: 'Diabetes', value: 28 },
  { name: 'Hypertension', value: 22 },
  { name: 'Respiratory', value: 18 },
  { name: 'Cardiac', value: 15 },
  { name: 'GI Disorders', value: 10 },
  { name: 'Others', value: 7 },
];
const COLORS = ['hsl(0,0%,12%)', 'hsl(0,0%,28%)', 'hsl(0,0%,42%)', 'hsl(0,0%,55%)', 'hsl(0,0%,68%)', 'hsl(0,0%,80%)'];

const dailyConsults = [
  { day: 'Mon', count: 22, avg: 18 },
  { day: 'Tue', count: 25, avg: 18 },
  { day: 'Wed', count: 18, avg: 18 },
  { day: 'Thu', count: 28, avg: 18 },
  { day: 'Fri', count: 24, avg: 18 },
  { day: 'Sat', count: 15, avg: 18 },
];

const ageDistribution = [
  { group: '0-18', male: 12, female: 15 },
  { group: '19-35', male: 28, female: 35 },
  { group: '36-50', male: 42, female: 38 },
  { group: '51-65', male: 55, female: 48 },
  { group: '65+', male: 38, female: 32 },
];

const topProcedures = [
  { name: 'ECG', count: 45, revenue: '₹67.5K' },
  { name: 'Echocardiography', count: 22, revenue: '₹1.1L' },
  { name: 'Spirometry', count: 18, revenue: '₹36K' },
  { name: 'Stress Test', count: 12, revenue: '₹72K' },
  { name: 'Holter Monitor', count: 8, revenue: '₹56K' },
];

export default function DoctorAnalytics() {
  return (
    <div className="space-y-6">
      <motion.div {...fadeIn(0)}>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Your practice performance overview — Last 6 months</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i + 1)} className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-destructive'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Patient Volume + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeIn(5)} className="border rounded-xl bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm">Patient Volume</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly OPD vs IPD trend</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-foreground" /> OPD</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/50" /> IPD</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyPatients} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(0,0%,90%)' }} />
              <Bar dataKey="opd" fill="hsl(0,0%,15%)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="ipd" fill="hsl(0,0%,65%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeIn(6)} className="border rounded-xl bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm">Revenue Breakdown</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Consultation vs Procedures</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0,0%,15%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(0,0%,15%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(0,0%,90%)' }} formatter={(v: number) => [`₹${(v/1000).toFixed(0)}K`, '']} />
              <Area type="monotone" dataKey="consultation" stroke="hsl(0,0%,15%)" fill="url(#gradRev)" strokeWidth={2} />
              <Area type="monotone" dataKey="procedures" stroke="hsl(0,0%,55%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Middle Row: Diagnosis + Daily Consults */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div {...fadeIn(7)} className="border rounded-xl bg-card p-5">
          <h2 className="font-semibold text-sm mb-1">Diagnosis Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Top categories this month</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={diagnosisDistribution} innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                {diagnosisDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {diagnosisDistribution.map((d, i) => (
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

        <motion.div {...fadeIn(8)} className="lg:col-span-2 border rounded-xl bg-card p-5">
          <h2 className="font-semibold text-sm mb-1">Daily Consultation Pattern</h2>
          <p className="text-xs text-muted-foreground mb-4">This week vs average</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyConsults} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(0,0%,90%)' }} />
              <Bar dataKey="count" fill="hsl(0,0%,15%)" radius={[3, 3, 0, 0]} name="This Week" />
              <Bar dataKey="avg" fill="hsl(0,0%,80%)" radius={[3, 3, 0, 0]} name="Average" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row: Age Distribution + Top Procedures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeIn(9)} className="border rounded-xl bg-card p-5">
          <h2 className="font-semibold text-sm mb-1">Patient Age & Gender Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Demographic breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageDistribution} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="group" tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0,0%,70%)" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid hsl(0,0%,90%)' }} />
              <Bar dataKey="male" fill="hsl(0,0%,20%)" radius={[3, 3, 0, 0]} name="Male" />
              <Bar dataKey="female" fill="hsl(0,0%,55%)" radius={[3, 3, 0, 0]} name="Female" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeIn(10)} className="border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm">Top Procedures</h2>
            <p className="text-xs text-muted-foreground mt-0.5">This month's most performed</p>
          </div>
          <div className="divide-y">
            {topProcedures.map((proc, i) => (
              <div key={proc.name} className="flex items-center gap-3 px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{proc.name}</p>
                  <p className="text-[11px] text-muted-foreground">{proc.count} performed</p>
                </div>
                <span className="text-sm font-semibold">{proc.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
