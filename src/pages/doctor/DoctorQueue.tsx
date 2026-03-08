import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Play, SkipForward, X, ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface QueuePatient {
  token: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  type: 'New' | 'Follow-up' | 'Emergency';
  time: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'skipped';
  complaint: string;
}

const queueData: QueuePatient[] = [
  { token: 'T-041', name: 'Ramesh Yadav', age: 52, gender: 'M', type: 'Follow-up', time: '09:30 AM', status: 'completed', complaint: 'Diabetes review, HbA1c follow-up' },
  { token: 'T-042', name: 'Meera Joshi', age: 34, gender: 'F', type: 'New', time: '09:45 AM', status: 'completed', complaint: 'Persistent cough for 2 weeks, mild fever' },
  { token: 'T-043', name: 'Priya Sharma', age: 32, gender: 'F', type: 'Follow-up', time: '10:00 AM', status: 'in-consultation', complaint: 'Thyroid medication review, fatigue' },
  { token: 'T-044', name: 'Vikram Malhotra', age: 48, gender: 'M', type: 'Emergency', time: '10:15 AM', status: 'waiting', complaint: 'Severe chest pain, radiating to left arm' },
  { token: 'T-045', name: 'Rajesh Kumar', age: 45, gender: 'M', type: 'Follow-up', time: '10:30 AM', status: 'waiting', complaint: 'Blood sugar monitoring, medication adjustment' },
  { token: 'T-046', name: 'Ananya Das', age: 27, gender: 'F', type: 'New', time: '10:45 AM', status: 'waiting', complaint: 'Recurring headaches, dizziness' },
  { token: 'T-047', name: 'Suresh Pillai', age: 61, gender: 'M', type: 'Follow-up', time: '11:00 AM', status: 'waiting', complaint: 'COPD management, inhaler review' },
  { token: 'T-048', name: 'Geeta Kapoor', age: 55, gender: 'F', type: 'Follow-up', time: '11:15 AM', status: 'waiting', complaint: 'Knee pain, physiotherapy progress' },
];

const statusStyle: Record<string, string> = {
  waiting: 'bg-amber-500/10 text-amber-600',
  'in-consultation': 'bg-emerald-500/10 text-emerald-600',
  completed: 'bg-muted text-muted-foreground',
  skipped: 'bg-destructive/10 text-destructive',
};

const typeStyle: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-600',
  'Follow-up': 'bg-muted text-muted-foreground',
  Emergency: 'bg-destructive/10 text-destructive',
};

export default function DoctorQueue() {
  const [queue, setQueue] = useState(queueData);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const waiting = queue.filter(q => q.status === 'waiting').length;
  const completed = queue.filter(q => q.status === 'completed').length;
  const current = queue.find(q => q.status === 'in-consultation');

  const handleNext = () => {
    setQueue(prev => {
      const updated = [...prev];
      const currentIdx = updated.findIndex(q => q.status === 'in-consultation');
      if (currentIdx >= 0) updated[currentIdx].status = 'completed';
      const nextIdx = updated.findIndex(q => q.status === 'waiting');
      if (nextIdx >= 0) updated[nextIdx].status = 'in-consultation';
      return updated;
    });
  };

  const handleSkip = (token: string) => {
    setQueue(prev => prev.map(q => q.token === token ? { ...q, status: 'skipped' as const } : q));
  };

  const filtered = queue.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.token.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OPD Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-foreground">{waiting}</span> waiting · <span className="font-semibold text-foreground">{completed}</span> completed · Token {current?.token ?? '—'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleNext} className="gap-1.5">
          <SkipForward className="w-3.5 h-3.5" /> Next Patient
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div {...fadeIn(1)} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: queue.length, color: '' },
          { label: 'Waiting', value: waiting, color: 'text-amber-600' },
          { label: 'In Consult', value: queue.filter(q => q.status === 'in-consultation').length, color: 'text-emerald-600' },
          { label: 'Completed', value: completed, color: 'text-muted-foreground' },
        ].map(s => (
          <div key={s.label} className="border rounded-xl p-4 bg-card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div {...fadeIn(2)} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or token..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </motion.div>

      {/* Queue List — full width */}
      <motion.div {...fadeIn(3)} className="border rounded-xl bg-card overflow-hidden">
        <div className="divide-y">
          {filtered.map((p) => (
            <div
              key={p.token}
              className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${
                p.status === 'completed' || p.status === 'skipped' ? 'opacity-50' : ''
              }`}
            >
              <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded w-14 text-center shrink-0">{p.token}</span>
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold">{p.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${typeStyle[p.type]}`}>{p.type}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {p.age}y/{p.gender} · {p.time} · {p.complaint}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyle[p.status]}`}>
                  {p.status.replace('-', ' ')}
                </span>
                {p.status === 'waiting' && (
                  <>
                    <Button size="sm" onClick={() => navigate(`/doctor/consultation/${p.token}`)} className="gap-1 text-xs h-7">
                      <Play className="w-3 h-3" /> Start
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSkip(p.token)} className="text-xs h-7 px-2">
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                )}
                {p.status === 'in-consultation' && (
                  <Button size="sm" onClick={() => navigate(`/doctor/consultation/${p.token}`)} className="gap-1 text-xs h-7">
                    <Play className="w-3 h-3" /> Continue
                  </Button>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No patients in queue.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
