import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity, Users, BedDouble, Stethoscope, Heart, Clock,
  TrendingUp, AlertTriangle, CheckCircle2, Zap, Building2,
  Pill, FlaskConical, Scissors, Radio
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useHospital } from '@/stores/hospitalStore';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

const hourlyPatientFlow = [
  { hour: '6AM', inflow: 5, outflow: 2 }, { hour: '8AM', inflow: 22, outflow: 5 },
  { hour: '10AM', inflow: 35, outflow: 12 }, { hour: '12PM', inflow: 28, outflow: 18 },
  { hour: '2PM', inflow: 30, outflow: 20 }, { hour: '4PM', inflow: 18, outflow: 25 },
  { hour: '6PM', inflow: 12, outflow: 22 }, { hour: '8PM', inflow: 8, outflow: 15 },
];

const deptActivity = [
  { dept: 'Emergency', active: 12, pending: 3, staff: 8, load: 85 },
  { dept: 'OPD', active: 45, pending: 12, staff: 15, load: 78 },
  { dept: 'ICU', active: 8, pending: 0, staff: 6, load: 92 },
  { dept: 'General Ward', active: 65, pending: 5, staff: 20, load: 68 },
  { dept: 'OT', active: 4, pending: 2, staff: 12, load: 55 },
  { dept: 'Lab', active: 28, pending: 15, staff: 5, load: 88 },
  { dept: 'Radiology', active: 8, pending: 4, staff: 3, load: 72 },
  { dept: 'Pharmacy', active: 18, pending: 8, staff: 4, load: 80 },
];

const staffActivityLog = [
  { time: '14:32', staff: 'Dr. Anil Sharma', role: 'Doctor', action: 'Completed consultation — Rajesh Patel (UHID-1234)', dept: 'OPD' },
  { time: '14:28', staff: 'Nurse Priya', role: 'Nurse', action: 'Administered medication — Paracetamol 500mg IV', dept: 'ICU' },
  { time: '14:25', staff: 'Dr. Meena Gupta', role: 'Doctor', action: 'Ordered CT Brain — Emergency case', dept: 'Emergency' },
  { time: '14:20', staff: 'Lab Tech Rahul', role: 'Lab', action: 'CBC report verified and released', dept: 'Lab' },
  { time: '14:18', staff: 'Nurse Kavita', role: 'Nurse', action: 'Vitals recorded — Ward 3, Bed 7', dept: 'Ward' },
  { time: '14:15', staff: 'Dr. Vijay Kumar', role: 'Doctor', action: 'Discharge summary completed — Suresh M.', dept: 'IPD' },
  { time: '14:12', staff: 'Pharmacist Deepa', role: 'Pharmacy', action: 'Prescription dispensed — 5 medications', dept: 'Pharmacy' },
  { time: '14:08', staff: 'OT Coord. Rajan', role: 'OT', action: 'OT-2 prepared for appendectomy', dept: 'OT' },
];

const bedSummary = [
  { ward: 'General Male', total: 40, occupied: 32, available: 8 },
  { ward: 'General Female', total: 35, occupied: 28, available: 7 },
  { ward: 'ICU', total: 10, occupied: 8, available: 2 },
  { ward: 'CCU', total: 6, occupied: 5, available: 1 },
  { ward: 'NICU', total: 8, occupied: 4, available: 4 },
  { ward: 'Private', total: 20, occupied: 15, available: 5 },
  { ward: 'Semi-Private', total: 25, occupied: 20, available: 5 },
];

export default function AdminCommandCenter() {
  const { patients, labOrders, prescriptions, invoices } = useHospital();
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalBeds = bedSummary.reduce((s, b) => s + b.total, 0);
  const occupiedBeds = bedSummary.reduce((s, b) => s + b.occupied, 0);

  return (
    <div className="space-y-4">
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary animate-pulse" /> Central Command Center
          </h1>
          <p className="text-sm text-muted-foreground">Unified real-time hospital operations view</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-mono font-bold">{clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
          <p className="text-[10px] text-muted-foreground">{clock.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </motion.div>

      {/* Live KPIs */}
      <motion.div {...fadeIn(1)} className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: 'OPD Today', value: 142 + patients.length, icon: Users, color: 'text-primary' },
          { label: 'IPD Active', value: occupiedBeds, icon: BedDouble, color: 'text-emerald-600' },
          { label: 'ER Cases', value: 18, icon: Zap, color: 'text-destructive' },
          { label: 'Surgeries', value: 6, icon: Scissors, color: 'text-amber-600' },
          { label: 'Lab Pending', value: 15 + labOrders.length, icon: FlaskConical, color: 'text-blue-600' },
          { label: 'Rx Pending', value: 8 + prescriptions.length, icon: Pill, color: 'text-purple-600' },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-3 flex items-center gap-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              <div>
                <p className="text-lg font-bold">{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department Load */}
        <motion.div {...fadeIn(2)} className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Department Load Monitor
              </p>
              <div className="space-y-2.5">
                {deptActivity.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs w-24 shrink-0">{d.dept}</span>
                    <div className="flex-1">
                      <Progress value={d.load} className={`h-2 ${d.load > 85 ? '[&>div]:bg-destructive' : d.load > 70 ? '[&>div]:bg-amber-500' : ''}`} />
                    </div>
                    <span className={`text-xs font-bold w-10 text-right ${d.load > 85 ? 'text-destructive' : d.load > 70 ? 'text-amber-600' : 'text-emerald-600'}`}>{d.load}%</span>
                    <div className="flex gap-2 text-[10px] text-muted-foreground w-32">
                      <span>{d.active} active</span>
                      <span>{d.pending} queue</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bed Occupancy */}
        <motion.div {...fadeIn(3)}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5" /> Bed Occupancy
                </p>
                <Badge variant="secondary" className="text-[10px]">{occupiedBeds}/{totalBeds}</Badge>
              </div>
              <div className="space-y-2">
                {bedSummary.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span>{b.ward}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(b.occupied / b.total) * 100} className="w-20 h-1.5" />
                      <span className={`font-medium w-8 text-right ${b.available <= 2 ? 'text-destructive' : 'text-emerald-600'}`}>
                        {b.available}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Patient Flow Chart */}
        <motion.div {...fadeIn(4)}>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Hourly Patient Flow
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyPatientFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: 'hsl(var(--card))' }} />
                  <Bar dataKey="inflow" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} name="Inflow" />
                  <Bar dataKey="outflow" fill="hsl(var(--muted))" radius={[2, 2, 0, 0]} name="Outflow" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Activity Log */}
        <motion.div {...fadeIn(5)}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Live Staff Activity
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Live</span>
                </div>
              </div>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {staffActivityLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs border-b last:border-0 pb-1.5">
                    <span className="text-[10px] text-muted-foreground w-10 shrink-0 font-mono">{log.time}</span>
                    <div className="flex-1">
                      <span className="font-medium">{log.staff}</span>
                      <span className="text-muted-foreground"> — {log.action}</span>
                    </div>
                    <Badge variant="outline" className="text-[8px] shrink-0">{log.dept}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
