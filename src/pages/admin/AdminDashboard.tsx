import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Bed, CalendarDays, Activity, IndianRupee, Pill, FlaskConical, UsersRound, FileText, ArrowRight, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'Total Patients', value: '8', sub: '+12% this month', icon: Users, color: 'text-success' },
  { label: 'Bed Occupancy', value: '7%', sub: '2 of 30 beds', icon: Bed, color: 'text-info' },
  { label: "Today's Appointments", value: '6', sub: '+8 from yesterday', icon: CalendarDays, color: 'text-success' },
  { label: 'Active Admissions', value: '2', sub: '2 discharges today', icon: Activity, color: 'text-warning' },
  { label: 'Revenue Today', value: '₹4.2L', sub: '+15% vs avg', icon: IndianRupee, color: 'text-success' },
];

const QUICK_ACTIONS = [
  { label: 'Pending Rx', value: 2, icon: Pill, color: 'text-success' },
  { label: 'Pending Labs', value: 2, icon: FlaskConical, color: 'text-info' },
  { label: 'Staff on Duty', value: 24, icon: UsersRound, color: 'text-foreground' },
  { label: "Today's Actions", value: 156, icon: FileText, color: 'text-foreground' },
];

const RECENT_ADMISSIONS = [
  { name: 'Kishanbhai Joshi', ward: 'ICU', bed: 'ICU-01', status: 'Admitted' },
  { name: 'Kokilaben Trivedi', ward: 'General Ward', bed: 'GW-05', status: 'Admitted' },
  { name: 'Ramesh Patel', ward: 'Private', bed: 'PV-02', status: 'Admitted' },
];

const DEPT_PERFORMANCE = [
  { dept: 'OPD', patients: '45 patients today', growth: '+12%' },
  { dept: 'Emergency', patients: '12 patients today', growth: '+5%' },
  { dept: 'Pediatrics', patients: '18 patients today', growth: '+8%' },
  { dept: 'Cardiology', patients: '9 patients today', growth: '+3%' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STATS.map(s => (
          <motion.div key={s.label} variants={item}>
            <Card className="hover:shadow-md transition-shadow border-border/60">
              <CardContent className="p-5">
                <s.icon className={`h-5 w-5 mb-3 ${s.color}`} strokeWidth={1.5} />
                <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                <p className={`text-xs mt-1 ${s.color}`}>{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map(q => (
          <motion.div key={q.label} variants={item}>
            <Card className="hover:shadow-md transition-all cursor-pointer group border-border/60">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <q.icon className={`h-5 w-5 ${q.color}`} strokeWidth={1.5} />
                  <div>
                    <p className="text-2xl font-bold tracking-tight">{q.value}</p>
                    <p className="text-xs text-muted-foreground">{q.label}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Geographic Intelligence Banner */}
      <motion.div variants={item}>
        <Card
          className="bg-primary text-primary-foreground overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow border-0"
          onClick={() => navigate('/admin/geo-intelligence')}
        >
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className="flex-1 p-8 md:p-10">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 opacity-70" />
                  <span className="text-xs font-medium tracking-[0.15em] uppercase opacity-70">Geographic Intelligence</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Patient Distribution Analysis</h2>
                <p className="text-sm opacity-70 max-w-md leading-relaxed">
                  Analyze catchment zones across Ahmedabad. Track patient flow and identify growth opportunities.
                </p>
                <div className="flex items-center gap-2 mt-5 text-sm font-medium group-hover:gap-3 transition-all">
                  View Interactive Map <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              {/* Mini map preview */}
              <div className="hidden md:flex items-center justify-center w-72 bg-primary/80 relative">
                <div className="relative w-40 h-32">
                  {/* Catchment circles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-primary-foreground/10" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-primary-foreground/15" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary-foreground/10" />
                  </div>
                  {/* Dots */}
                  <div className="absolute top-4 right-8 w-2.5 h-2.5 rounded-full bg-success" />
                  <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-info" />
                  <div className="absolute top-12 right-4 w-1.5 h-1.5 rounded-full bg-warning" />
                  <div className="absolute bottom-4 right-12 w-2.5 h-2.5 rounded-full bg-success" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">Recent Admissions</span>
              </div>
              <div className="space-y-4">
                {RECENT_ADMISSIONS.map((a, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.ward} • {a.bed}</p>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/15 text-xs">{a.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Performance */}
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">Department Performance</span>
              </div>
              <div className="space-y-4">
                {DEPT_PERFORMANCE.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{d.dept}</p>
                      <p className="text-xs text-muted-foreground">{d.patients}</p>
                    </div>
                    <span className="text-sm font-semibold text-success">{d.growth}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
