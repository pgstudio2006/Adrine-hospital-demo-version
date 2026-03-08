import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
];

const doctors = ['Dr. Rajesh Kumar', 'Dr. Ananya Mishra', 'Dr. Vikram Singh', 'Dr. Sharma', 'Dr. Gupta'];

type SlotStatus = 'booked' | 'available' | 'blocked' | 'break';

const generateSlots = (): Record<string, Record<string, { status: SlotStatus; patient?: string }>> => {
  const data: Record<string, Record<string, { status: SlotStatus; patient?: string }>> = {};
  doctors.forEach(doc => {
    data[doc] = {};
    timeSlots.forEach(slot => {
      const rand = Math.random();
      if (slot === '12:00 PM' || slot === '12:30 PM') {
        data[doc][slot] = { status: 'break' };
      } else if (rand < 0.5) {
        data[doc][slot] = { status: 'booked', patient: ['Amit Shah', 'Priya Patel', 'Rajesh T.', 'Sunita V.', 'Fatima B.'][Math.floor(Math.random() * 5)] };
      } else if (rand < 0.85) {
        data[doc][slot] = { status: 'available' };
      } else {
        data[doc][slot] = { status: 'blocked' };
      }
    });
  });
  return data;
};

const SLOT_STYLE: Record<SlotStatus, string> = {
  booked: 'bg-foreground/10 text-foreground border-border',
  available: 'bg-success/10 text-success border-success/30 cursor-pointer hover:bg-success/20',
  blocked: 'bg-muted text-muted-foreground border-border opacity-50',
  break: 'bg-warning/5 text-warning/50 border-warning/20',
};

const weekDays = ['Mon 4', 'Tue 5', 'Wed 6', 'Thu 7', 'Fri 8', 'Sat 9'];

export default function SchedulingCalendar() {
  const [view, setView] = useState<'doctor' | 'day'>('doctor');
  const [slotData] = useState(generateSlots);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendar View</h1>
          <p className="text-sm text-muted-foreground mt-1">Visual schedule overview across doctors and time slots</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm font-medium text-foreground px-3">March 4 – 9, 2024</span>
          <Button variant="outline" size="icon"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* View Toggle & Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={view === 'doctor' ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => setView('doctor')}>By Doctor</Button>
          <Button variant={view === 'day' ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => setView('day')}>By Day</Button>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/20 border border-success/30" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-foreground/10 border border-border" /> Booked</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted border border-border opacity-50" /> Blocked</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning/10 border border-warning/20" /> Break</span>
        </div>
      </div>

      {/* Doctor View - Time Grid */}
      {view === 'doctor' && (
        <Card className="p-0 overflow-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-[140px_repeat(13,1fr)] border-b border-border">
              <div className="p-2 text-xs font-semibold text-muted-foreground border-r border-border">Doctor</div>
              {timeSlots.map(t => (
                <div key={t} className="p-2 text-[10px] text-center text-muted-foreground border-r border-border last:border-r-0">{t}</div>
              ))}
            </div>
            {/* Rows */}
            {doctors.map(doc => (
              <div key={doc} className="grid grid-cols-[140px_repeat(13,1fr)] border-b border-border last:border-b-0">
                <div className="p-2 text-xs font-medium text-foreground border-r border-border flex items-center">{doc}</div>
                {timeSlots.map(slot => {
                  const s = slotData[doc]?.[slot] || { status: 'available' as SlotStatus };
                  return (
                    <div key={slot} className={`p-1 border-r border-border last:border-r-0 flex items-center justify-center`}>
                      <div className={`w-full h-8 rounded text-[9px] flex items-center justify-center border ${SLOT_STYLE[s.status]}`}>
                        {s.status === 'booked' ? s.patient : s.status === 'break' ? 'Break' : s.status === 'blocked' ? '✕' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Day View - Week Grid */}
      {view === 'day' && (
        <Card className="p-4">
          <div className="grid grid-cols-6 gap-3">
            {weekDays.map(day => (
              <div key={day}>
                <p className="text-xs font-semibold text-foreground text-center mb-2">{day}</p>
                <div className="space-y-1">
                  {timeSlots.slice(0, 8).map(slot => {
                    const rand = Math.random();
                    const status: SlotStatus = rand < 0.4 ? 'booked' : rand < 0.8 ? 'available' : 'blocked';
                    return (
                      <div key={slot} className={`text-[9px] p-1.5 rounded border text-center ${SLOT_STYLE[status]}`}>
                        {slot}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}