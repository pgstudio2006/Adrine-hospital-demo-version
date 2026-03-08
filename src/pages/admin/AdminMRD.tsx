import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Archive, Clock, Shield } from 'lucide-react';
import { useState } from 'react';

const RECORDS = [
  { uhid: 'UHID-1001', patient: 'Amit Shah', totalVisits: 12, lastVisit: '2025-03-08', recordType: 'Active', department: 'Cardiology', completeness: 95 },
  { uhid: 'UHID-1023', patient: 'Neha Patel', totalVisits: 5, lastVisit: '2025-03-05', recordType: 'Active', department: 'General Medicine', completeness: 88 },
  { uhid: 'UHID-1045', patient: 'Rajesh Kumar', totalVisits: 3, lastVisit: '2025-02-20', recordType: 'Active', department: 'Orthopedics', completeness: 100 },
  { uhid: 'UHID-1067', patient: 'Sunita Devi', totalVisits: 8, lastVisit: '2025-01-15', recordType: 'Archived', department: 'General Surgery', completeness: 92 },
  { uhid: 'UHID-1089', patient: 'Vikram Rathod', totalVisits: 2, lastVisit: '2024-12-10', recordType: 'Archived', department: 'Dermatology', completeness: 78 },
];

const RETENTION_POLICIES = [
  { recordType: 'OPD Records', retentionYears: 5, archiveAfter: '3 years', purgePolicy: 'After 5 years' },
  { recordType: 'IPD Records', retentionYears: 10, archiveAfter: '5 years', purgePolicy: 'After 10 years' },
  { recordType: 'Surgical Records', retentionYears: 15, archiveAfter: '7 years', purgePolicy: 'After 15 years' },
  { recordType: 'Lab Reports', retentionYears: 5, archiveAfter: '3 years', purgePolicy: 'After 5 years' },
  { recordType: 'Radiology Images', retentionYears: 7, archiveAfter: '5 years', purgePolicy: 'After 7 years' },
];

export default function AdminMRD() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'records' | 'retention' | 'audit'>('records');

  const filtered = RECORDS.filter(r =>
    search === '' || r.patient.toLowerCase().includes(search.toLowerCase()) || r.uhid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Medical Records Department</h1>
        <p className="text-sm text-muted-foreground">Patient record management, archival & compliance</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div><p className="text-2xl font-bold">4,521</p><p className="text-xs text-muted-foreground">Total Records</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-emerald-500" />
          <div><p className="text-2xl font-bold">3,892</p><p className="text-xs text-muted-foreground">Active</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Archive className="h-5 w-5 text-amber-500" />
          <div><p className="text-2xl font-bold">629</p><p className="text-xs text-muted-foreground">Archived</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-500" />
          <div><p className="text-2xl font-bold">91%</p><p className="text-xs text-muted-foreground">Completeness</p></div>
        </CardContent></Card>
      </div>

      <div className="flex gap-1 border-b pb-1">
        {(['records', 'retention', 'audit'] as const).map(t => (
          <Button key={t} size="sm" variant={tab === t ? 'default' : 'ghost'} onClick={() => setTab(t)}>
            {t === 'records' ? 'Patient Records' : t === 'retention' ? 'Retention Policies' : 'Access Audit'}
          </Button>
        ))}
      </div>

      {tab === 'records' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by patient name or UHID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                    <th className="p-3 font-medium">UHID</th>
                    <th className="p-3 font-medium">Patient</th>
                    <th className="p-3 font-medium">Total Visits</th>
                    <th className="p-3 font-medium">Last Visit</th>
                    <th className="p-3 font-medium">Department</th>
                    <th className="p-3 font-medium">Completeness</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.uhid} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs">{r.uhid}</td>
                      <td className="p-3 font-medium">{r.patient}</td>
                      <td className="p-3">{r.totalVisits}</td>
                      <td className="p-3 text-muted-foreground">{r.lastVisit}</td>
                      <td className="p-3">{r.department}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${r.completeness}%` }} />
                          </div>
                          <span className="text-xs">{r.completeness}%</span>
                        </div>
                      </td>
                      <td className="p-3"><Badge variant={r.recordType === 'Active' ? 'default' : 'secondary'}>{r.recordType}</Badge></td>
                      <td className="p-3"><Button size="sm" variant="ghost">View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

      {tab === 'retention' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Data Retention Policies</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Record Type</th>
                  <th className="pb-2 font-medium">Retention Period</th>
                  <th className="pb-2 font-medium">Archive After</th>
                  <th className="pb-2 font-medium">Purge Policy</th>
                </tr>
              </thead>
              <tbody>
                {RETENTION_POLICIES.map(p => (
                  <tr key={p.recordType} className="border-b last:border-0">
                    <td className="py-2 font-medium">{p.recordType}</td>
                    <td className="py-2">{p.retentionYears} years</td>
                    <td className="py-2">{p.archiveAfter}</td>
                    <td className="py-2 text-muted-foreground">{p.purgePolicy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {tab === 'audit' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Record Access</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { user: 'Dr. Mehta', action: 'Viewed medical record', patient: 'UHID-1001', time: '5 min ago' },
              { user: 'Nurse Anjali', action: 'Updated vitals', patient: 'UHID-1023', time: '12 min ago' },
              { user: 'Lab Tech Ramesh', action: 'Attached lab report', patient: 'UHID-1045', time: '25 min ago' },
              { user: 'Dr. Priya', action: 'Downloaded record', patient: 'UHID-1001', time: '1 hr ago' },
              { user: 'Reception', action: 'Created new record', patient: 'UHID-1150', time: '2 hr ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
                <div>
                  <span className="font-medium">{a.user}</span>
                  <span className="text-muted-foreground"> — {a.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{a.patient}</Badge>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
