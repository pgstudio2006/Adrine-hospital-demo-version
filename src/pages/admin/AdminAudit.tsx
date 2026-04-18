import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Shield, AlertTriangle, Eye, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useHospital } from '@/stores/hospitalStore';

const AUDIT_LOGS = [
  { id: 'LOG001', timestamp: '2025-03-08 14:32:15', user: 'Dr. Rajesh Mehta', userId: 'S001', action: 'View Patient Record', module: 'Doctor', target: 'UHID-1001', ip: '192.168.1.45', device: 'Chrome / Windows', severity: 'info' },
  { id: 'LOG002', timestamp: '2025-03-08 14:28:10', user: 'Kavita Joshi', userId: 'S008', action: 'Generate Invoice', module: 'Billing', target: 'INV-2024-091', ip: '192.168.1.52', device: 'Chrome / Windows', severity: 'info' },
  { id: 'LOG003', timestamp: '2025-03-08 14:25:00', user: 'Admin', userId: 'A001', action: 'Modify User Role', module: 'Admin', target: 'User S005', ip: '192.168.1.10', device: 'Firefox / Mac', severity: 'warning' },
  { id: 'LOG004', timestamp: '2025-03-08 14:20:45', user: 'Unknown', userId: '', action: 'Failed Login Attempt', module: 'Auth', target: 'admin@hospital.com', ip: '45.23.156.78', device: 'Unknown', severity: 'critical' },
  { id: 'LOG005', timestamp: '2025-03-08 14:15:30', user: 'Nurse Anjali', userId: 'S003', action: 'Update Patient Vitals', module: 'Nurse', target: 'UHID-1023', ip: '192.168.1.48', device: 'Chrome / iPad', severity: 'info' },
  { id: 'LOG006', timestamp: '2025-03-08 14:10:20', user: 'Kavita Joshi', userId: 'S008', action: 'Apply Discount >10%', module: 'Billing', target: 'INV-2024-089', ip: '192.168.1.52', device: 'Chrome / Windows', severity: 'warning' },
  { id: 'LOG007', timestamp: '2025-03-08 14:05:12', user: 'Lab Tech Ramesh', userId: 'S004', action: 'Validate Lab Report', module: 'Lab', target: 'LR-2024-567', ip: '192.168.1.55', device: 'Chrome / Windows', severity: 'info' },
  { id: 'LOG008', timestamp: '2025-03-08 14:00:00', user: 'Dr. Priya Sharma', userId: 'S002', action: 'Export Patient Records', module: 'Doctor', target: 'Bulk Export (15 records)', ip: '192.168.1.46', device: 'Chrome / Mac', severity: 'warning' },
];

export default function AdminAudit() {
  const { workflowEvents } = useHospital();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const combinedLogs = useMemo(() => {
    const liveLogs = workflowEvents.map(event => {
      const severity =
        /critical|icu|mlc|emergency/.test(`${event.action} ${event.details}`.toLowerCase())
          ? 'critical'
          : /warning|overdue|partial/.test(`${event.action} ${event.details}`.toLowerCase())
            ? 'warning'
            : 'info';

      return {
        id: event.id,
        timestamp: event.timestamp,
        user: `${event.module.toUpperCase()} Service`,
        userId: event.module,
        action: event.action.replaceAll('_', ' '),
        module: event.module.charAt(0).toUpperCase() + event.module.slice(1),
        target: event.refId || event.uhid || 'System event',
        ip: 'internal-bus',
        device: 'Workflow Engine',
        severity,
      };
    });

    return [...liveLogs, ...AUDIT_LOGS];
  }, [workflowEvents]);

  const filtered = combinedLogs.filter(l =>
    (search === '' || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase())) &&
    (moduleFilter === 'all' || l.module === moduleFilter) &&
    (severityFilter === 'all' || l.severity === severityFilter)
  );

  const warningCount = combinedLogs.filter(item => item.severity === 'warning').length;
  const criticalCount = combinedLogs.filter(item => item.severity === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-sm text-muted-foreground">System-wide activity logging & security monitoring</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export Logs</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Eye className="h-5 w-5 text-primary" />
          <div><p className="text-2xl font-bold">{combinedLogs.length.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">Tracked Workflow Actions</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div><p className="text-2xl font-bold">{warningCount}</p><p className="text-xs text-muted-foreground">Warnings</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-destructive" />
          <div><p className="text-2xl font-bold">{criticalCount}</p><p className="text-xs text-muted-foreground">Critical Alerts</p></div>
        </CardContent></Card>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by user or action..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {Array.from(new Set(combinedLogs.map(log => log.module))).sort((left, right) => left.localeCompare(right)).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="p-3 font-medium">Timestamp</th>
                <th className="p-3 font-medium">User</th>
                <th className="p-3 font-medium">Action</th>
                <th className="p-3 font-medium">Module</th>
                <th className="p-3 font-medium">Target</th>
                <th className="p-3 font-medium">IP Address</th>
                <th className="p-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className={`border-b last:border-0 hover:bg-muted/30 ${l.severity === 'critical' ? 'bg-destructive/5' : l.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                  <td className="p-3 font-mono text-xs">{l.timestamp}</td>
                  <td className="p-3">
                    <div className="font-medium">{l.user}</div>
                    {l.userId && <div className="text-xs text-muted-foreground">{l.userId}</div>}
                  </td>
                  <td className="p-3">{l.action}</td>
                  <td className="p-3"><Badge variant="outline">{l.module}</Badge></td>
                  <td className="p-3 text-muted-foreground">{l.target}</td>
                  <td className="p-3 font-mono text-xs">{l.ip}</td>
                  <td className="p-3">
                    <Badge variant={l.severity === 'critical' ? 'destructive' : l.severity === 'warning' ? 'secondary' : 'outline'}>
                      {l.severity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
