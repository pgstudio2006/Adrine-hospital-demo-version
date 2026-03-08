import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, AlertTriangle, User, Activity } from 'lucide-react';

type TriageCategory = 'critical' | 'urgent' | 'semi-urgent' | 'non-urgent';

const TRIAGE_CONFIG: Record<TriageCategory, { label: string; color: string; badge: 'destructive' | 'outline' | 'secondary' | 'default' }> = {
  critical: { label: 'Critical (Immediate)', color: 'border-l-destructive', badge: 'destructive' },
  urgent: { label: 'Urgent', color: 'border-l-warning', badge: 'outline' },
  'semi-urgent': { label: 'Semi-Urgent', color: 'border-l-info', badge: 'secondary' },
  'non-urgent': { label: 'Non-Urgent', color: 'border-l-success', badge: 'default' },
};

const patients = [
  { id: 'ER-0891', name: 'Unknown Male (~45y)', arrival: '10:42 AM', mode: 'Ambulance', complaint: 'Chest pain, diaphoresis', vitals: 'BP 90/60, HR 120, SpO2 88%', triage: null as TriageCategory | null, nurse: null as string | null, waitTime: '3 min' },
  { id: 'ER-0892', name: 'Sunita Verma', arrival: '10:45 AM', mode: 'Walk-in', complaint: 'Severe abdominal pain', vitals: 'BP 140/90, HR 98, SpO2 97%', triage: null, nurse: null, waitTime: '1 min' },
  { id: 'ER-0888', name: 'Amit Joshi', arrival: '10:20 AM', mode: 'Referral', complaint: 'Head injury, GCS 12', vitals: 'BP 110/70, HR 88, SpO2 96%', triage: 'urgent' as TriageCategory, nurse: 'Nurse Priya', waitTime: '22 min' },
  { id: 'ER-0886', name: 'Kavita Desai', arrival: '10:05 AM', mode: 'Walk-in', complaint: 'Laceration on forearm', vitals: 'BP 120/80, HR 76, SpO2 99%', triage: 'non-urgent' as TriageCategory, nurse: 'Nurse Rekha', waitTime: '37 min' },
  { id: 'ER-0885', name: 'Mohammed Sheikh', arrival: '9:58 AM', mode: 'Ambulance', complaint: 'Respiratory distress, wheezing', vitals: 'BP 130/85, HR 110, SpO2 90%', triage: 'critical' as TriageCategory, nurse: 'Nurse Priya', waitTime: '44 min' },
];

export default function EmergencyTriage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p => {
    if (filter !== 'all' && p.triage !== filter && !(filter === 'pending' && !p.triage)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Triage</h1>
          <p className="text-sm text-muted-foreground mt-1">Assess and prioritize emergency patients</p>
        </div>
        <Button className="gap-2">
          <User className="w-4 h-4" />
          Quick Register
        </Button>
      </div>

      {/* Triage Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(TRIAGE_CONFIG) as [TriageCategory, typeof TRIAGE_CONFIG[TriageCategory]][]).map(([key, config]) => {
          const count = patients.filter(p => p.triage === key).length;
          return (
            <Card key={key} className={`p-4 border-l-4 ${config.color} cursor-pointer hover:shadow-sm transition-shadow`} onClick={() => setFilter(key)}>
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground mt-1">{config.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search patient or case ID..." className="pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            <SelectItem value="pending">Pending Triage</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="semi-urgent">Semi-Urgent</SelectItem>
            <SelectItem value="non-urgent">Non-Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className={`p-4 border-l-4 ${!p.triage ? 'border-l-warning animate-pulse-subtle' : TRIAGE_CONFIG[p.triage].color} hover:shadow-sm transition-shadow`}>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                    {p.triage ? (
                      <Badge variant={TRIAGE_CONFIG[p.triage].badge} className="text-[10px]">{TRIAGE_CONFIG[p.triage].label}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-warning text-warning">⏳ Pending Triage</Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px]">{p.mode}</Badge>
                  </div>
                  <p className="font-medium text-sm text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground"><strong>Complaint:</strong> {p.complaint}</p>
                  <p className="text-xs font-mono text-muted-foreground"><Activity className="w-3 h-3 inline mr-1" />{p.vitals}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{p.arrival}</p>
                  <p className="text-[11px] text-muted-foreground">Wait: {p.waitTime}</p>
                  {!p.triage && (
                    <Button size="sm" className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Assess Now
                    </Button>
                  )}
                  {p.nurse && <p className="text-[10px] text-muted-foreground">{p.nurse}</p>}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}