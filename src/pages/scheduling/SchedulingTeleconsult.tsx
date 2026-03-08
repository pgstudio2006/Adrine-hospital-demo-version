import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Video, Clock, Link, Plus, CheckCircle, Phone } from 'lucide-react';

const sessions = [
  { id: 'TC-001', patient: 'Fatima Begum', uhid: 'UHID-10456', doctor: 'Dr. Sharma', dept: 'General Medicine', date: '2024-03-08', time: '11:30 AM', duration: '15 min', status: 'Scheduled', link: 'https://meet.adrine.in/tc-001' },
  { id: 'TC-002', patient: 'Rohit Kapoor', uhid: 'UHID-10789', doctor: 'Dr. Rajesh Kumar', dept: 'Cardiology', date: '2024-03-08', time: '12:00 PM', duration: '20 min', status: 'In Progress', link: 'https://meet.adrine.in/tc-002' },
  { id: 'TC-003', patient: 'Kavita Nair', uhid: 'UHID-11001', doctor: 'Dr. Patel', dept: 'Dermatology', date: '2024-03-08', time: '2:00 PM', duration: '15 min', status: 'Scheduled', link: 'https://meet.adrine.in/tc-003' },
  { id: 'TC-004', patient: 'Suresh Yadav', uhid: 'UHID-10223', doctor: 'Dr. Gupta', dept: 'ENT', date: '2024-03-08', time: '9:30 AM', duration: '15 min', status: 'Completed', link: null },
  { id: 'TC-005', patient: 'Neha Patel', uhid: 'UHID-10334', doctor: 'Dr. Ananya Mishra', dept: 'Cardiology', date: '2024-03-08', time: '10:00 AM', duration: '20 min', status: 'Completed', link: null },
  { id: 'TC-006', patient: 'Anil Joshi', uhid: 'UHID-10890', doctor: 'Dr. Sharma', dept: 'General Medicine', date: '2024-03-09', time: '10:00 AM', duration: '15 min', status: 'Scheduled', link: 'https://meet.adrine.in/tc-006' },
];

const STATUS_STYLE: Record<string, string> = {
  Scheduled: 'bg-info/10 text-info',
  'In Progress': 'bg-success/10 text-success',
  Completed: 'bg-muted text-muted-foreground',
  Cancelled: 'bg-destructive/10 text-destructive',
};

export default function SchedulingTeleconsult() {
  const today = sessions.filter(s => s.date === '2024-03-08');
  const inProgress = sessions.filter(s => s.status === 'In Progress').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Teleconsultation</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule and manage remote consultation sessions</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />Schedule Teleconsult</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4"><Monitor className="w-4 h-4 text-muted-foreground mb-2" /><p className="text-xl font-bold text-foreground">{today.length}</p><p className="text-xs text-muted-foreground">Today's Sessions</p></Card>
        <Card className="p-4 border-success/30"><Video className="w-4 h-4 text-success mb-2" /><p className="text-xl font-bold text-foreground">{inProgress}</p><p className="text-xs text-muted-foreground">In Progress</p></Card>
        <Card className="p-4"><CheckCircle className="w-4 h-4 text-muted-foreground mb-2" /><p className="text-xl font-bold text-foreground">{sessions.filter(s => s.status === 'Completed').length}</p><p className="text-xs text-muted-foreground">Completed Today</p></Card>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {['today', 'upcoming', 'completed'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {sessions
              .filter(s => {
                if (tab === 'today') return s.date === '2024-03-08' && s.status !== 'Completed';
                if (tab === 'upcoming') return s.date !== '2024-03-08' && s.status === 'Scheduled';
                return s.status === 'Completed';
              })
              .map(s => (
                <Card key={s.id} className={`p-4 hover:shadow-sm transition-shadow ${s.status === 'In Progress' ? 'border-success/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        {s.status === 'In Progress' ? <Video className="w-5 h-5 text-success animate-pulse" /> : <Monitor className="w-5 h-5 text-foreground" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{s.id}</span>
                          <Badge className={`text-[10px] ${STATUS_STYLE[s.status]}`}>{s.status}</Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">{s.patient} <span className="text-muted-foreground font-normal">· {s.uhid}</span></p>
                        <p className="text-xs text-muted-foreground">{s.doctor} · {s.dept}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.date} at {s.time}</span>
                          <span>Duration: {s.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {s.status === 'In Progress' && <Button size="sm" className="text-xs gap-1 bg-success hover:bg-success/90 text-success-foreground"><Video className="w-3 h-3" />Join</Button>}
                      {s.status === 'Scheduled' && s.link && (
                        <Button size="sm" variant="outline" className="text-xs gap-1"><Link className="w-3 h-3" />Copy Link</Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}