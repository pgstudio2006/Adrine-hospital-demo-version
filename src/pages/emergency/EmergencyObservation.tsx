import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bed, Clock, Activity, ArrowRight, User } from 'lucide-react';

const observationBeds = [
  { bed: 'OBS-01', patient: 'Fatima Begum (67F)', caseId: 'ER-0887', doctor: 'Dr. Desai', admitTime: '10:00 AM', duration: '2h 15m', maxDuration: '6h', progress: 38, vitals: { bp: '145/90', hr: '88', spo2: '94%' }, status: 'Monitoring', notes: 'Bilateral crepts, O2 via nasal cannula' },
  { bed: 'OBS-02', patient: 'Anil Kapoor (44M)', caseId: 'ER-0883', doctor: 'Dr. Sharma', admitTime: '8:30 AM', duration: '3h 45m', maxDuration: '6h', progress: 63, vitals: { bp: '130/80', hr: '76', spo2: '98%' }, status: 'Stable', notes: 'Post-seizure observation, awaiting EEG' },
  { bed: 'OBS-03', patient: 'Meera Jain (25F)', caseId: 'ER-0881', doctor: 'Dr. Gupta', admitTime: '7:15 AM', duration: '5h 00m', maxDuration: '6h', progress: 83, vitals: { bp: '110/70', hr: '72', spo2: '99%' }, status: 'Ready for Discharge', notes: 'Allergic reaction resolved, no recurrence' },
  { bed: 'OBS-04', patient: null, caseId: null, doctor: null, admitTime: null, duration: null, maxDuration: null, progress: 0, vitals: null, status: 'Available', notes: null },
  { bed: 'OBS-05', patient: 'Ravi Tiwari (55M)', caseId: 'ER-0879', doctor: 'Dr. Patel', admitTime: '6:00 AM', duration: '6h 15m', maxDuration: '6h', progress: 100, vitals: { bp: '150/95', hr: '92', spo2: '95%' }, status: 'Overdue', notes: 'Hypertensive crisis, needs IPD decision' },
  { bed: 'OBS-06', patient: null, caseId: null, doctor: null, admitTime: null, duration: null, maxDuration: null, progress: 0, vitals: null, status: 'Available', notes: null },
];

const STATUS_BADGE: Record<string, 'destructive' | 'outline' | 'secondary' | 'default'> = {
  Monitoring: 'outline',
  Stable: 'secondary',
  'Ready for Discharge': 'default',
  Overdue: 'destructive',
  Available: 'secondary',
};

export default function EmergencyObservation() {
  const occupied = observationBeds.filter(b => b.patient).length;
  const available = observationBeds.filter(b => !b.patient).length;
  const overdue = observationBeds.filter(b => b.status === 'Overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Observation Unit</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor patients under ER observation</p>
        </div>
        <Button className="gap-2"><Bed className="w-4 h-4" />Assign Bed</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-2xl font-bold text-foreground">{occupied}</p><p className="text-xs text-muted-foreground">Occupied Beds</p></Card>
        <Card className="p-4"><p className="text-2xl font-bold text-foreground">{available}</p><p className="text-xs text-muted-foreground">Available Beds</p></Card>
        <Card className={`p-4 ${overdue > 0 ? 'border-destructive/30' : ''}`}><p className="text-2xl font-bold text-foreground">{overdue}</p><p className="text-xs text-muted-foreground">{'Overdue (>6h)'}</p></Card>
      </div>

      {/* Bed Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {observationBeds.map((b) => (
          <Card key={b.bed} className={`p-4 ${!b.patient ? 'border-dashed opacity-60' : b.status === 'Overdue' ? 'border-destructive/40' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm font-semibold text-foreground">{b.bed}</span>
              </div>
              <Badge variant={STATUS_BADGE[b.status]} className="text-[10px]">{b.status}</Badge>
            </div>

            {b.patient ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.patient}</p>
                  <p className="text-xs text-muted-foreground">{b.caseId} · {b.doctor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{b.notes}</p>
                </div>

                {/* Vitals */}
                <div className="flex gap-4 text-xs">
                  {b.vitals && Object.entries(b.vitals).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-muted-foreground uppercase text-[10px]">{k}</span>
                      <p className="font-medium text-foreground">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Duration Progress */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.duration} / {b.maxDuration}</span>
                    <span>{b.progress}%</span>
                  </div>
                  <Progress value={b.progress} className={`h-1.5 ${b.progress >= 100 ? '[&>div]:bg-destructive' : ''}`} />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs flex-1">Record Vitals</Button>
                  {b.status === 'Ready for Discharge' && <Button size="sm" className="text-xs flex-1">Discharge</Button>}
                  {b.status === 'Overdue' && <Button size="sm" variant="destructive" className="text-xs flex-1">Escalate</Button>}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-6 text-muted-foreground text-sm">
                <User className="w-4 h-4 mr-2" /> Bed Available
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}