import { useState } from 'react';
import {
  FileText, Lock, Eye, EyeOff, Calendar, Sparkles,
  BedDouble, UserPlus, Award, BookOpen, ArrowRightLeft, FileSearch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  advice: string;
  onAdviceChange: (v: string) => void;
  privateNotes: string;
  onPrivateNotesChange: (v: string) => void;
  followUpDays: string;
  onFollowUpDaysChange: (v: string) => void;
  followUpUnit: string;
  onFollowUpUnitChange: (v: string) => void;
  treatmentPlan: string;
  onTreatmentPlanChange: (v: string) => void;
  onSave: () => void;
  onDraft: () => void;
  onPreview?: () => void;
}

export default function ConsultationRightPanel({
  advice, onAdviceChange, privateNotes, onPrivateNotesChange,
  followUpDays, onFollowUpDaysChange, followUpUnit, onFollowUpUnitChange,
  treatmentPlan, onTreatmentPlanChange, onSave, onDraft, onPreview,
}: Props) {
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const [admissionData, setAdmissionData] = useState({ department: '', bedType: 'General', priority: 'Routine', reason: '' });
  const [referralData, setReferralData] = useState({ doctor: '', department: '', reason: '' });
  const [certificateType, setCertificateType] = useState('medical-leave');

  return (
    <div className="space-y-3">
      {/* Treatment Plan */}
      <div className="border rounded-xl bg-card p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3.5 h-3.5" /> Treatment Plan
        </p>
        <Textarea
          placeholder="Treatment objective, therapy plan, monitoring instructions..."
          value={treatmentPlan}
          onChange={e => onTreatmentPlanChange(e.target.value)}
          className="text-xs min-h-[60px] resize-none"
        />
      </div>

      {/* Advice / Patient Education */}
      <div className="border rounded-xl bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Advice & Patient Education
          </p>
          <button className="text-muted-foreground hover:text-foreground">
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
        <Textarea
          placeholder="Diet, lifestyle, medication adherence, rehabilitation instructions..."
          value={advice}
          onChange={e => onAdviceChange(e.target.value)}
          className="text-xs min-h-[60px] resize-none"
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
          <Textarea placeholder="Private clinical notes..." value={privateNotes} onChange={e => onPrivateNotesChange(e.target.value)} className="text-xs min-h-[50px] resize-none border-amber-500/20" />
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
          <Input value={followUpDays} onChange={e => onFollowUpDaysChange(e.target.value)} className="h-7 text-xs w-14" />
          <select value={followUpUnit} onChange={e => onFollowUpUnitChange(e.target.value)} className="h-7 text-xs border rounded-md px-1.5 bg-background">
            <option>Days</option>
            <option>Weeks</option>
            <option>Months</option>
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-1.5">
        <button onClick={() => setShowAdmission(!showAdmission)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors text-left">
          <BedDouble className="w-3.5 h-3.5 text-muted-foreground" /> Recommend Admission
        </button>
        {showAdmission && (
          <div className="border rounded-lg p-3 space-y-2 bg-accent/30">
            <Input placeholder="Department" value={admissionData.department} onChange={e => setAdmissionData({ ...admissionData, department: e.target.value })} className="h-7 text-xs" />
            <div className="flex gap-1.5">
              <select value={admissionData.bedType} onChange={e => setAdmissionData({ ...admissionData, bedType: e.target.value })} className="h-7 text-xs border rounded-md px-1.5 bg-background flex-1">
                <option>General</option><option>Semi-Private</option><option>Private</option><option>ICU</option>
              </select>
              <select value={admissionData.priority} onChange={e => setAdmissionData({ ...admissionData, priority: e.target.value })} className="h-7 text-xs border rounded-md px-1.5 bg-background flex-1">
                <option>Routine</option><option>Urgent</option><option>Emergency</option>
              </select>
            </div>
            <Input placeholder="Reason" value={admissionData.reason} onChange={e => setAdmissionData({ ...admissionData, reason: e.target.value })} className="h-7 text-xs" />
            <Button size="sm" className="h-7 text-xs w-full">Submit Admission Request</Button>
          </div>
        )}

        <button onClick={() => setShowReferral(!showReferral)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors text-left">
          <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" /> Refer to Specialist
        </button>
        {showReferral && (
          <div className="border rounded-lg p-3 space-y-2 bg-accent/30">
            <Input placeholder="Doctor name" value={referralData.doctor} onChange={e => setReferralData({ ...referralData, doctor: e.target.value })} className="h-7 text-xs" />
            <Input placeholder="Department" value={referralData.department} onChange={e => setReferralData({ ...referralData, department: e.target.value })} className="h-7 text-xs" />
            <Input placeholder="Referral reason" value={referralData.reason} onChange={e => setReferralData({ ...referralData, reason: e.target.value })} className="h-7 text-xs" />
            <Button size="sm" className="h-7 text-xs w-full">Create Referral</Button>
          </div>
        )}

        <button onClick={() => setShowCertificate(!showCertificate)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-accent transition-colors text-left">
          <Award className="w-3.5 h-3.5 text-muted-foreground" /> Issue Certificate
        </button>
        {showCertificate && (
          <div className="border rounded-lg p-3 space-y-2 bg-accent/30">
            <select value={certificateType} onChange={e => setCertificateType(e.target.value)} className="h-7 text-xs border rounded-md px-1.5 bg-background w-full">
              <option value="medical-leave">Medical Leave Certificate</option>
              <option value="fitness">Fitness Certificate</option>
              <option value="illness">Illness Certificate</option>
              <option value="fitness-to-work">Fitness to Work</option>
            </select>
            <Button size="sm" className="h-7 text-xs w-full">Generate Certificate</Button>
          </div>
        )}
      </div>

      {/* Save Actions */}
      <div className="space-y-2 pt-2">
        <Button size="sm" className="w-full bg-foreground text-background hover:bg-foreground/90" onClick={onSave}>
          Save & Print Prescription
        </Button>
        <Button variant="outline" size="sm" className="w-full" onClick={onDraft}>
          Save Draft
        </Button>
      </div>
    </div>
  );
}
