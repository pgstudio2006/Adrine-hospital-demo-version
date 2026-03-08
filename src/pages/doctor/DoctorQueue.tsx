import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Play, SkipForward, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useHospital } from '@/stores/hospitalStore';
import { useAuth } from '@/contexts/AuthContext';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

const statusStyle: Record<string, string> = {
  waiting: 'bg-amber-500/10 text-amber-600',
  called: 'bg-primary/10 text-primary',
  'in-consultation': 'bg-emerald-500/10 text-emerald-600',
  completed: 'bg-muted text-muted-foreground',
  skipped: 'bg-destructive/10 text-destructive',
};

export default function DoctorQueue() {
  const { queue, updateQueueStatus, nextQueuePatient } = useHospital();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Show all queue entries (in real app, filter by doctor)
  const myQueue = queue;
  const waiting = myQueue.filter(q => q.status === 'waiting').length;
  const completed = myQueue.filter(q => q.status === 'completed').length;
  const current = myQueue.find(q => q.status === 'in-consultation');

  const handleNext = () => {
    // Move next waiting to in-consultation
    const currentEntry = myQueue.find(q => q.status === 'in-consultation');
    if (currentEntry) updateQueueStatus(currentEntry.tokenNo, 'completed');
    const nextEntry = myQueue.find(q => q.status === 'waiting');
    if (nextEntry) updateQueueStatus(nextEntry.tokenNo, 'in-consultation');
  };

  const handleStart = (tokenNo: number) => {
    // If someone is in consultation, complete them first
    const currentEntry = myQueue.find(q => q.status === 'in-consultation');
    if (currentEntry) updateQueueStatus(currentEntry.tokenNo, 'completed');
    updateQueueStatus(tokenNo, 'in-consultation');
    const entry = myQueue.find(q => q.tokenNo === tokenNo);
    if (entry) navigate(`/doctor/consultation/${entry.uhid}`);
  };

  const filtered = myQueue.filter(p =>
    p.patientName.toLowerCase().includes(search.toLowerCase()) || String(p.tokenNo).includes(search)
  );

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OPD Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-foreground">{waiting}</span> waiting · <span className="font-semibold text-foreground">{completed}</span> completed · Token {current?.tokenNo ?? '—'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleNext} className="gap-1.5">
          <SkipForward className="w-3.5 h-3.5" /> Next Patient
        </Button>
      </motion.div>

      <motion.div {...fadeIn(1)} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: myQueue.length, color: '' },
          { label: 'Waiting', value: waiting, color: 'text-amber-600' },
          { label: 'In Consult', value: myQueue.filter(q => q.status === 'in-consultation').length, color: 'text-emerald-600' },
          { label: 'Completed', value: completed, color: 'text-muted-foreground' },
        ].map(s => (
          <div key={s.label} className="border rounded-xl p-4 bg-card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div {...fadeIn(2)} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or token..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </motion.div>

      <motion.div {...fadeIn(3)} className="border rounded-xl bg-card overflow-hidden">
        <div className="divide-y">
          {filtered.map((p) => (
            <div key={p.tokenNo}
              className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${p.status === 'completed' || p.status === 'skipped' ? 'opacity-50' : ''}`}>
              <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded w-14 text-center shrink-0">#{p.tokenNo}</span>
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold">{p.patientName.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{p.patientName}</p>
                  <span className="text-[10px] font-mono text-muted-foreground">{p.uhid}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {p.department} · {p.doctor} · {p.checkedInAt} {p.complaint ? `· ${p.complaint}` : ''}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyle[p.status]}`}>
                  {p.status.replace('-', ' ')}
                </span>
                {p.status === 'waiting' && (
                  <>
                    <Button size="sm" onClick={() => handleStart(p.tokenNo)} className="gap-1 text-xs h-7">
                      <Play className="w-3 h-3" /> Start
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => updateQueueStatus(p.tokenNo, 'skipped')} className="text-xs h-7 px-2">
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                )}
                {p.status === 'in-consultation' && (
                  <Button size="sm" onClick={() => navigate(`/doctor/consultation/${p.uhid}`)} className="gap-1 text-xs h-7">
                    <Play className="w-3 h-3" /> Continue
                  </Button>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No patients in queue. Patients appear here after check-in from Reception.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
