import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Clock, MapPin } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'Waiting for Triage': 'bg-warning/10 text-warning border-warning/30',
  'Waiting for Doctor': 'bg-info/10 text-info border-info/30',
  'Under Treatment': 'bg-foreground/10 text-foreground border-border',
  'Under Observation': 'bg-accent text-accent-foreground border-border',
  'Transferred to IPD': 'bg-success/10 text-success border-success/30',
  'Discharged': 'bg-muted text-muted-foreground border-border',
};

const cases = [
  { id: 'ER-2024-0891', patient: 'Unknown Male (~45y)', age: '~45', gender: 'M', arrival: '10:42 AM', mode: 'Ambulance', triage: 'Critical', status: 'Under Treatment', location: 'Resuscitation Bay 1', doctor: 'Dr. Sharma', complaint: 'Chest pain, diaphoresis' },
  { id: 'ER-2024-0890', patient: 'Priya Mehta', age: '32', gender: 'F', arrival: '10:38 AM', mode: 'Walk-in', triage: 'Urgent', status: 'Waiting for Doctor', location: 'Triage Area', doctor: 'Unassigned', complaint: 'Severe allergic reaction' },
  { id: 'ER-2024-0889', patient: 'Rajesh Kumar', age: '58', gender: 'M', arrival: '10:15 AM', mode: 'Ambulance', triage: 'Critical', status: 'Under Treatment', location: 'Trauma Bay 2', doctor: 'Dr. Patel', complaint: 'RTA - Multiple fractures' },
  { id: 'ER-2024-0887', patient: 'Fatima Begum', age: '67', gender: 'F', arrival: '9:50 AM', mode: 'Referral', triage: 'Urgent', status: 'Under Observation', location: 'Obs Bed 3', doctor: 'Dr. Desai', complaint: 'Acute dyspnea, bilateral crepts' },
  { id: 'ER-2024-0884', patient: 'Vikram Singh', age: '28', gender: 'M', arrival: '9:20 AM', mode: 'Walk-in', triage: 'Semi-Urgent', status: 'Under Treatment', location: 'Treatment Bay 5', doctor: 'Dr. Gupta', complaint: 'Deep laceration, right thigh' },
  { id: 'ER-2024-0880', patient: 'Smt. Lata Devi', age: '72', gender: 'F', arrival: '8:45 AM', mode: 'Ambulance', triage: 'Critical', status: 'Transferred to IPD', location: 'ICU Bed 4', doctor: 'Dr. Sharma', complaint: 'Stroke symptoms, left hemiparesis' },
  { id: 'ER-2024-0878', patient: 'Arjun Nair', age: '19', gender: 'M', arrival: '8:10 AM', mode: 'Walk-in', triage: 'Non-Urgent', status: 'Discharged', location: '—', doctor: 'Dr. Gupta', complaint: 'Minor burn, left hand' },
];

export default function EmergencyCases() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tab, setTab] = useState('active');

  const activeCases = cases.filter(c => !['Discharged', 'Transferred to IPD'].includes(c.status));
  const closedCases = cases.filter(c => ['Discharged', 'Transferred to IPD'].includes(c.status));

  const currentList = tab === 'active' ? activeCases : closedCases;
  const filtered = currentList.filter(c => {
    if (search && !c.patient.toLowerCase().includes(search.toLowerCase()) && !c.id.includes(search)) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Emergency Cases</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all ER patient cases and their status</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeCases.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedCases.length})</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search case ID or patient..." className="pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.keys(STATUS_COLORS).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={tab} className="mt-4">
          <div className="space-y-3">
            {filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                        <Badge variant={c.triage === 'Critical' ? 'destructive' : 'outline'} className="text-[10px]">{c.triage}</Badge>
                        <Badge className={`text-[10px] border ${STATUS_COLORS[c.status] || ''}`}>{c.status}</Badge>
                      </div>
                      <p className="font-medium text-sm text-foreground">{c.patient} <span className="text-muted-foreground font-normal">· {c.age}{c.gender} · {c.mode}</span></p>
                      <p className="text-xs text-muted-foreground">{c.complaint}</p>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.arrival}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                        <span>{c.doctor}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}