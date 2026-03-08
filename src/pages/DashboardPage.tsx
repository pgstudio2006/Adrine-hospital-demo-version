import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types/roles';
import { motion } from 'framer-motion';
import { 
  Users, CalendarDays, BedDouble, TrendingUp, 
  Activity, Clock, AlertTriangle, CheckCircle2 
} from 'lucide-react';

const stats = [
  { label: 'Total Patients', value: '1,247', change: '+12%', icon: Users },
  { label: 'Today\'s OPD', value: '84', change: '+5%', icon: CalendarDays },
  { label: 'Beds Occupied', value: '156/200', change: '78%', icon: BedDouble },
  { label: 'Revenue Today', value: '₹2.4L', change: '+18%', icon: TrendingUp },
];

const recentActivity = [
  { text: 'Patient Rajesh Kumar admitted to ICU Ward', time: '2 min ago', type: 'alert' },
  { text: 'Lab report ready for Patient #1089', time: '5 min ago', type: 'success' },
  { text: 'OPD Token #45 - Dr. Sharma', time: '8 min ago', type: 'info' },
  { text: 'Discharge summary generated for Bed 12A', time: '15 min ago', type: 'success' },
  { text: 'Low stock alert: Paracetamol 500mg', time: '22 min ago', type: 'warning' },
];

const typeIcons = {
  alert: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
  success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  info: <Activity className="w-3.5 h-3.5 text-blue-500" />,
  warning: <Clock className="w-3.5 h-3.5 text-amber-500" />,
};

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {ROLE_LABELS[user?.role ?? 'admin']} Dashboard — Here's your overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border rounded-lg p-4 bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="border rounded-lg bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {recentActivity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center gap-3 px-4 py-3"
            >
              {typeIcons[item.type as keyof typeof typeIcons]}
              <span className="text-sm flex-1">{item.text}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
