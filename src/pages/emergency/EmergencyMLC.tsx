import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, FileText, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';

const mlcCases = [
  { id: 'MLC-2024-0056', caseId: 'ER-0889', patient: 'Rajesh Kumar (58M)', incident: 'Road Traffic Accident', policeReport: 'FIR-AHM-2024-8891', station: 'Satellite PS', officer: 'SI Rathore', status: 'Active', time: '10:15 AM', notified: true, details: 'RTA on SG Highway, brought by 108 ambulance. Multiple fractures, head injury.' },
  { id: 'MLC-2024-0055', caseId: 'ER-0876', patient: 'Deepak Chauhan (31M)', incident: 'Assault / Physical Violence', policeReport: 'FIR-AHM-2024-8887', station: 'Navrangpura PS', officer: 'ASI Parmar', status: 'Active', time: '7:30 AM', notified: true, details: 'Blunt force trauma to face and ribs. Claims attacked by unknown persons.' },
  { id: 'MLC-2024-0054', caseId: 'ER-0870', patient: 'Neha Patel (22F)', incident: 'Suspected Poisoning', policeReport: 'Pending', station: 'Vastrapur PS', officer: '—', status: 'Police Notified', time: 'Yesterday 11:00 PM', notified: true, details: 'Ingestion of unknown substance. Gastric lavage performed.' },
  { id: 'MLC-2024-0053', caseId: 'ER-0865', patient: 'Suresh Yadav (45M)', incident: 'Industrial Accident', policeReport: 'FIR-AHM-2024-8880', station: 'GIDC PS', officer: 'PI Shah', status: 'Closed', time: 'Yesterday 3:00 PM', notified: true, details: 'Crush injury to left hand at factory. Partial amputation of 2 fingers.' },
];

export default function EmergencyMLC() {
  const [search, setSearch] = useState('');
  const filtered = mlcCases.filter(c =>
    !search || c.patient.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search) || c.incident.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Medico-Legal Cases</h1>
          <p className="text-sm text-muted-foreground mt-1">Track MLC registrations, police notifications, and legal documentation</p>
        </div>
        <Button className="gap-2"><Shield className="w-4 h-4" />Register MLC</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-destructive">
          <p className="text-2xl font-bold text-foreground">{mlcCases.filter(c => c.status === 'Active').length}</p>
          <p className="text-xs text-muted-foreground">Active MLCs</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-foreground">{mlcCases.filter(c => c.status === 'Police Notified').length}</p>
          <p className="text-xs text-muted-foreground">Pending Police Report</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-foreground">{mlcCases.filter(c => c.status === 'Closed').length}</p>
          <p className="text-xs text-muted-foreground">Closed</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search MLC cases..." className="pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id} className="p-4 border-l-4 border-l-warning hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                  <Badge variant={c.status === 'Active' ? 'destructive' : c.status === 'Closed' ? 'secondary' : 'outline'} className="text-[10px]">{c.status}</Badge>
                  <Badge variant="outline" className="text-[10px]">{c.incident}</Badge>
                </div>
                <p className="font-medium text-sm text-foreground">{c.patient}</p>
                <p className="text-xs text-muted-foreground">{c.details}</p>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.time}</span>
                  <span>ER: {c.caseId}</span>
                  {c.policeReport !== 'Pending' ? (
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{c.policeReport} · {c.station}</span>
                  ) : (
                    <span className="text-warning flex items-center gap-1"><AlertTriangle className="w-3 h-3" />FIR Pending</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}