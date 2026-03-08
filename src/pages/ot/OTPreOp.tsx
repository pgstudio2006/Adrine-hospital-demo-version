import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, CheckCircle2, Circle, AlertTriangle, Clock,
  FileText, FlaskConical, ScanLine, User, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PreOpCase {
  id: string;
  patient: string;
  uhid: string;
  surgery: string;
  surgeon: string;
  scheduledTime: string;
  room: string;
  checklist: {
    consent: boolean;
    labResults: boolean;
    imaging: boolean;
    fasting: boolean;
    preOpEval: boolean;
    bloodReserve: boolean;
    markingSite: boolean;
    ivAccess: boolean;
  };
  whoPhase: 'pending' | 'sign_in' | 'time_out' | 'completed';
  anesthesiaClearance: boolean;
  allergies: string[];
  bloodGroup: string;
}

const CASES: PreOpCase[] = [
  {
    id: 'PRE-001', patient: 'Anilaben Joshi', uhid: 'P-2081', surgery: 'Total Knee Replacement',
    surgeon: 'Dr. Shah', scheduledTime: '10:00 AM', room: 'OT-2',
    checklist: { consent: true, labResults: true, imaging: true, fasting: true, preOpEval: true, bloodReserve: true, markingSite: true, ivAccess: false },
    whoPhase: 'sign_in', anesthesiaClearance: true, allergies: ['Penicillin'], bloodGroup: 'B+'
  },
  {
    id: 'PRE-002', patient: 'Vishal Parmar', uhid: 'P-3011', surgery: 'Appendectomy',
    surgeon: 'Dr. Mehta', scheduledTime: '11:00 AM', room: 'OT-1',
    checklist: { consent: true, labResults: true, imaging: false, fasting: true, preOpEval: false, bloodReserve: false, markingSite: false, ivAccess: false },
    whoPhase: 'pending', anesthesiaClearance: false, allergies: [], bloodGroup: 'A+'
  },
  {
    id: 'PRE-003', patient: 'Induben Shah', uhid: 'P-1567', surgery: 'Cataract Surgery',
    surgeon: 'Dr. Desai', scheduledTime: '01:30 PM', room: 'OT-4',
    checklist: { consent: true, labResults: true, imaging: true, fasting: false, preOpEval: false, bloodReserve: false, markingSite: false, ivAccess: false },
    whoPhase: 'pending', anesthesiaClearance: false, allergies: ['Sulfa'], bloodGroup: 'O+'
  },
  {
    id: 'PRE-004', patient: 'Harishbhai Modi', uhid: 'P-0892', surgery: 'CABG',
    surgeon: 'Dr. Kapoor', scheduledTime: '02:00 PM', room: 'OT-3',
    checklist: { consent: true, labResults: true, imaging: true, fasting: true, preOpEval: true, bloodReserve: true, markingSite: false, ivAccess: false },
    whoPhase: 'pending', anesthesiaClearance: true, allergies: [], bloodGroup: 'AB+'
  },
];

const WHO_PHASES = {
  pending: { label: 'Not Started', class: 'bg-muted text-muted-foreground' },
  sign_in: { label: 'Sign-In', class: 'bg-warning/10 text-warning border-warning/20' },
  time_out: { label: 'Time-Out', class: 'bg-info/10 text-info border-info/20' },
  completed: { label: 'Completed', class: 'bg-success/10 text-success border-success/20' },
};

const CHECKLIST_ITEMS = [
  { key: 'consent', label: 'Patient Consent', icon: FileText },
  { key: 'labResults', label: 'Lab Results Verified', icon: FlaskConical },
  { key: 'imaging', label: 'Imaging Reports', icon: ScanLine },
  { key: 'fasting', label: 'Fasting Confirmed', icon: Clock },
  { key: 'preOpEval', label: 'Pre-Op Evaluation', icon: User },
  { key: 'bloodReserve', label: 'Blood Reserve', icon: Shield },
  { key: 'markingSite', label: 'Surgical Site Marking', icon: ClipboardCheck },
  { key: 'ivAccess', label: 'IV Access Secured', icon: ClipboardCheck },
] as const;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function OTPreOp() {
  const [selectedCase, setSelectedCase] = useState<string>(CASES[0].id);
  const activeCase = CASES.find(c => c.id === selectedCase)!;
  const completedCount = Object.values(activeCase.checklist).filter(Boolean).length;
  const totalCount = Object.values(activeCase.checklist).length;

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Pre-Operative Preparation</h1>
        <p className="text-sm text-muted-foreground">WHO Surgical Safety Checklist & patient preparation</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Case List */}
        <motion.div variants={item} className="space-y-2">
          <span className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">Pending Cases</span>
          {CASES.map(c => {
            const done = Object.values(c.checklist).filter(Boolean).length;
            const total = Object.values(c.checklist).length;
            const pct = Math.round((done / total) * 100);
            return (
              <Card key={c.id} onClick={() => setSelectedCase(c.id)}
                className={`border-border/60 cursor-pointer transition-all hover:shadow-md ${selectedCase === c.id ? 'ring-1 ring-foreground/20 shadow-md' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{c.patient}</p>
                    <Badge className={`${WHO_PHASES[c.whoPhase].class} text-[10px]`}>{WHO_PHASES[c.whoPhase].label}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">{c.surgery} • {c.scheduledTime}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted">
                      <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-success' : pct > 50 ? 'bg-info' : 'bg-warning'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-semibold">{done}/{total}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Checklist Detail */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="border-border/60">
            <CardContent className="p-6">
              {/* Patient Info */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                <div>
                  <h2 className="text-lg font-bold">{activeCase.patient}</h2>
                  <p className="text-sm text-muted-foreground">{activeCase.uhid} • {activeCase.surgery}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeCase.surgeon} • {activeCase.room} • {activeCase.scheduledTime}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Blood Group:</span>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">{activeCase.bloodGroup}</Badge>
                  </div>
                  {activeCase.allergies.length > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      <span className="text-[10px] text-warning font-medium">{activeCase.allergies.join(', ')}</span>
                    </div>
                  )}
                  <Badge className={activeCase.anesthesiaClearance ? 'bg-success/10 text-success border-success/20 text-[10px]' : 'bg-destructive/10 text-destructive border-destructive/20 text-[10px]'}>
                    {activeCase.anesthesiaClearance ? '✓ Anesthesia Cleared' : '✗ Anesthesia Pending'}
                  </Badge>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">Checklist Progress</span>
                    <span className="font-mono font-bold">{completedCount}/{totalCount}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all ${completedCount === totalCount ? 'bg-success' : 'bg-info'}`}
                      style={{ width: `${(completedCount / totalCount) * 100}%` }} />
                  </div>
                </div>
                <Badge className={`${WHO_PHASES[activeCase.whoPhase].class} text-xs`}>
                  WHO: {WHO_PHASES[activeCase.whoPhase].label}
                </Badge>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2">
                {CHECKLIST_ITEMS.map(ci => {
                  const done = activeCase.checklist[ci.key as keyof typeof activeCase.checklist];
                  return (
                    <div key={ci.key} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${done ? 'bg-success/5 border-success/20' : 'border-border/60 hover:bg-accent'}`}>
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <ci.icon className={`h-4 w-4 shrink-0 ${done ? 'text-success' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{ci.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* WHO Safety Checklist Phases */}
              <div className="mt-6 pt-4 border-t border-border/40">
                <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">WHO Surgical Safety Checklist</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['sign_in', 'time_out', 'sign_out'] as const).map((phase, i) => {
                    const labels = ['Sign-In (Before Anesthesia)', 'Time-Out (Before Incision)', 'Sign-Out (Before Leaving OT)'];
                    const phaseOrder = { pending: 0, sign_in: 1, time_out: 2, completed: 3 };
                    const currentOrder = phaseOrder[activeCase.whoPhase];
                    const thisOrder = i + 1;
                    const isActive = thisOrder === currentOrder;
                    const isDone = thisOrder < currentOrder;
                    return (
                      <div key={phase} className={`p-3 rounded-lg border text-center ${isActive ? 'border-info/40 bg-info/5' : isDone ? 'border-success/40 bg-success/5' : 'border-border/60'}`}>
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
                        ) : isActive ? (
                          <Clock className="h-5 w-5 text-info mx-auto mb-1" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                        )}
                        <p className="text-[10px] font-medium">{labels[i]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" size="sm">Save Progress</Button>
                <Button size="sm" disabled={completedCount < totalCount}>Mark Ready for Surgery</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
