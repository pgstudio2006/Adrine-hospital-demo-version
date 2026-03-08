import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Siren, Users, Clock, Activity, AlertTriangle, Bed, 
  Ambulance, HeartPulse, TrendingUp, ArrowRight
} from 'lucide-react';

const stats = [
  { label: 'Active Cases', value: '24', icon: Siren, change: '+3 this hour', accent: true },
  { label: 'In Triage', value: '6', icon: Users, change: '2 critical' },
  { label: 'Under Treatment', value: '12', icon: HeartPulse, change: '4 procedures' },
  { label: 'Avg Wait Time', value: '8m', icon: Clock, change: '↓ 2m from avg' },
];

const criticalCases = [
  { id: 'ER-2024-0891', patient: 'Unknown Male (~45y)', triage: 'Critical', status: 'Under Treatment', time: '3 min ago', doctor: 'Dr. Sharma' },
  { id: 'ER-2024-0890', patient: 'Priya Mehta', triage: 'Critical', status: 'Awaiting Doctor', time: '8 min ago', doctor: 'Unassigned' },
  { id: 'ER-2024-0889', patient: 'Rajesh Kumar', triage: 'Urgent', status: 'Under Treatment', time: '15 min ago', doctor: 'Dr. Patel' },
];

const triageSummary = [
  { category: 'Critical (Immediate)', count: 4, color: 'bg-destructive', percent: 17 },
  { category: 'Urgent', count: 8, color: 'bg-warning', percent: 33 },
  { category: 'Semi-Urgent', count: 7, color: 'bg-info', percent: 29 },
  { category: 'Non-Urgent', count: 5, color: 'bg-success', percent: 21 },
];

const recentAmbulances = [
  { vehicle: 'AMB-108-GJ05', eta: 'Arrived', patient: 'Chest pain, male ~55y', time: '2 min ago' },
  { vehicle: 'AMB-102-GJ01', eta: '4 min', patient: 'RTA victim, multiple injuries', time: 'En route' },
];

export default function EmergencyDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Emergency Department</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time ER monitoring & case management</p>
        </div>
        <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2">
          <Siren className="w-4 h-4" />
          New Emergency Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`p-5 ${s.accent ? 'border-destructive/30 bg-destructive/5' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`w-5 h-5 ${s.accent ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className="text-[11px] text-muted-foreground">{s.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Critical Cases */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Critical & Urgent Cases
            </h2>
            <Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3 h-3 ml-1" /></Button>
          </div>
          <div className="space-y-3">
            {criticalCases.map((c) => (
              <Card key={c.id} className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                      <Badge variant={c.triage === 'Critical' ? 'destructive' : 'outline'} className="text-[10px]">
                        {c.triage}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm text-foreground">{c.patient}</p>
                    <p className="text-xs text-muted-foreground">{c.doctor} · {c.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{c.status}</Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Ambulance Incoming */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Ambulance className="w-4 h-4" />
              Incoming Ambulances
            </h2>
            <div className="space-y-2">
              {recentAmbulances.map((a) => (
                <Card key={a.vehicle} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${a.eta === 'Arrived' ? 'bg-success animate-pulse' : 'bg-warning animate-pulse'}`} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{a.vehicle}</p>
                      <p className="text-[11px] text-muted-foreground">{a.patient}</p>
                    </div>
                  </div>
                  <Badge variant={a.eta === 'Arrived' ? 'default' : 'secondary'} className="text-[10px]">{a.eta}</Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Triage Distribution */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Triage Distribution</h2>
            <Card className="p-4 space-y-3">
              {triageSummary.map((t) => (
                <div key={t.category}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{t.category}</span>
                    <span className="font-medium text-foreground">{t.count}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.percent}%` }} />
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* ER Beds */}
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Bed className="w-4 h-4" />
              ER Bed Status
            </h2>
            <Card className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 15 }, (_, i) => {
                  const occupied = [0, 1, 3, 5, 7, 8, 10, 12, 13];
                  const critical = [0, 3, 7];
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded flex items-center justify-center text-[10px] font-mono ${
                        critical.includes(i) ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                        occupied.includes(i) ? 'bg-foreground/10 text-foreground border border-border' :
                        'bg-success/10 text-success border border-success/30'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-success/40" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-foreground/20" /> Occupied</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-destructive/40" /> Critical</span>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {['Register Walk-in', 'Log Ambulance Arrival', 'Code Blue Alert', 'Request Blood Bank'].map((a) => (
                <Button key={a} variant="outline" size="sm" className="w-full justify-start text-xs">{a}</Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}