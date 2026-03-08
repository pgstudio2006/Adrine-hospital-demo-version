import { useState } from 'react';
import { X, Stethoscope, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Diagnosis {
  id: string;
  code: string;
  text: string;
  type: 'primary' | 'secondary';
  certainty: 'confirmed' | 'provisional' | 'differential';
}

interface Props {
  diagnoses: Diagnosis[];
  onChange: (diagnoses: Diagnosis[]) => void;
}

const ICD_SUGGESTIONS = [
  { code: 'E11.9', text: 'Type 2 Diabetes Mellitus' },
  { code: 'I10', text: 'Essential Hypertension' },
  { code: 'J06.9', text: 'Acute Upper Respiratory Infection' },
  { code: 'R50.9', text: 'Fever, unspecified' },
  { code: 'M54.5', text: 'Low back pain' },
  { code: 'J44.1', text: 'COPD with Acute Exacerbation' },
  { code: 'K21.0', text: 'GERD with Esophagitis' },
  { code: 'G43.9', text: 'Migraine, unspecified' },
];

const certaintyStyle = {
  confirmed: 'bg-emerald-500/10 text-emerald-700',
  provisional: 'bg-amber-500/10 text-amber-700',
  differential: 'bg-blue-500/10 text-blue-700',
};

export default function ConsultationDiagnosis({ diagnoses, onChange }: Props) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [certainty, setCertainty] = useState<'confirmed' | 'provisional' | 'differential'>('confirmed');

  const filtered = ICD_SUGGESTIONS.filter(s =>
    s.text.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  );

  const addDiagnosis = (code: string, text: string) => {
    const type = diagnoses.length === 0 ? 'primary' : 'secondary';
    onChange([...diagnoses, { id: Date.now().toString(), code, text, type, certainty }]);
    setSearch('');
    setShowSuggestions(false);
  };

  return (
    <div className="border rounded-xl bg-card p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-3">
        <Stethoscope className="w-3.5 h-3.5" /> Diagnosis (ICD-10)
      </p>

      {/* Clinical Decision Support hint */}
      {diagnoses.length === 0 && (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-500/5 border border-amber-500/20 rounded-lg px-2.5 py-1.5 mb-2">
          <AlertTriangle className="w-3 h-3" />
          Recording a diagnosis is mandatory before finalizing consultation.
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-2">
        {diagnoses.map(d => (
          <span key={d.id} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${certaintyStyle[d.certainty]}`}>
            <span className="font-mono text-[10px] opacity-70">{d.code}</span> {d.text}
            {d.type === 'primary' && <span className="text-[9px] font-bold ml-0.5">★</span>}
            <button onClick={() => onChange(diagnoses.filter(x => x.id !== d.id))}><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>

      <div className="flex gap-1.5 relative">
        <Input
          placeholder="Search ICD-10 diagnosis..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          className="h-7 text-xs flex-1"
        />
        <select value={certainty} onChange={e => setCertainty(e.target.value as any)} className="h-7 text-xs border rounded-md px-1.5 bg-background">
          <option value="confirmed">Confirmed</option>
          <option value="provisional">Provisional</option>
          <option value="differential">Differential</option>
        </select>

        {showSuggestions && search && (
          <div className="absolute top-full left-0 right-12 mt-1 bg-card border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
            {filtered.map(s => (
              <button key={s.code} onClick={() => addDiagnosis(s.code, s.text)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground w-12">{s.code}</span>
                <span>{s.text}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <button onClick={() => addDiagnosis('', search)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-accent text-muted-foreground">
                Add "{search}" as custom diagnosis
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export type { Diagnosis };
