import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

interface ScheduleSlot {
  id: string;
  day: number;
  startHour: number;
  duration: number; // in hours
  type: 'opd' | 'ipd-rounds' | 'surgery' | 'break' | 'meeting';
  title: string;
  location?: string;
  patients?: number;
}

const weekSchedule: ScheduleSlot[] = [
  { id: '1', day: 0, startHour: 9, duration: 3, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 18 },
  { id: '2', day: 0, startHour: 13, duration: 1, type: 'break', title: 'Lunch Break' },
  { id: '3', day: 0, startHour: 14, duration: 2, type: 'ipd-rounds', title: 'IPD Rounds', location: 'Ward 3A', patients: 6 },
  { id: '4', day: 0, startHour: 16, duration: 1, type: 'meeting', title: 'Department Meeting', location: 'Conference Room' },
  { id: '5', day: 1, startHour: 9, duration: 2, type: 'surgery', title: 'Scheduled Surgery', location: 'OT-2' },
  { id: '6', day: 1, startHour: 11, duration: 2, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 12 },
  { id: '7', day: 1, startHour: 13, duration: 1, type: 'break', title: 'Lunch Break' },
  { id: '8', day: 1, startHour: 14, duration: 3, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 15 },
  { id: '9', day: 2, startHour: 9, duration: 3, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 20 },
  { id: '10', day: 2, startHour: 13, duration: 1, type: 'break', title: 'Lunch Break' },
  { id: '11', day: 2, startHour: 14, duration: 2, type: 'ipd-rounds', title: 'IPD Rounds', location: 'Ward 3A', patients: 8 },
  { id: '12', day: 2, startHour: 16, duration: 1, type: 'meeting', title: 'CME Session', location: 'Auditorium' },
  { id: '13', day: 3, startHour: 9, duration: 4, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 24 },
  { id: '14', day: 3, startHour: 13, duration: 1, type: 'break', title: 'Lunch Break' },
  { id: '15', day: 3, startHour: 14, duration: 2, type: 'ipd-rounds', title: 'IPD Rounds', location: 'Ward 3A', patients: 5 },
  { id: '16', day: 4, startHour: 9, duration: 2, type: 'surgery', title: 'Scheduled Surgery', location: 'OT-1' },
  { id: '17', day: 4, startHour: 11, duration: 2, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 10 },
  { id: '18', day: 4, startHour: 13, duration: 1, type: 'break', title: 'Lunch Break' },
  { id: '19', day: 4, startHour: 14, duration: 3, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 16 },
  { id: '20', day: 5, startHour: 9, duration: 3, type: 'opd', title: 'OPD Consultation', location: 'Room 204', patients: 14 },
  { id: '21', day: 5, startHour: 12, duration: 1, type: 'ipd-rounds', title: 'IPD Rounds', location: 'Ward 3A', patients: 4 },
];

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  opd: { bg: 'bg-foreground/5', border: 'border-foreground/20', text: 'text-foreground' },
  'ipd-rounds': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-700' },
  surgery: { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive' },
  break: { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground' },
  meeting: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-700' },
};

const weekSummary = [
  { label: 'OPD Slots', value: '6', sub: '~129 patients' },
  { label: 'Surgeries', value: '2', sub: 'Tue & Fri' },
  { label: 'IPD Rounds', value: '4', sub: '~23 patients' },
  { label: 'Meetings', value: '2', sub: 'Mon & Wed' },
];

export default function DoctorSchedule() {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const dateLabels = days.map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  });

  const isToday = (dayIdx: number) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + dayIdx);
    return d.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weekly Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your clinic hours and rounds</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <button onClick={() => setWeekOffset(0)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
            This Week
          </button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" className="gap-1.5 ml-2">
            <Plus className="w-3.5 h-3.5" /> Add Slot
          </Button>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div {...fadeIn(1)} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {weekSummary.map(s => (
          <div key={s.label} className="border rounded-xl p-4 bg-card">
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Calendar Grid */}
      <motion.div {...fadeIn(2)} className="border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Day Headers */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
              <div className="p-2" />
              {days.map((day, i) => (
                <div key={day} className={`p-3 text-center border-l ${isToday(i) ? 'bg-foreground/5' : ''}`}>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{day.slice(0, 3)}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${isToday(i) ? 'text-foreground' : 'text-muted-foreground'}`}>{dateLabels[i]}</p>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            {hours.map((hour, hIdx) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b last:border-b-0">
                <div className="p-2 text-[11px] text-muted-foreground font-mono text-right pr-3 pt-3">
                  {hour}
                </div>
                {days.map((_, dayIdx) => {
                  const slot = weekSchedule.find(s => s.day === dayIdx && s.startHour === hIdx + 9);
                  const isCovered = weekSchedule.find(s => s.day === dayIdx && s.startHour < hIdx + 9 && s.startHour + s.duration > hIdx + 9);

                  if (isCovered) return <div key={dayIdx} className="border-l" />;

                  if (slot) {
                    const colors = typeColors[slot.type];
                    return (
                      <div
                        key={dayIdx}
                        className={`border-l p-1.5 ${isToday(dayIdx) ? 'bg-foreground/[0.02]' : ''}`}
                        style={{ gridRow: `span ${slot.duration}` }}
                      >
                        <div className={`${colors.bg} border ${colors.border} rounded-lg p-2 h-full cursor-pointer hover:shadow-sm transition-shadow`}>
                          <p className={`text-[11px] font-semibold ${colors.text} truncate`}>{slot.title}</p>
                          {slot.location && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" /> {slot.location}
                            </p>
                          )}
                          {slot.patients && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                              <User className="w-2.5 h-2.5" /> {slot.patients} patients
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={dayIdx} className={`border-l min-h-[60px] ${isToday(dayIdx) ? 'bg-foreground/[0.02]' : ''}`} />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div {...fadeIn(3)} className="flex items-center gap-4 text-[11px] text-muted-foreground">
        {Object.entries(typeColors).map(([key, colors]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${colors.bg} border ${colors.border}`} />
            {key === 'ipd-rounds' ? 'IPD Rounds' : key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
