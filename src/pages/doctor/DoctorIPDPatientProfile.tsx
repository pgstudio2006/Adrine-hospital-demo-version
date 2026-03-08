import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Activity, Droplets, Thermometer, Pill, FileText, CreditCard, Plus, BedDouble, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface IPDDetail {
  id: string; name: string; bed: string; ward: string; uhid: string; abhaId: string;
  age: number; gender: string; diagnosis: string;
  condition: 'stable' | 'critical' | 'improving' | 'observation';
  vitals: { hr: string; bp: string; spo2: string; temp: string; rr: string };
  admitted: string; doctor: string; daysAdmitted: number;
  medications: { name: string; dosage: string; frequency: string; route: string; status: 'active' | 'stopped' }[];
  progressNotes: { date: string; time: string; author: string; type: string; note: string }[];
  labResults: { date: string; test: string; key: string; value: string; flag: string }[];
  treatmentPlan: string;
  dietInstructions: string;
  activityRestrictions: string;
}

const conditionColors: Record<string, string> = {
  stable: 'bg-emerald-500/10 text-emerald-600',
  critical: 'bg-destructive/10 text-destructive',
  improving: 'bg-blue-500/10 text-blue-600',
  observation: 'bg-amber-500/10 text-amber-600',
};

const mockIPD: Record<string, IPDDetail> = {
  '1': {
    id: '1', name: 'Rajesh Kumar', bed: '3A-01', ward: 'General Ward 3A', uhid: 'ADR-2024-0001', abhaId: '12345678901234',
    age: 45, gender: 'Male', diagnosis: 'Diabetic Ketoacidosis', condition: 'improving',
    vitals: { hr: '78', bp: '120/80', spo2: '98', temp: '98.6', rr: '18' },
    admitted: '05/03/2026', doctor: 'Dr. Amit Sharma', daysAdmitted: 3,
    medications: [
      { name: 'Inj. Insulin Glargine', dosage: '20 units', frequency: 'OD', route: 'SC', status: 'active' },
      { name: 'Inj. NS 0.9%', dosage: '1L', frequency: 'BD', route: 'IV', status: 'active' },
      { name: 'Tab. Metformin 500mg', dosage: '1 tab', frequency: 'BD', route: 'Oral', status: 'stopped' },
    ],
    progressNotes: [
      { date: '2026-03-08', time: '10:30 AM', author: 'Dr. Amit Sharma', type: 'Progress Note', note: 'Patient stable. Blood sugar levels improving. FBS 142, PPBS 198. Continue current insulin regimen. Plan step-down to oral hypoglycemics by Day 5.' },
      { date: '2026-03-08', time: '06:00 AM', author: 'Nurse Priya', type: 'Nursing Note', note: 'Morning vitals stable. Patient ambulatory. Tolerated breakfast well. No complaints of nausea.' },
      { date: '2026-03-07', time: '03:00 PM', author: 'Dr. Amit Sharma', type: 'Progress Note', note: 'Blood sugar trending down. ABG normalized. Patient alert and oriented. Continue IV fluids and insulin drip.' },
      { date: '2026-03-07', time: '09:00 AM', author: 'Dr. Kavita Reddy', type: 'Specialist Consult', note: 'Endocrinology opinion: Recommend insulin dose adjustment. Consider adding DPP-4 inhibitor once stable.' },
      { date: '2026-03-06', time: '08:00 PM', author: 'Dr. Amit Sharma', type: 'Pre-operative Note', note: 'N/A — patient is medical case.' },
      { date: '2026-03-05', time: '11:00 AM', author: 'Dr. Amit Sharma', type: 'Admission Note', note: 'Patient admitted with DKA. pH 7.18, Blood sugar 480. Started on insulin drip and aggressive IV hydration.' },
    ],
    labResults: [
      { date: '2026-03-08', test: 'Blood Sugar', key: 'FBS', value: '142 mg/dL', flag: 'high' },
      { date: '2026-03-08', test: 'Blood Sugar', key: 'PPBS', value: '198 mg/dL', flag: 'high' },
      { date: '2026-03-07', test: 'ABG', key: 'pH', value: '7.38', flag: 'normal' },
      { date: '2026-03-07', test: 'Electrolytes', key: 'Potassium', value: '4.2 mEq/L', flag: 'normal' },
      { date: '2026-03-05', test: 'ABG', key: 'pH', value: '7.18', flag: 'critical' },
    ],
    treatmentPlan: 'Continue insulin therapy. Transition to subcutaneous insulin by Day 4. Start oral hypoglycemics Day 5. Discharge goal: FBS < 130, PPBS < 180.',
    dietInstructions: 'Diabetic diet — 1800 cal. Low glycemic index foods. No added sugar. Small frequent meals.',
    activityRestrictions: 'Bed rest Day 1-2. Ambulation with assistance Day 3. Free ambulation Day 4+.',
  },
};

// Fill remaining
['Mohammed Ali', 'Sunita Devi', 'Vikram Malhotra', 'Lakshmi Nair', 'Anil Sharma'].forEach((name, i) => {
  const id = String(i + 2);
  mockIPD[id] = {
    id, name, bed: `W${i + 1}-0${i + 1}`, ward: i === 4 ? 'ICU' : `Ward ${i + 1}`, uhid: `ADR-2024-${String(i + 3).padStart(4, '0')}`,
    abhaId: `${56789012345678 + i}`, age: 48 + i * 5, gender: i % 2 === 0 ? 'Male' : 'Female',
    diagnosis: ['COPD Exacerbation', 'AKI — CKD Stage 4', 'Post-op Appendectomy', 'CHF NYHA III', 'Acute MI Post PTCA'][i],
    condition: (['critical', 'stable', 'improving', 'observation', 'critical'] as const)[i],
    vitals: { hr: '84', bp: '134/86', spo2: '94', temp: '99.2', rr: '22' },
    admitted: `0${5 + i}/03/2026`, doctor: 'Dr. Amit Sharma', daysAdmitted: 3 - i,
    medications: [{ name: 'Tab. Paracetamol', dosage: '500mg', frequency: 'SOS', route: 'Oral', status: 'active' }],
    progressNotes: [{ date: '2026-03-08', time: '09:00 AM', author: 'Dr. Amit Sharma', type: 'Progress Note', note: 'Patient progressing well. Vitals stable.' }],
    labResults: [], treatmentPlan: 'Continue current management.', dietInstructions: 'Normal diet.', activityRestrictions: 'As tolerated.',
  };
});

const tabOptions = ['Summary', 'Notes', 'Medications', 'Labs', 'Discharge', 'ABDM'];
const noteTypes = ['All', 'Progress Note', 'Nursing Note', 'Specialist Consult', 'Admission Note'];

export default function DoctorIPDPatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Summary');
  const [noteFilter, setNoteFilter] = useState('All');
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState('Progress Note');
  const [showOTRequest, setShowOTRequest] = useState(false);
  const [otData, setOtData] = useState({ procedure: '', anesthetist: '', date: '', duration: '', equipment: '' });

  // Discharge planning
  const [dischargeData, setDischargeData] = useState({
    finalDiagnosis: '', proceduresPerformed: '', treatmentSummary: '',
    medicationsAtDischarge: '', followUpInstructions: '', dietInstructions: '',
    activityRestrictions: '',
  });

  const patient = mockIPD[patientId ?? '1'] ?? mockIPD['1'];

  const filteredNotes = patient.progressNotes.filter(n => noteFilter === 'All' || n.type === noteFilter);

  const vitalsCards = [
    { label: 'Heart Rate', value: patient.vitals.hr, unit: 'bpm', icon: Heart, color: 'text-red-500' },
    { label: 'Blood Pressure', value: patient.vitals.bp, unit: 'mmHg', icon: Activity, color: 'text-blue-500' },
    { label: 'SpO2', value: patient.vitals.spo2 + '%', unit: '', icon: Droplets, color: 'text-amber-500' },
    { label: 'Temperature', value: patient.vitals.temp, unit: '°F', icon: Thermometer, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/doctor/ipd')} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">{patient.name}</h1>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${conditionColors[patient.condition]}`}>{patient.condition}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ⌂ {patient.bed} · {patient.uhid} · Day {patient.daysAdmitted} · {patient.age}y/{patient.gender} · {patient.diagnosis}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowOTRequest(!showOTRequest)}>OT Request</Button>
          <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" onClick={() => setActiveTab('Discharge')}>Discharge</Button>
        </div>
      </motion.div>

      {/* OT Request Panel */}
      {showOTRequest && (
        <motion.div {...fadeIn(0)} className="border rounded-xl bg-card p-4">
          <p className="text-sm font-semibold mb-3 flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> Operation Theatre Request</p>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Procedure type" value={otData.procedure} onChange={e => setOtData({ ...otData, procedure: e.target.value })} className="h-8 text-xs" />
            <Input placeholder="Anesthetist" value={otData.anesthetist} onChange={e => setOtData({ ...otData, anesthetist: e.target.value })} className="h-8 text-xs" />
            <Input type="date" value={otData.date} onChange={e => setOtData({ ...otData, date: e.target.value })} className="h-8 text-xs" />
            <Input placeholder="Est. duration" value={otData.duration} onChange={e => setOtData({ ...otData, duration: e.target.value })} className="h-8 text-xs" />
            <Input placeholder="Required equipment" value={otData.equipment} onChange={e => setOtData({ ...otData, equipment: e.target.value })} className="h-8 text-xs col-span-2" />
          </div>
          <Button size="sm" className="mt-3 text-xs">Submit OT Request</Button>
        </motion.div>
      )}

      {/* Vitals Cards */}
      <motion.div {...fadeIn(1)} className="grid grid-cols-4 gap-4">
        {vitalsCards.map(v => (
          <div key={v.label} className="border rounded-xl bg-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <v.icon className={`w-5 h-5 ${v.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{v.label}</p>
              <p className="text-xl font-bold">{v.value} <span className="text-xs font-normal text-muted-foreground">{v.unit}</span></p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div {...fadeIn(2)} className="border rounded-xl bg-card overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabOptions.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {tab}
                {activeTab === tab && <motion.div layoutId="ipdTab" className="absolute inset-x-2 -bottom-px h-0.5 bg-foreground rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Summary */}
          {activeTab === 'Summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Admission Info</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Admitted', value: patient.admitted },
                      { label: 'Day', value: `Day ${patient.daysAdmitted}` },
                      { label: 'Ward', value: patient.ward },
                      { label: 'Bed', value: patient.bed },
                      { label: 'Doctor', value: patient.doctor },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Treatment Plan</p>
                  <p className="text-sm">{patient.treatmentPlan}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-4 mb-2">Diet</p>
                  <p className="text-sm text-muted-foreground">{patient.dietInstructions}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-4 mb-2">Activity</p>
                  <p className="text-sm text-muted-foreground">{patient.activityRestrictions}</p>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Notes */}
          {activeTab === 'Notes' && (
            <div className="space-y-4">
              {/* Add note */}
              <div className="border rounded-lg p-4 bg-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold">Add Clinical Note</p>
                  <select value={newNoteType} onChange={e => setNewNoteType(e.target.value)} className="h-7 text-xs border rounded-md px-1.5 bg-background">
                    <option>Progress Note</option>
                    <option>Pre-operative Note</option>
                    <option>Post-operative Note</option>
                    <option>Emergency Note</option>
                    <option>Specialist Consult</option>
                  </select>
                </div>
                <Textarea placeholder="Write clinical note..." value={newNote} onChange={e => setNewNote(e.target.value)} className="text-xs min-h-[60px] resize-none" />
                <Button size="sm" className="mt-2 text-xs" onClick={() => setNewNote('')}>Save Note</Button>
              </div>

              {/* Filter */}
              <div className="flex gap-1.5">
                {noteTypes.map(f => (
                  <button key={f} onClick={() => setNoteFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${noteFilter === f ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Notes timeline */}
              <div className="space-y-3">
                {filteredNotes.map((note, i) => (
                  <div key={i} className="border rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{note.author}</p>
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{note.type}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{note.date} · {note.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {activeTab === 'Medications' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Current Medication Orders</p>
                <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><Plus className="w-3 h-3" /> Add Order</Button>
              </div>
              {patient.medications.map((med, i) => (
                <div key={i} className={`border rounded-lg p-3 flex items-center justify-between ${med.status === 'stopped' ? 'opacity-50' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{med.name}</p>
                      <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${med.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground line-through'}`}>{med.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency} · {med.route}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-7">{med.status === 'active' ? 'Stop' : 'Resume'}</Button>
                </div>
              ))}
            </div>
          )}

          {/* Labs */}
          {activeTab === 'Labs' && (
            <div className="space-y-2">
              {patient.labResults.length === 0 ? (
                <div className="flex flex-col items-center py-16"><Activity className="w-8 h-8 text-muted-foreground mb-3" /><p className="text-sm">No lab results yet</p></div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Date</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Test</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Parameter</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Value</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {patient.labResults.map((r, i) => (
                      <tr key={i} className="hover:bg-accent/30">
                        <td className="py-2 px-3 text-muted-foreground">{r.date}</td>
                        <td className="py-2 px-3">{r.test}</td>
                        <td className="py-2 px-3 font-medium">{r.key}</td>
                        <td className="py-2 px-3">{r.value}</td>
                        <td className="py-2 px-3">
                          <span className={`text-[10px] font-semibold uppercase ${r.flag === 'critical' ? 'text-destructive' : r.flag === 'high' ? 'text-amber-600' : 'text-emerald-600'}`}>{r.flag}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Discharge Planning */}
          {activeTab === 'Discharge' && (
            <div className="space-y-4">
              <p className="text-sm font-semibold flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Discharge Planning</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Final Diagnosis', key: 'finalDiagnosis' as const, placeholder: 'Final diagnosis with ICD codes...' },
                  { label: 'Procedures Performed', key: 'proceduresPerformed' as const, placeholder: 'List procedures...' },
                  { label: 'Treatment Summary', key: 'treatmentSummary' as const, placeholder: 'Summary of treatment given during stay...' },
                  { label: 'Medications at Discharge', key: 'medicationsAtDischarge' as const, placeholder: 'Discharge medications...' },
                  { label: 'Follow-up Instructions', key: 'followUpInstructions' as const, placeholder: 'Follow-up date, required tests...' },
                  { label: 'Diet Instructions', key: 'dietInstructions' as const, placeholder: 'Diet plan...' },
                  { label: 'Activity Restrictions', key: 'activityRestrictions' as const, placeholder: 'Activity limitations...' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{field.label}</label>
                    <Textarea
                      placeholder={field.placeholder}
                      value={dischargeData[field.key]}
                      onChange={e => setDischargeData({ ...dischargeData, [field.key]: e.target.value })}
                      className="text-xs min-h-[50px] resize-none mt-1"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">Finalize & Generate Summary</Button>
                <Button variant="outline" size="sm">Save Draft</Button>
              </div>
            </div>
          )}

          {/* ABDM */}
          {activeTab === 'ABDM' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">ABDM Records</p>
              <p className="text-xs text-muted-foreground mt-1">ABHA ID: {patient.abhaId}</p>
              <Button variant="outline" size="sm" className="mt-4 text-xs">Fetch Records</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
