import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scissors, Clock, Activity, Users, AlertTriangle, CheckCircle2, 
  Timer, Bed, ArrowRight, Zap, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const LIVE_OT_STATUS = [
  { 
    room: 'OT-1', label: 'Main Theatre', status: 'in_progress' as const, 
    surgery: 'Laparoscopic Cholecystectomy', surgeon: 'Dr. Mehta', 
    patient: 'Ramesh Patel (P-1024)', startedAt: '09:30 AM', elapsed: '1h 20m',
    progress: 65, team: 4
  },
  { 
    room: 'OT-2', label: 'Ortho Theatre', status: 'preparing' as const, 
    surgery: 'Total Knee Replacement', surgeon: 'Dr. Shah',
    patient: 'Anilaben Joshi (P-2081)', startedAt: '11:00 AM', elapsed: 'Prep',
    progress: 15, team: 5
  },
  { 
    room: 'OT-3', label: 'Cardiac Theatre', status: 'available' as const, 
    surgery: '—', surgeon: '—',
    patient: '—', startedAt: '—', elapsed: '—',
    progress: 0, team: 0
  },
  { 
    room: 'OT-4', label: 'Minor Procedures', status: 'cleaning' as const, 
    surgery: 'Wound Debridement', surgeon: 'Dr. Trivedi',
    patient: 'Completed', startedAt: '—', elapsed: '—',
    progress: 100, team: 0
  },
];

const STATUS_CONFIG = {
  in_progress: { label: 'In Progress', class: 'bg-success/10 text-success border-success/20' },
  preparing: { label: 'Preparing', class: 'bg-warning/10 text-warning border-warning/20' },
  available: { label: 'Available', class: 'bg-info/10 text-info border-info/20' },
  cleaning: { label: 'Turnover', class: 'bg-muted text-muted-foreground border-border' },
};

const TODAY_STATS = [
  { label: 'Scheduled', value: '8', icon: Clock, color: 'text-info' },
  { label: 'Completed', value: '3', icon: CheckCircle2, color: 'text-success' },
  { label: 'In Progress', value: '1', icon: Activity, color: 'text-warning' },
  { label: 'Emergency', value: '1', icon: AlertTriangle, color: 'text-destructive' },
];

const UPCOMING = [
  { time: '11:00 AM', surgery: 'Total Knee Replacement', surgeon: 'Dr. Shah', room: 'OT-2', priority: 'elective' as const },
  { time: '01:30 PM', surgery: 'Appendectomy', surgeon: 'Dr. Mehta', room: 'OT-1', priority: 'urgent' as const },
  { time: '02:00 PM', surgery: 'Cataract Surgery', surgeon: 'Dr. Desai', room: 'OT-4', priority: 'elective' as const },
  { time: '03:30 PM', surgery: 'CABG', surgeon: 'Dr. Kapoor', room: 'OT-3', priority: 'elective' as const },
  { time: '04:00 PM', surgery: 'Fracture Fixation', surgeon: 'Dr. Shah', room: 'OT-2', priority: 'emergency' as const },
];

const PRIORITY_BADGE = {
  elective: 'bg-muted text-muted-foreground',
  urgent: 'bg-warning/10 text-warning border-warning/20',
  emergency: 'bg-destructive/10 text-destructive border-destructive/20',
};

const RECOVERY_PATIENTS = [
  { name: 'Suresh Bhatt', surgery: 'Hernia Repair', vitals: 'Stable', time: '45 min', nurse: 'Sr. Priya' },
  { name: 'Kanta Desai', surgery: 'Hysterectomy', vitals: 'Monitoring', time: '1h 20m', nurse: 'Sr. Meena' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function OTDashboard() {
  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operation Theatre</h1>
          <p className="text-sm text-muted-foreground">Live surgical operations & OT management</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Live</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TODAY_STATS.map(s => (
          <motion.div key={s.label} variants={item}>
            <Card className="border-border/60 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <s.icon className={`h-5 w-5 mb-3 ${s.color}`} strokeWidth={1.5} />
                <p className="text-3xl font-bold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label} Today</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live OT Room Status */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">Live OT Status</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {LIVE_OT_STATUS.map(ot => (
            <Card key={ot.room} className={`border-border/60 hover:shadow-md transition-all cursor-pointer group ${ot.status === 'in_progress' ? 'ring-1 ring-success/30' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-bold">
                      {ot.room}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{ot.label}</p>
                      <p className="text-[11px] text-muted-foreground">{ot.surgery}</p>
                    </div>
                  </div>
                  <Badge className={`${STATUS_CONFIG[ot.status].class} text-[10px]`}>
                    {STATUS_CONFIG[ot.status].label}
                  </Badge>
                </div>
                {ot.status === 'in_progress' && (
                  <>
                    <div className="w-full h-1.5 rounded-full bg-muted mb-3">
                      <div className="h-full rounded-full bg-success transition-all" style={{ width: `${ot.progress}%` }} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <p className="text-muted-foreground">Surgeon</p>
                        <p className="font-medium">{ot.surgeon}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Elapsed</p>
                        <p className="font-medium">{ot.elapsed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Team</p>
                        <p className="font-medium flex items-center gap-1"><Users className="h-3 w-3" /> {ot.team}</p>
                      </div>
                    </div>
                  </>
                )}
                {ot.status === 'preparing' && (
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="text-muted-foreground">Surgeon</p>
                      <p className="font-medium">{ot.surgeon}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Patient</p>
                      <p className="font-medium">{ot.patient}</p>
                    </div>
                  </div>
                )}
                {ot.status === 'available' && (
                  <p className="text-xs text-muted-foreground">Ready for next surgery</p>
                )}
                {ot.status === 'cleaning' && (
                  <p className="text-xs text-muted-foreground">Turnover in progress — est. 20 min</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Upcoming Surgeries */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">Upcoming Surgeries</span>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-3">
                {UPCOMING.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-right">
                        <p className="text-sm font-mono font-semibold">{s.time}</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div>
                        <p className="text-sm font-semibold">{s.surgery}</p>
                        <p className="text-[11px] text-muted-foreground">{s.surgeon} • {s.room}</p>
                      </div>
                    </div>
                    <Badge className={`${PRIORITY_BADGE[s.priority]} text-[10px] capitalize`}>{s.priority}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recovery Room */}
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">Recovery Room</span>
              </div>
              <div className="space-y-4">
                {RECOVERY_PATIENTS.map((p, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border/40">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <Badge className={`text-[10px] ${p.vitals === 'Stable' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                        {p.vitals}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{p.surgery}</p>
                    <div className="flex items-center justify-between mt-2 text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" /> {p.time}</span>
                      <span className="font-medium">{p.nurse}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg border border-dashed border-border flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Bed className="h-3.5 w-3.5" />
                  <span>2 of 4 recovery beds occupied</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
