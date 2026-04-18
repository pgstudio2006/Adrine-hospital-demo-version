import { useMemo, useState } from 'react';
import { Pill, X, AlertTriangle, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppSelect } from '@/components/ui/app-select';
import { useHospital } from '@/stores/hospitalStore';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
  isGeneric: boolean;
}

interface Props {
  medications: Medication[];
  onChange: (meds: Medication[]) => void;
  allergies: string[];
}

const FALLBACK_DRUG_DB = [
  { name: 'Tab. Paracetamol 500mg', generic: 'Paracetamol', category: 'Analgesic' },
  { name: 'Tab. Metformin 500mg', generic: 'Metformin', category: 'Antidiabetic' },
  { name: 'Tab. Amlodipine 5mg', generic: 'Amlodipine', category: 'Antihypertensive' },
  { name: 'Tab. Atorvastatin 10mg', generic: 'Atorvastatin', category: 'Statin' },
  { name: 'Tab. Pantoprazole 40mg', generic: 'Pantoprazole', category: 'PPI' },
  { name: 'Tab. Azithromycin 500mg', generic: 'Azithromycin', category: 'Antibiotic' },
  { name: 'Tab. Cetirizine 10mg', generic: 'Cetirizine', category: 'Antihistamine' },
  { name: 'Cap. Amoxicillin 500mg', generic: 'Amoxicillin', category: 'Antibiotic' },
  { name: 'Tab. Montelukast 10mg', generic: 'Montelukast', category: 'LTRA' },
  { name: 'Inj. Insulin Glargine', generic: 'Insulin', category: 'Antidiabetic' },
];

const ROUTES = ['Oral', 'IV', 'IM', 'SC', 'Topical', 'Inhalation', 'Sublingual', 'Rectal'];
const FREQUENCIES = ['OD (Once)', 'BD (Twice)', 'TDS (Thrice)', 'QID (4 times)', 'SOS', 'HS (Bedtime)', 'Stat'];

// Simple drug interaction check
const INTERACTIONS: Record<string, string[]> = {
  'Metformin': ['Insulin'],
  'Amlodipine': ['Atorvastatin'],
};

export default function ConsultationMedications({ medications, onChange, allergies }: Props) {
  const { pharmacyInventory } = useHospital();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ name: '', dosage: '', frequency: 'OD (Once)', duration: '5 days', route: 'Oral', instructions: '', isGeneric: false });

  const drugDb = useMemo(() => {
    const fromInventory = pharmacyInventory.map((item) => ({
      name: item.drug,
      generic: item.generic,
      category: item.category,
      qty: item.qty,
      price: item.price,
    }));

    return fromInventory.length > 0
      ? fromInventory
      : FALLBACK_DRUG_DB.map((item) => ({ ...item, qty: 9999, price: 0 }));
  }, [pharmacyInventory]);

  const filtered = drugDb.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.generic.toLowerCase().includes(search.toLowerCase())
  );

  const addFromDB = (drug: (typeof drugDb)[number]) => {
    if (drug.qty <= 0) {
      return;
    }

    onChange([...medications, {
      id: Date.now().toString(), name: drug.name, dosage: '1 tab',
      frequency: 'OD (Once)', duration: '5 days', route: 'Oral',
      instructions: '', isGeneric: false,
    }]);
    setSearch('');
    setShowSearch(false);
  };

  const addManual = () => {
    if (!manual.name.trim()) return;
    onChange([...medications, { ...manual, id: Date.now().toString() }]);
    setManual({ name: '', dosage: '', frequency: 'OD (Once)', duration: '5 days', route: 'Oral', instructions: '', isGeneric: false });
    setShowManual(false);
  };

  // Check interactions
  const interactions: string[] = [];
  const medNames = medications.map(m => drugDb.find(d => d.name === m.name)?.generic ?? m.name);
  medNames.forEach(name => {
    if (INTERACTIONS[name]) {
      INTERACTIONS[name].forEach(conflict => {
        if (medNames.includes(conflict)) {
          interactions.push(`${name} ↔ ${conflict}: potential interaction`);
        }
      });
    }
  });

  // Check allergy conflicts
  const allergyConflicts = medications.filter(m => {
    const generic = drugDb.find(d => d.name === m.name)?.generic ?? '';
    return allergies.some(a => generic.toLowerCase().includes(a.toLowerCase()) || m.name.toLowerCase().includes(a.toLowerCase()));
  });

  return (
    <div className="border rounded-xl bg-card overflow-hidden h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="text-sm font-semibold flex items-center gap-1.5">
          <Pill className="w-4 h-4 text-muted-foreground" /> Medications ({medications.length})
        </p>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="gap-1 text-xs h-7" onClick={() => setShowManual(!showManual)}>
            + Manual
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-xs h-7">
            <Copy className="w-3 h-3" /> Copy Previous
          </Button>
        </div>
      </div>

      {/* Drug interaction alerts */}
      {(interactions.length > 0 || allergyConflicts.length > 0) && (
        <div className="px-4 py-2 bg-destructive/5 border-b border-destructive/20">
          {interactions.map((msg, i) => (
            <p key={i} className="text-[11px] text-destructive flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Drug Interaction: {msg}
            </p>
          ))}
          {allergyConflicts.map(m => (
            <p key={m.id} className="text-[11px] text-destructive flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Allergy Conflict: {m.name} conflicts with patient allergy
            </p>
          ))}
        </div>
      )}

      <div className="p-4">
        {/* Search */}
        <div className="relative mb-3">
          <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search 50,000+ medicines..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className="pl-9"
          />
          {showSearch && search && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {filtered.map(d => (
                <button key={d.name} onClick={() => addFromDB(d)} disabled={d.qty <= 0}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground ml-2">({d.generic} · {d.category})</span>
                  <span className={`ml-2 text-[10px] ${d.qty > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                    {d.qty > 0 ? `In stock: ${d.qty}` : 'Out of stock'}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">No matches found</p>
              )}
            </div>
          )}
        </div>

        {/* Manual entry form */}
        {showManual && (
          <div className="border rounded-lg p-3 mb-3 space-y-2 bg-accent/30">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Drug name *" value={manual.name} onChange={e => setManual({ ...manual, name: e.target.value })} className="h-7 text-xs" />
              <Input placeholder="Dosage" value={manual.dosage} onChange={e => setManual({ ...manual, dosage: e.target.value })} className="h-7 text-xs" />
              <AppSelect
                value={manual.frequency}
                onValueChange={(value) => setManual({ ...manual, frequency: value })}
                options={FREQUENCIES.map((frequency) => ({ value: frequency, label: frequency }))}
                className="h-7 text-xs"
              />
              <AppSelect
                value={manual.route}
                onValueChange={(value) => setManual({ ...manual, route: value })}
                options={ROUTES.map((route) => ({ value: route, label: route }))}
                className="h-7 text-xs"
              />
              <Input placeholder="Duration" value={manual.duration} onChange={e => setManual({ ...manual, duration: e.target.value })} className="h-7 text-xs" />
              <Input placeholder="Instructions" value={manual.instructions} onChange={e => setManual({ ...manual, instructions: e.target.value })} className="h-7 text-xs" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input type="checkbox" checked={manual.isGeneric} onChange={e => setManual({ ...manual, isGeneric: e.target.checked })} className="rounded" />
                Generic
              </label>
              <Button size="sm" onClick={addManual} className="h-7 text-xs">Add</Button>
            </div>
          </div>
        )}

        {/* Medication list */}
        {medications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Pill className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Search and add medications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {medications.map((med, idx) => (
              <div key={med.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">{idx + 1}</span>
                      <p className="text-sm font-medium">{med.name}</p>
                      {med.isGeneric && <span className="text-[9px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full">Generic</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {med.dosage} · {med.frequency} · {med.duration} · {med.route}
                    </p>
                    {med.instructions && <p className="text-[11px] text-muted-foreground italic mt-0.5">{med.instructions}</p>}
                  </div>
                  <button onClick={() => onChange(medications.filter(m => m.id !== med.id))}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                {/* Inline edit */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  <Input value={med.dosage} onChange={e => { const updated = [...medications]; updated[idx] = { ...med, dosage: e.target.value }; onChange(updated); }} className="h-6 text-[10px]" placeholder="Dosage" />
                  <AppSelect
                    value={med.frequency}
                    onValueChange={(value) => {
                      const updated = [...medications];
                      updated[idx] = { ...med, frequency: value };
                      onChange(updated);
                    }}
                    options={FREQUENCIES.map((frequency) => ({ value: frequency, label: frequency }))}
                    className="h-6 text-[10px]"
                  />
                  <Input value={med.duration} onChange={e => { const updated = [...medications]; updated[idx] = { ...med, duration: e.target.value }; onChange(updated); }} className="h-6 text-[10px]" placeholder="Duration" />
                  <AppSelect
                    value={med.route}
                    onValueChange={(value) => {
                      const updated = [...medications];
                      updated[idx] = { ...med, route: value };
                      onChange(updated);
                    }}
                    options={ROUTES.map((route) => ({ value: route, label: route }))}
                    className="h-6 text-[10px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export type { Medication };
