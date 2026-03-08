import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Play, Pause, SkipForward, CheckCircle2, Clock,
  AlertTriangle, User, FileText, Pill, FlaskConical, Stethoscope, X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  vitals: { bp: string; pulse: string; temp: string; spo2: string; weight: string };
}

const queueData: QueuePatient[] = [
  { token: 'T-041', name: 'Ramesh Yadav', age: 52, gender: 'M', type: 'Follow-up', time: '09:30 AM', status: 'completed', complaint: 'Diabetes review, HbA1c follow-up', vitals: { bp: '130/84', pulse: '78', temp: '98.4°F', spo2: '98%', weight: '72kg' } },
  { token: 'T-042', name: 'Meera Joshi', age: 34, gender: 'F', type: 'New', time: '09:45 AM', status: 'completed', complaint: 'Persistent cough for 2 weeks, mild fever', vitals: { bp: '118/76', pulse: '82', temp: '99.1°F', spo2: '97%', weight: '58kg' } },
  { token: 'T-043', name: 'Priya Sharma', age: 32, gender: 'F', type: 'Follow-up', time: '10:00 AM', status: 'in-consultation', complaint: 'Thyroid medication review, fatigue', vitals: { bp: '110/72', pulse: '74', temp: '98.2°F', spo2: '99%', weight: '55kg' } },
  { token: 'T-044', name: 'Vikram Malhotra', age: 48, gender: 'M', type: 'Emergency', time: '10:15 AM', status: 'waiting', complaint: 'Severe chest pain, radiating to left arm', vitals: { bp: '158/96', pulse: '102', temp: '98.8°F', spo2: '94%', weight: '85kg' } },
  { token: 'T-045', name: 'Rajesh Kumar', age: 45, gender: 'M', type: 'Follow-up', time: '10:30 AM', status: 'waiting', complaint: 'Blood sugar monitoring, medication adjustment', vitals: { bp: '136/88', pulse: '76', temp: '98.6°F', spo2: '97%', weight: '78kg' } },
  { token: 'T-046', name: 'Ananya Das', age: 27, gender: 'F', type: 'New', time: '10:45 AM', status: 'waiting', complaint: 'Recurring headaches, dizziness', vitals: { bp: '104/68', pulse: '70', temp: '98.4°F', spo2: '99%', weight: '52kg' } },
  { token: 'T-047', name: 'Suresh Pillai', age: 61, gender: 'M', type: 'Follow-up', time: '11:00 AM', status: 'waiting', complaint: 'COPD management, inhaler review', vitals: { bp: '142/90', pulse: '88', temp: '98.6°F', spo2: '93%', weight: '68kg' } },
  { token: 'T-048', name: 'Geeta Kapoor', age: 55, gender: 'F', type: 'Follow-up', time: '11:15 AM', status: 'waiting', complaint: 'Knee pain, physiotherapy progress', vitals: { bp: '128/82', pulse: '72', temp: '98.4°F', spo2: '98%', weight: '70kg' } },
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
  const [selectedToken, setSelectedToken] = useState<string>('T-043');
  const [soapNotes, setSoapNotes] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
  const navigate = useNavigate();

  const selected = queue.find(q => q.token === selectedToken);
  const waiting = queue.filter(q => q.status === 'waiting').length;
  const completed = queue.filter(q => q.status === 'completed').length;
  const current = queue.find(q => q.status === 'in-consultation');

  const handleNext = () => {
    setQueue(prev => {
      const updated = [...prev];
      const currentIdx = updated.findIndex(q => q.status === 'in-consultation');
      if (currentIdx >= 0) updated[currentIdx].status = 'completed';
      const nextIdx = updated.findIndex(q => q.status === 'waiting');
      if (nextIdx >= 0) {
        updated[nextIdx].status = 'in-consultation';
        setSelectedToken(updated[nextIdx].token);
      }
      return updated;
    });
    setSoapNotes({ subjective: '', objective: '', assessment: '', plan: '' });
  };

  const handleSkip = (token: string) => {
    setQueue(prev => prev.map(q => q.token === token ? { ...q, status: 'skipped' as const } : q));
  };

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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleNext} className="gap-1.5">
            <SkipForward className="w-3.5 h-3.5" /> Next Patient
          </Button>
        </div>
      </motion.div>

      {/* Queue Summary Cards */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Queue List */}
        <motion.div {...fadeIn(2)} className="border rounded-xl bg-card overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search queue..." className="pl-8 h-8 text-xs" />
            </div>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {queue.map((p) => (
              <div
                key={p.token}
                onClick={() => setSelectedToken(p.token)}
                className={`flex items-center gap-2.5 px-3 py-2.5 hover:bg-accent/50 transition-colors cursor-pointer ${
                  selectedToken === p.token ? 'bg-accent/70' : ''
                } ${p.status === 'completed' || p.status === 'skipped' ? 'opacity-50' : ''}`}
              >
                <span className="text-[11px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded w-12 text-center shrink-0">{p.token}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.age}y/{p.gender} · {p.complaint.slice(0, 30)}...</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-0.5">
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${typeStyle[p.type]}`}>{p.type}</span>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${statusStyle[p.status]}`}>{p.status.replace('-', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Patient Detail + SOAP */}
        <motion.div {...fadeIn(3)} className="lg:col-span-2 space-y-4">
          {selected ? (
            <>
              {/* Patient Header */}
              <div className="border rounded-xl bg-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-bold">{selected.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{selected.name}</h3>
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${typeStyle[selected.type]}`}>{selected.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{selected.age}y/{selected.gender === 'M' ? 'Male' : 'Female'} · Token {selected.token} · {selected.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {selected.status === 'waiting' && (
                      <Button size="sm" onClick={() => navigate(`/doctor/consultation/${selected.token}`)} className="gap-1 text-xs h-7">
                        <Play className="w-3 h-3" /> Start Consult
                      </Button>
                    )}
                    {selected.status === 'waiting' && (
                      <Button variant="outline" size="sm" onClick={() => handleSkip(selected.token)} className="gap-1 text-xs h-7">
                        <X className="w-3 h-3" /> Skip
                      </Button>
                    )}
                  </div>
                </div>

                {/* Chief Complaint */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold mb-0.5">Chief Complaint</p>
                  <p className="text-sm">{selected.complaint}</p>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'BP', value: selected.vitals.bp, unit: 'mmHg' },
                    { label: 'Pulse', value: selected.vitals.pulse, unit: 'bpm' },
                    { label: 'Temp', value: selected.vitals.temp, unit: '' },
                    { label: 'SpO2', value: selected.vitals.spo2, unit: '' },
                    { label: 'Weight', value: selected.vitals.weight, unit: '' },
                  ].map(v => (
                    <div key={v.label} className="bg-muted/50 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{v.label}</p>
                      <p className="text-sm font-bold mt-0.5">{v.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOAP Notes */}
              <div className="border rounded-xl bg-card p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-muted-foreground" />
                  SOAP Notes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['subjective', 'objective', 'assessment', 'plan'] as const).map(field => (
                    <div key={field}>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Textarea
                        value={soapNotes[field]}
                        onChange={e => setSoapNotes(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={`Enter ${field}...`}
                        className="text-xs min-h-[100px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Prescription', icon: Pill, color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' },
                  { label: 'Lab Order', icon: FlaskConical, color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20' },
                  { label: 'Refer', icon: User, color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' },
                  { label: 'Case Sheet', icon: FileText, color: 'bg-muted text-muted-foreground hover:bg-accent' },
                ].map(action => (
                  <button
                    key={action.label}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${action.color}`}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Save */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Save Draft</Button>
                <Button size="sm" onClick={handleNext} className="gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete & Next
                </Button>
              </div>
            </>
          ) : (
            <div className="border rounded-xl bg-card flex flex-col items-center justify-center py-20">
              <Clock className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No patient selected</p>
              <p className="text-xs text-muted-foreground mt-1">Select a patient from the queue</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
