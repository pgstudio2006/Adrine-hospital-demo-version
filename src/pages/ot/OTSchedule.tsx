import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CalendarDays, Plus, Search, Filter, Clock, User, 
  Scissors, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

type Priority = 'elective' | 'urgent' | 'emergency';
type SurgeryStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface Surgery {
  id: string;
  time: string;
  endTime: string;
  surgery: string;
  patient: string;
  uhid: string;
  surgeon: string;
  room: string;
  priority: Priority;
  status: SurgeryStatus;
  anesthesia: string;
  duration: string;
}

const SURGERIES: Surgery[] = [
  { id: 'S-001', time: '08:00', endTime: '10:00', surgery: 'Laparoscopic Cholecystectomy', patient: 'Ramesh Patel', uhid: 'P-1024', surgeon: 'Dr. Mehta', room: 'OT-1', priority: 'elective', status: 'completed', anesthesia: 'General', duration: '2h' },
  { id: 'S-002', time: '08:30', endTime: '11:30', surgery: 'Hysterectomy', patient: 'Kanta Desai', uhid: 'P-1089', surgeon: 'Dr. Joshi', room: 'OT-3', priority: 'elective', status: 'completed', anesthesia: 'Spinal', duration: '3h' },
  { id: 'S-003', time: '09:30', endTime: '11:00', surgery: 'Wound Debridement', patient: 'Suresh Bhatt', uhid: 'P-2103', surgeon: 'Dr. Trivedi', room: 'OT-4', priority: 'urgent', status: 'completed', anesthesia: 'Local', duration: '1.5h' },
  { id: 'S-004', time: '10:00', endTime: '12:30', surgery: 'Total Knee Replacement', patient: 'Anilaben Joshi', uhid: 'P-2081', surgeon: 'Dr. Shah', room: 'OT-2', priority: 'elective', status: 'in_progress', anesthesia: 'Spinal', duration: '2.5h' },
  { id: 'S-005', time: '11:00', endTime: '12:00', surgery: 'Appendectomy', patient: 'Vishal Parmar', uhid: 'P-3011', surgeon: 'Dr. Mehta', room: 'OT-1', priority: 'emergency', status: 'scheduled', anesthesia: 'General', duration: '1h' },
  { id: 'S-006', time: '13:30', endTime: '14:30', surgery: 'Cataract Surgery', patient: 'Induben Shah', uhid: 'P-1567', surgeon: 'Dr. Desai', room: 'OT-4', priority: 'elective', status: 'scheduled', anesthesia: 'Local', duration: '1h' },
  { id: 'S-007', time: '14:00', endTime: '18:00', surgery: 'CABG', patient: 'Harishbhai Modi', uhid: 'P-0892', surgeon: 'Dr. Kapoor', room: 'OT-3', priority: 'elective', status: 'confirmed', anesthesia: 'General', duration: '4h' },
  { id: 'S-008', time: '15:00', endTime: '17:00', surgery: 'Fracture Fixation (ORIF)', patient: 'Dinesh Rana', uhid: 'P-3245', surgeon: 'Dr. Shah', room: 'OT-2', priority: 'emergency', status: 'scheduled', anesthesia: 'General', duration: '2h' },
];

const OT_ROOMS = ['All Rooms', 'OT-1', 'OT-2', 'OT-3', 'OT-4'];

const PRIORITY_CONFIG: Record<Priority, { label: string; class: string }> = {
  elective: { label: 'Elective', class: 'bg-muted text-muted-foreground' },
  urgent: { label: 'Urgent', class: 'bg-warning/10 text-warning border-warning/20' },
  emergency: { label: 'Emergency', class: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const STATUS_CONFIG: Record<SurgeryStatus, { label: string; class: string }> = {
  scheduled: { label: 'Scheduled', class: 'bg-info/10 text-info border-info/20' },
  confirmed: { label: 'Confirmed', class: 'bg-success/10 text-success border-success/20' },
  in_progress: { label: 'In Progress', class: 'bg-warning/10 text-warning border-warning/20' },
  completed: { label: 'Completed', class: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'Cancelled', class: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function OTSchedule() {
  const [search, setSearch] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('All Rooms');
  const [view, setView] = useState<'timeline' | 'list'>('timeline');

  const filtered = SURGERIES.filter(s => {
    const matchSearch = s.surgery.toLowerCase().includes(search.toLowerCase()) || s.patient.toLowerCase().includes(search.toLowerCase());
    const matchRoom = selectedRoom === 'All Rooms' || s.room === selectedRoom;
    return matchSearch && matchRoom;
  });

  const rooms = ['OT-1', 'OT-2', 'OT-3', 'OT-4'];

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Surgery Schedule</h1>
          <p className="text-sm text-muted-foreground">Today — 8 Mar 2026 • 8 surgeries scheduled</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
            <CalendarDays className="h-3.5 w-3.5" /> Today
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Schedule Surgery
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search surgery or patient..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <div className="flex gap-1 bg-muted p-0.5 rounded-lg">
          {OT_ROOMS.map(r => (
            <button key={r} onClick={() => setSelectedRoom(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${selectedRoom === r ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-0.5 bg-muted p-0.5 rounded-lg">
          <button onClick={() => setView('timeline')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'timeline' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>Timeline</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>List</button>
        </div>
      </motion.div>

      {view === 'timeline' ? (
        <motion.div variants={item}>
          <Card className="border-border/60 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Time header */}
                  <div className="flex border-b border-border/60">
                    <div className="w-24 shrink-0 p-3 text-xs font-medium text-muted-foreground border-r border-border/40">Room</div>
                    <div className="flex-1 flex">
                      {HOURS.map(h => (
                        <div key={h} className="flex-1 p-3 text-xs font-mono text-muted-foreground text-center border-r border-border/20 last:border-0">
                          {h > 12 ? `${h - 12}PM` : h === 12 ? '12PM' : `${h}AM`}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Room rows */}
                  {rooms.filter(r => selectedRoom === 'All Rooms' || r === selectedRoom).map(room => {
                    const roomSurgeries = SURGERIES.filter(s => s.room === room);
                    return (
                      <div key={room} className="flex border-b border-border/40 last:border-0 min-h-[72px]">
                        <div className="w-24 shrink-0 p-3 flex items-center border-r border-border/40">
                          <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
                            {room}
                          </div>
                        </div>
                        <div className="flex-1 relative py-2">
                          {roomSurgeries.map(s => {
                            const [sh, sm] = s.time.split(':').map(Number);
                            const [eh, em] = s.endTime.split(':').map(Number);
                            const startMin = (sh - 7) * 60 + sm;
                            const endMin = (eh - 7) * 60 + em;
                            const totalMin = 12 * 60;
                            const left = `${(startMin / totalMin) * 100}%`;
                            const width = `${((endMin - startMin) / totalMin) * 100}%`;
                            const bgColor = s.status === 'completed' ? 'bg-muted' 
                              : s.status === 'in_progress' ? 'bg-success/15 border-success/30' 
                              : s.priority === 'emergency' ? 'bg-destructive/10 border-destructive/30'
                              : 'bg-info/10 border-info/30';
                            return (
                              <div key={s.id} className={`absolute top-2 bottom-2 rounded-md border px-2 py-1 cursor-pointer hover:shadow-sm transition-shadow overflow-hidden ${bgColor}`}
                                style={{ left, width, minWidth: '80px' }}>
                                <p className="text-[10px] font-semibold truncate">{s.surgery}</p>
                                <p className="text-[9px] text-muted-foreground truncate">{s.surgeon} • {s.duration}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-2">
          {filtered.map(s => (
            <Card key={s.id} className="border-border/60 hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-5">
                <div className="w-16 text-center shrink-0">
                  <p className="text-lg font-mono font-bold">{s.time}</p>
                  <p className="text-[10px] text-muted-foreground">{s.duration}</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <p className="text-sm font-semibold truncate">{s.surgery}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.patient} ({s.uhid}) • {s.anesthesia} anesthesia</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{s.surgeon}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{s.room}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge className={`${PRIORITY_CONFIG[s.priority].class} text-[10px]`}>{PRIORITY_CONFIG[s.priority].label}</Badge>
                  <Badge className={`${STATUS_CONFIG[s.status].class} text-[10px]`}>{STATUS_CONFIG[s.status].label}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
