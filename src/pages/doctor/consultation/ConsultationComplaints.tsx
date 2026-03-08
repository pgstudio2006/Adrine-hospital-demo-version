import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Complaint {
  id: string;
  text: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface Props {
  complaints: Complaint[];
  onChange: (complaints: Complaint[]) => void;
  hpiNotes: string;
  onHPIChange: (notes: string) => void;
}

const severityColors = {
  mild: 'bg-emerald-500/10 text-emerald-700',
  moderate: 'bg-amber-500/10 text-amber-700',
  severe: 'bg-destructive/10 text-destructive',
};

export default function ConsultationComplaints({ complaints, onChange, hpiNotes, onHPIChange }: Props) {
  const [newText, setNewText] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newSeverity, setNewSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');

  const add = () => {
    if (!newText.trim()) return;
    onChange([...complaints, { id: Date.now().toString(), text: newText, duration: newDuration, severity: newSeverity }]);
    setNewText('');
    setNewDuration('');
  };

  return (
    <div className="space-y-3">
      {/* Chief Complaints */}
      <div className="border rounded-xl bg-card p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-3">
          <span className="text-destructive">⊘</span> Chief Complaints
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {complaints.map(c => (
            <span key={c.id} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${severityColors[c.severity]}`}>
              {c.text} {c.duration && `(${c.duration})`}
              <button onClick={() => onChange(complaints.filter(x => x.id !== c.id))} className="hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Input placeholder="Complaint..." value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} className="h-7 text-xs flex-1" />
          <Input placeholder="Duration" value={newDuration} onChange={e => setNewDuration(e.target.value)} className="h-7 text-xs w-20" />
          <select value={newSeverity} onChange={e => setNewSeverity(e.target.value as any)} className="h-7 text-xs border rounded-md px-1.5 bg-background">
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
      </div>

      {/* History of Present Illness */}
      <div className="border rounded-xl bg-card p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          History of Present Illness (HPI)
        </p>
        <Textarea
          placeholder="Symptom progression, trigger factors, relieving factors, previous treatments, associated conditions..."
          value={hpiNotes}
          onChange={e => onHPIChange(e.target.value)}
          className="text-xs min-h-[70px] resize-none"
        />
      </div>
    </div>
  );
}

export type { Complaint };
