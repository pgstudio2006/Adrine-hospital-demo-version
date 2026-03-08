import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, X, Activity, Pill, Stethoscope, Search,
  FileText, Calendar, Lock, Eye, EyeOff, Sparkles, Monitor, Tablet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface Complaint {
  id: string;
  text: string;
}

interface Diagnosis {
  id: string;
  text: string;
}

interface LabTest {
  id: string;
  text: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function DoctorConsultation() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [vitals, setVitals] = useState({ bp: '120/80', spo2: '98', temp: '98.6', pulse: '72', weight: '70', sugar: '110' });
  const [complaints, setComplaints] = useState<Complaint[]>([{ id: '1', text: 'Fever and headache since 2 days' }]);
  const [newComplaint, setNewComplaint] = useState('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [newLabTest, setNewLabTest] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medSearch, setMedSearch] = useState('');
  const [advice, setAdvice] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [followUpDays, setFollowUpDays] = useState('15');
  const [followUpUnit, setFollowUpUnit] = useState('Days');
  const [viewMode, setViewMode] = useState<'Digital' | 'Tablet'>('Digital');

  const patientName = patientId === '1' ? 'Rajesh Patel' : 'Patient';
  const patientInfo = '45y / Male  •  +91 98765 43210';

  const addComplaint = () => {
    if (!newComplaint.trim()) return;
    setComplaints(prev => [...prev, { id: Date.now().toString(), text: newComplaint }]);
    setNewComplaint('');
  };

  const removeComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const addDiagnosis = () => {
    if (!newDiagnosis.trim()) return;
    setDiagnoses(prev => [...prev, { id: Date.now().toString(), text: newDiagnosis }]);
    setNewDiagnosis('');
  };

  const addLabTest = () => {
    if (!newLabTest.trim()) return;
    setLabTests(prev => [...prev, { id: Date.now().toString(), text: newLabTest }]);
    setNewLabTest('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{patientName}</h1>
            <p className="text-sm text-muted-foreground">{patientInfo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('Digital')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'Digital' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Digital
            </button>
            <button
              onClick={() => setViewMode('Tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'Tablet' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" /> Tablet
            </button>
          </div>
          <Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90">
            <Sparkles className="w-3.5 h-3.5" /> AI Scribe
          </Button>
        </div>
      </motion.div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-5">
        {/* Left Column — Vitals, Complaints, Diagnosis, Lab Tests */}
        <motion.div {...fadeIn(1)} className="space-y-4">
          {/* Vitals */}
          <div className="border rounded-xl bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-3">
              <Activity className="w-3.5 h-3.5" /> Vitals
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'BP', key: 'bp' as const },
                { label: 'SPO2 (%)', key: 'spo2' as const },
                { label: 'TEMP (°F)', key: 'temp' as const },
                { label: 'PULSE', key: 'pulse' as const },
                { label: 'WEIGHT (KG)', key: 'weight' as const },
                { label: 'SUGAR/RBS', key: 'sugar' as const },
              ].map(v => (
                <div key={v.key}>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{v.label}</label>
                  <Input
                    value={vitals[v.key]}
                    onChange={e => setVitals(prev => ({ ...prev, [v.key]: e.target.value }))}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Complaints */}
          <div className="border rounded-xl bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-3">
              <span className="text-destructive">⊘</span> Complaints
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {complaints.map(c => (
                <span key={c.id} className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full">
                  {c.text}
                  <button onClick={() => removeComplaint(c.id)} className="hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Input
                placeholder="Add complaint..."
                value={newComplaint}
                onChange={e => setNewComplaint(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComplaint()}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Diagnosis */}
          <div className="border rounded-xl bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-3">
              <Stethoscope className="w-3.5 h-3.5" /> Diagnosis
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {diagnoses.map(d => (
                <span key={d.id} className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-700 px-2.5 py-1 rounded-full">
                  {d.text}
                  <button onClick={() => setDiagnoses(prev => prev.filter(x => x.id !== d.id))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Add diagnosis..."
              value={newDiagnosis}
              onChange={e => setNewDiagnosis(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDiagnosis()}
              className="h-8 text-xs"
            />
          </div>

          {/* Lab Tests */}
          <div className="border rounded-xl bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-3">
              <Activity className="w-3.5 h-3.5" /> Lab Tests
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {labTests.map(t => (
                <span key={t.id} className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-700 px-2.5 py-1 rounded-full">
                  {t.text}
                  <button onClick={() => setLabTests(prev => prev.filter(x => x.id !== t.id))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Add test..."
              value={newLabTest}
              onChange={e => setNewLabTest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLabTest()}
              className="h-8 text-xs"
            />
          </div>
        </motion.div>

        {/* Center — Medications */}
        <motion.div {...fadeIn(2)} className="border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-muted-foreground" /> Medications
            </p>
            <Button variant="outline" size="sm" className="gap-1 text-xs h-7">
              + Manual
            </Button>
          </div>
          <div className="p-4">
            <div className="relative mb-4">
              <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search 50,000+ medicines..."
                value={medSearch}
                onChange={e => setMedSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {medications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Pill className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Search and add medications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {medications.map(med => (
                  <div key={med.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency} · {med.duration}</p>
                    </div>
                    <button onClick={() => setMedications(prev => prev.filter(m => m.id !== med.id))}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column — Advice, Private Notes, Follow-up */}
        <motion.div {...fadeIn(3)} className="space-y-4">
          {/* Advice */}
          <div className="border rounded-xl bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Advice
              </p>
              <button className="text-muted-foreground hover:text-foreground">
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
            <Textarea
              placeholder="Diet, lifestyle..."
              value={advice}
              onChange={e => setAdvice(e.target.value)}
              className="text-xs min-h-[80px] resize-none"
            />
          </div>

          {/* Private Notes */}
          <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Private Notes
              </p>
              <button onClick={() => setShowPrivateNotes(!showPrivateNotes)} className="text-amber-600 hover:text-amber-700">
                {showPrivateNotes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {showPrivateNotes ? (
              <Textarea
                placeholder="Private clinical notes..."
                value={privateNotes}
                onChange={e => setPrivateNotes(e.target.value)}
                className="text-xs min-h-[60px] resize-none border-amber-500/20"
              />
            ) : (
              <p className="text-xs text-amber-600">Hidden (click eye to view)</p>
            )}
          </div>

          {/* Follow Up */}
          <div className="border rounded-xl bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5" /> Follow Up
            </p>
            <div className="flex gap-2">
              <Input
                value={followUpDays}
                onChange={e => setFollowUpDays(e.target.value)}
                className="h-8 text-sm w-16"
              />
              <select
                value={followUpUnit}
                onChange={e => setFollowUpUnit(e.target.value)}
                className="h-8 text-sm border rounded-md px-2 bg-background"
              >
                <option>Days</option>
                <option>Weeks</option>
                <option>Months</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button size="sm" className="w-full bg-foreground text-background hover:bg-foreground/90">
              Save & Print
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Save Draft
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
