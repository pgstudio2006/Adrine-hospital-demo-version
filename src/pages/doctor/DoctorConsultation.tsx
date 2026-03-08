import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Monitor, Tablet, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConsultationVitals from './consultation/ConsultationVitals';
import ConsultationComplaints, { type Complaint } from './consultation/ConsultationComplaints';
import ConsultationDiagnosis, { type Diagnosis } from './consultation/ConsultationDiagnosis';
import ConsultationExamination, { type ExamFindings } from './consultation/ConsultationExamination';
import ConsultationOrders, { type LabTest, type RadiologyOrder, type ProcedureOrder } from './consultation/ConsultationOrders';
import ConsultationMedications, { type Medication } from './consultation/ConsultationMedications';
import ConsultationRightPanel from './consultation/ConsultationRightPanel';
import PrescriptionPreview from './consultation/PrescriptionPreview';
import { useHospital } from '@/stores/hospitalStore';
import { useAuth } from '@/contexts/AuthContext';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

export default function DoctorConsultation() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, saveConsultation } = useHospital();
  const { user } = useAuth();

  // Look up patient from store
  const patient = patients.find(p => p.uhid === patientId);
  const patientName = patient?.name ?? 'Patient';
  const patientInfo = patient 
    ? `${patient.age}y / ${patient.gender}  •  UHID: ${patient.uhid}  •  ${patient.phone}`
    : `UHID: ${patientId}`;
  const patientAllergies = patient?.allergies ? patient.allergies.split(',').map(a => a.trim()) : [];

  // Vitals
  const [vitals, setVitals] = useState({ bp: '120/80', spo2: '98', temp: '98.6', pulse: '72', weight: '70', sugar: '110', height: '170', rr: '18', bmi: '24.2' });
  const [complaints, setComplaints] = useState<Complaint[]>([{ id: '1', text: 'Fever and headache', duration: '2 days', severity: 'moderate' }]);
  const [hpiNotes, setHpiNotes] = useState('');
  const [examFindings, setExamFindings] = useState<ExamFindings>({ general: '', cardiovascular: '', respiratory: '', neurological: '', abdominal: '', musculoskeletal: '', ent: '', dermatological: '' });
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [radiologyOrders, setRadiologyOrders] = useState<RadiologyOrder[]>([]);
  const [procedures, setProcedures] = useState<ProcedureOrder[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [advice, setAdvice] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [followUpDays, setFollowUpDays] = useState('15');
  const [followUpUnit, setFollowUpUnit] = useState('Days');
  const [viewMode, setViewMode] = useState<'Digital' | 'Tablet'>('Digital');
  const [leftTab, setLeftTab] = useState<'clinical' | 'orders'>('clinical');
  const [showPreview, setShowPreview] = useState(false);

  const handleSaveConsultation = () => {
    saveConsultation({
      uhid: patientId || '',
      patientName,
      doctor: user?.name || 'Dr. Doctor',
      department: patient?.department || 'General Medicine',
      labTests: labTests.map(t => ({ tests: t.text, category: 'General', priority: t.priority === 'stat' ? 'Emergency' as const : t.priority === 'urgent' ? 'Urgent' as const : 'Routine' as const })),
      medications: medications.map(m => ({
        drug: m.name,
        dosage: m.dosage,
        frequency: m.frequency || 'OD',
        duration: m.duration || '7 days',
        route: m.route || 'Oral',
        qty: 10,
      })),
      radiologyOrders: radiologyOrders.map(r => ({
        study: `${r.type} - ${r.bodyPart}`,
        modality: r.type,
        priority: r.priority === 'urgent' ? 'Urgent' as const : 'Routine' as const,
      })),
      consultationFee: 800,
    });
    navigate(-1);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{patientName}</h1>
            <p className="text-sm text-muted-foreground">{patientInfo}</p>
            {patientAllergies.length > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                  ⚠ Allergy: {patientAllergies.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('Digital')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'Digital' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <Monitor className="w-3.5 h-3.5" /> Digital
            </button>
            <button onClick={() => setViewMode('Tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'Tablet' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <Tablet className="w-3.5 h-3.5" /> Tablet
            </button>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Mic className="w-3.5 h-3.5" /> Voice Dictation
          </Button>
          <Button size="sm" className="gap-1.5 bg-foreground text-background hover:bg-foreground/90">
            <Sparkles className="w-3.5 h-3.5" /> AI Scribe
          </Button>
        </div>
      </motion.div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-4">
        {/* Left Column */}
        <motion.div {...fadeIn(1)} className="space-y-1">
          {/* Sub-tabs */}
          <div className="flex border rounded-lg overflow-hidden mb-3">
            <button onClick={() => setLeftTab('clinical')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${leftTab === 'clinical' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>
              Clinical
            </button>
            <button onClick={() => setLeftTab('orders')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${leftTab === 'orders' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>
              Orders
            </button>
          </div>

          {leftTab === 'clinical' ? (
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              <ConsultationVitals vitals={vitals} onChange={setVitals} />
              <ConsultationComplaints complaints={complaints} onChange={setComplaints} hpiNotes={hpiNotes} onHPIChange={setHpiNotes} />
              <ConsultationExamination findings={examFindings} onChange={setExamFindings} />
              <ConsultationDiagnosis diagnoses={diagnoses} onChange={setDiagnoses} />
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              <ConsultationOrders
                labTests={labTests} onLabChange={setLabTests}
                radiologyOrders={radiologyOrders} onRadiologyChange={setRadiologyOrders}
                procedures={procedures} onProcedureChange={setProcedures}
              />
            </div>
          )}
        </motion.div>

        {/* Center — Medications */}
        <motion.div {...fadeIn(2)}>
          <ConsultationMedications medications={medications} onChange={setMedications} allergies={patientAllergies} />
        </motion.div>

        {/* Right Column */}
        <motion.div {...fadeIn(3)} className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
          <ConsultationRightPanel
            advice={advice} onAdviceChange={setAdvice}
            privateNotes={privateNotes} onPrivateNotesChange={setPrivateNotes}
            followUpDays={followUpDays} onFollowUpDaysChange={setFollowUpDays}
            followUpUnit={followUpUnit} onFollowUpUnitChange={setFollowUpUnit}
            treatmentPlan={treatmentPlan} onTreatmentPlanChange={setTreatmentPlan}
            onSave={handleSaveConsultation} onDraft={() => {}}
          />
        </motion.div>
      </div>
    </div>
  );
}
