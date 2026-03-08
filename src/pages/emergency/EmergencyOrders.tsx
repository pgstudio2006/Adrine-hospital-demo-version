import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskConical, ScanLine, Pill, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const orders = [
  { id: 'ORD-4521', caseId: 'ER-0891', patient: 'Unknown Male (~45y)', type: 'Lab', item: 'Troponin I, CBC, BMP, PT/INR', priority: 'STAT', status: 'Pending', time: '10:48 AM', dept: 'Laboratory' },
  { id: 'ORD-4522', caseId: 'ER-0891', patient: 'Unknown Male (~45y)', type: 'Radiology', item: 'Chest X-Ray AP', priority: 'STAT', status: 'In Progress', time: '10:49 AM', dept: 'Radiology' },
  { id: 'ORD-4523', caseId: 'ER-0889', patient: 'Rajesh Kumar', type: 'Radiology', item: 'CT Head (Non-contrast)', priority: 'STAT', status: 'Completed', time: '10:22 AM', dept: 'Radiology' },
  { id: 'ORD-4524', caseId: 'ER-0889', patient: 'Rajesh Kumar', type: 'Radiology', item: 'X-Ray Right Leg AP/Lateral', priority: 'Urgent', status: 'In Progress', time: '10:25 AM', dept: 'Radiology' },
  { id: 'ORD-4525', caseId: 'ER-0889', patient: 'Rajesh Kumar', type: 'Lab', item: 'Cross-match 2 units PRBCs', priority: 'STAT', status: 'Completed', time: '10:23 AM', dept: 'Blood Bank' },
  { id: 'ORD-4526', caseId: 'ER-0887', patient: 'Fatima Begum', type: 'Lab', item: 'ABG, BNP, D-Dimer', priority: 'Urgent', status: 'Pending', time: '9:55 AM', dept: 'Laboratory' },
  { id: 'ORD-4527', caseId: 'ER-0884', patient: 'Vikram Singh', type: 'Pharmacy', item: 'Tetanus Toxoid, Local Anesthesia', priority: 'Routine', status: 'Dispensed', time: '9:30 AM', dept: 'Pharmacy' },
];

const TYPE_ICONS: Record<string, React.ElementType> = { Lab: FlaskConical, Radiology: ScanLine, Pharmacy: Pill };
const STATUS_STYLE: Record<string, string> = {
  Pending: 'bg-warning/10 text-warning',
  'In Progress': 'bg-info/10 text-info',
  Completed: 'bg-success/10 text-success',
  Dispensed: 'bg-success/10 text-success',
};

export default function EmergencyOrders() {
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? orders : orders.filter(o => o.type === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Emergency Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Lab, radiology, and pharmacy orders for ER cases</p>
        </div>
        <Button className="gap-2">New Order</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: orders.length, icon: AlertTriangle },
          { label: 'STAT Pending', value: orders.filter(o => o.priority === 'STAT' && o.status === 'Pending').length, icon: Clock },
          { label: 'Completed', value: orders.filter(o => ['Completed', 'Dispensed'].includes(o.status)).length, icon: CheckCircle },
          { label: 'In Progress', value: orders.filter(o => o.status === 'In Progress').length, icon: FlaskConical },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <s.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="Lab">Lab ({orders.filter(o => o.type === 'Lab').length})</TabsTrigger>
          <TabsTrigger value="Radiology">Radiology ({orders.filter(o => o.type === 'Radiology').length})</TabsTrigger>
          <TabsTrigger value="Pharmacy">Pharmacy ({orders.filter(o => o.type === 'Pharmacy').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.map((o) => {
            const Icon = TYPE_ICONS[o.type] || FlaskConical;
            return (
              <Card key={o.id} className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center mt-0.5">
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                        <Badge variant={o.priority === 'STAT' ? 'destructive' : 'outline'} className="text-[10px]">{o.priority}</Badge>
                        <Badge className={`text-[10px] ${STATUS_STYLE[o.status] || ''}`}>{o.status}</Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground">{o.item}</p>
                      <p className="text-xs text-muted-foreground">{o.caseId} · {o.patient} · {o.dept}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{o.time}</span>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}