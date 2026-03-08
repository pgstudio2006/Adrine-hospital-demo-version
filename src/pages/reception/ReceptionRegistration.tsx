import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, UserPlus, Phone, CreditCard, Shield, ChevronRight, X, Check, User, FileText,
  AlertTriangle, Upload, Stethoscope, MapPin, Globe, Heart, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Patient {
  uhid: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string;
  aadhaar?: string;
  registeredOn: string;
  lastVisit?: string;
  patientType: 'OPD' | 'IPD' | 'Emergency';
  bloodGroup?: string;
  referralSource?: string;
}

const existingPatients: Patient[] = [
  { uhid: 'UHID-240001', name: 'Rajesh Sharma', age: 45, gender: 'M', phone: '9876543210', abhaId: '91-1234-5678-9012', aadhaar: '•••• •••• 3210', registeredOn: '15 Jan 2025', lastVisit: '2 Mar 2026', patientType: 'OPD', bloodGroup: 'B+' },
  { uhid: 'UHID-240002', name: 'Priya Patel', age: 28, gender: 'F', phone: '9876543211', registeredOn: '22 Aug 2024', lastVisit: '28 Feb 2026', patientType: 'OPD' },
  { uhid: 'UHID-240003', name: 'Amit Kumar', age: 62, gender: 'M', phone: '9876543212', abhaId: '91-2345-6789-0123', aadhaar: '•••• •••• 5432', registeredOn: '10 Jun 2024', lastVisit: '1 Mar 2026', patientType: 'IPD', bloodGroup: 'O+' },
  { uhid: 'UHID-240004', name: 'Sunita Devi', age: 55, gender: 'F', phone: '9876543213', registeredOn: '3 Mar 2024', patientType: 'OPD' },
  { uhid: 'UHID-240005', name: 'Vikram Singh', age: 38, gender: 'M', phone: '9876543214', abhaId: '91-3456-7890-1234', registeredOn: '11 Oct 2024', lastVisit: '5 Mar 2026', patientType: 'Emergency', bloodGroup: 'A+' },
  { uhid: 'UHID-240006', name: 'Neha Gupta', age: 32, gender: 'F', phone: '9876543215', registeredOn: '20 Dec 2025', lastVisit: '6 Mar 2026', patientType: 'OPD', bloodGroup: 'AB+' },
  { uhid: 'UHID-240007', name: 'Arjun Reddy', age: 50, gender: 'M', phone: '9876543216', abhaId: '91-4567-8901-2345', registeredOn: '5 Nov 2024', patientType: 'OPD', bloodGroup: 'O-' },
  { uhid: 'UHID-240008', name: 'Fatima Khan', age: 41, gender: 'F', phone: '9876543217', registeredOn: '18 Feb 2026', lastVisit: '7 Mar 2026', patientType: 'IPD' },
];

const STEPS = [
  { label: 'Patient Info', icon: User },
  { label: 'Contact & Address', icon: MapPin },
  { label: 'Medical Info', icon: Heart },
  { label: 'ID & Insurance', icon: Shield },
  { label: 'Review & Confirm', icon: FileText },
];

const DEPARTMENTS = ['General Medicine', 'Cardiology', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Dermatology', 'ENT', 'Neurology', 'Ophthalmology', 'Urology'];
const DOCTORS = ['Dr. R. Mehta', 'Dr. S. Iyer', 'Dr. A. Shah', 'Dr. K. Rao', 'Dr. P. Nair', 'Dr. V. Reddy'];

export default function ReceptionRegistration() {
  const [mode, setMode] = useState<'list' | 'new' | 'emergency'>('list');
  const [search, setSearch] = useState('');
  const [step, setStep] = useState(0);
  const [searchBy, setSearchBy] = useState<'all' | 'uhid' | 'phone' | 'name' | 'aadhaar'>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal
    firstName: '', lastName: '', dob: '', gender: 'male', nationality: 'Indian',
    // Contact
    phone: '', altPhone: '', email: '', address: '', city: '', state: '', pin: '',
    emergencyContact: '', emergencyPhone: '', emergencyRelation: '',
    // Medical
    bloodGroup: '', allergies: '', chronicDiseases: '', disabilityStatus: 'none',
    patientType: 'OPD' as 'OPD' | 'IPD' | 'Emergency',
    // ID & Insurance
    abhaId: '', aadhaar: '', passportNo: '', govtIdType: '', govtIdNo: '',
    insuranceProvider: '', policyNo: '',
    // Referral
    referralSource: 'walk-in', referringDoctor: '', referringHospital: '',
    // Department
    department: '', assignedDoctor: '',
    // Documents
    documents: [] as { name: string; type: string }[],
  });

  // Emergency quick-form
  const [emergencyForm, setEmergencyForm] = useState({
    name: '', age: '', gender: 'male', emergencyType: '', arrivalMode: 'walk-in',
    triagePriority: 'urgent' as 'immediate' | 'urgent' | 'delayed',
    assignedDoctor: '', notes: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Duplicate detection
  const duplicateWarning = useMemo(() => {
    if (!formData.phone && !formData.aadhaar) return null;
    const match = existingPatients.find(p =>
      (formData.phone && p.phone === formData.phone) ||
      (formData.aadhaar && formData.aadhaar.length >= 4 && p.aadhaar?.includes(formData.aadhaar.slice(-4)))
    );
    return match ? match : null;
  }, [formData.phone, formData.aadhaar]);

  // Generate UHID
  const newUHID = `UHID-${(240000 + existingPatients.length + 1).toString()}`;

  // Age calculation from DOB
  const calculatedAge = formData.dob ? Math.floor((Date.now() - new Date(formData.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

  // Search filters
  const filtered = existingPatients.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (searchBy === 'uhid') return p.uhid.toLowerCase().includes(q);
    if (searchBy === 'phone') return p.phone.includes(search);
    if (searchBy === 'name') return p.name.toLowerCase().includes(q);
    if (searchBy === 'aadhaar') return p.aadhaar?.includes(search) ?? false;
    return p.name.toLowerCase().includes(q) || p.uhid.toLowerCase().includes(q) || p.phone.includes(search);
  });

  // Emergency Registration Mode
  if (mode === 'emergency') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Emergency Registration</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Fast-track registration with minimal required fields</p>
            </div>
          </div>
          <button onClick={() => setMode('list')} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>

        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Patient Name *</label>
              <input value={emergencyForm.name} onChange={e => setEmergencyForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Full name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Age *</label>
              <input value={emergencyForm.age} onChange={e => setEmergencyForm(f => ({ ...f, age: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Years" type="number" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Gender *</label>
              <div className="flex gap-2">
                {['male', 'female', 'other'].map(g => (
                  <button key={g} onClick={() => setEmergencyForm(f => ({ ...f, gender: g }))}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${emergencyForm.gender === g ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Emergency Type *</label>
              <select value={emergencyForm.emergencyType} onChange={e => setEmergencyForm(f => ({ ...f, emergencyType: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                <option value="">Select type</option>
                <option value="trauma">Trauma / Accident</option>
                <option value="cardiac">Cardiac Emergency</option>
                <option value="respiratory">Respiratory Distress</option>
                <option value="neurological">Neurological</option>
                <option value="poisoning">Poisoning</option>
                <option value="burns">Burns</option>
                <option value="obstetric">Obstetric Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mode of Arrival</label>
              <div className="flex gap-2">
                {[{ value: 'ambulance', label: 'Ambulance' }, { value: 'walk-in', label: 'Walk-in' }, { value: 'referred', label: 'Referred' }].map(m => (
                  <button key={m.value} onClick={() => setEmergencyForm(f => ({ ...f, arrivalMode: m.value }))}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${emergencyForm.arrivalMode === m.value ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Triage Priority *</label>
              <div className="flex gap-2">
                {[
                  { value: 'immediate', label: 'P1 – Immediate', color: 'bg-destructive text-destructive-foreground' },
                  { value: 'urgent', label: 'P2 – Urgent', color: 'bg-warning text-warning-foreground' },
                  { value: 'delayed', label: 'P3 – Delayed', color: 'bg-success text-success-foreground' },
                ].map(p => (
                  <button key={p.value} onClick={() => setEmergencyForm(f => ({ ...f, triagePriority: f.triagePriority === p.value ? f.triagePriority : p.value as any }))}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${emergencyForm.triagePriority === p.value ? p.color : 'bg-background hover:bg-accent'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Assigned Doctor</label>
              <select value={emergencyForm.assignedDoctor} onChange={e => setEmergencyForm(f => ({ ...f, assignedDoctor: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                <option value="">Auto-assign</option>
                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <textarea value={emergencyForm.notes} onChange={e => setEmergencyForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm" rows={2} placeholder="Brief description of emergency..." />
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setMode('list')} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button onClick={() => setMode('list')}
            className="px-6 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Register & Notify Emergency Dept
          </button>
        </div>
      </div>
    );
  }

  // New Registration Form
  if (mode === 'new') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Patient Registration</h1>
            <p className="text-sm text-muted-foreground mt-1">UHID: <span className="font-mono font-semibold text-foreground">{newUHID}</span> (auto-generated)</p>
          </div>
          <button onClick={() => { setMode('list'); setStep(0); }} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>

        {/* Duplicate Warning */}
        <AnimatePresence>
          {duplicateWarning && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border-2 border-warning/40 bg-warning/5 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-warning-foreground">Possible Duplicate Detected</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Patient <strong>{duplicateWarning.name}</strong> ({duplicateWarning.uhid}) has matching phone/Aadhaar.
                </p>
                <button className="text-xs text-primary font-medium mt-1 hover:underline">View existing record →</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stepper */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-1 flex-1">
                <button onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
                    i === step ? 'bg-primary text-primary-foreground' :
                    i < step ? 'bg-success/10 text-success cursor-pointer hover:bg-success/20' :
                    'bg-muted text-muted-foreground'
                  }`}>
                  {i < step ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span className="hidden lg:inline">{s.label}</span>
                  <span className="lg:hidden text-xs">{i + 1}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border bg-card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Patient Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">First Name *</label>
                  <input value={formData.firstName} onChange={e => updateField('firstName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Enter first name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Last Name *</label>
                  <input value={formData.lastName} onChange={e => updateField('lastName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Enter last name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date of Birth *</label>
                  <input type="date" value={formData.dob} onChange={e => updateField('dob', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                  {calculatedAge !== null && calculatedAge >= 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Age: {calculatedAge} years</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Gender *</label>
                  <div className="flex gap-2">
                    {['male', 'female', 'other'].map(g => (
                      <button key={g} onClick={() => updateField('gender', g)}
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${formData.gender === g ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nationality</label>
                  <input value={formData.nationality} onChange={e => updateField('nationality', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Patient Type *</label>
                  <div className="flex gap-2">
                    {(['OPD', 'IPD', 'Emergency'] as const).map(t => (
                      <button key={t} onClick={() => updateField('patientType', t)}
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${formData.patientType === t ? (t === 'Emergency' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground') : 'bg-background hover:bg-accent'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Referral */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3">Referral Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Referral Source</label>
                    <select value={formData.referralSource} onChange={e => updateField('referralSource', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                      <option value="walk-in">Walk-in</option>
                      <option value="doctor-referral">Doctor Referral</option>
                      <option value="hospital-referral">Hospital Referral</option>
                      <option value="online">Online Booking</option>
                      <option value="emergency">Emergency / 108</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Referring Doctor</label>
                    <input value={formData.referringDoctor} onChange={e => updateField('referringDoctor', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Doctor name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Referring Hospital</label>
                    <input value={formData.referringHospital} onChange={e => updateField('referringHospital', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Hospital name" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><Phone className="w-4 h-4" /> Contact & Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number *</label>
                  <input value={formData.phone} onChange={e => updateField('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="+91 XXXXX XXXXX" maxLength={10} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Alternate Phone</label>
                  <input value={formData.altPhone} onChange={e => updateField('altPhone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="+91" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="patient@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Address *</label>
                  <textarea value={formData.address} onChange={e => updateField('address', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" rows={2} placeholder="Full address" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <input value={formData.city} onChange={e => updateField('city', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State</label>
                  <select value={formData.state} onChange={e => updateField('state', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="">Select state</option>
                    {['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">PIN Code</label>
                  <input value={formData.pin} onChange={e => updateField('pin', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="6 digits" maxLength={6} />
                </div>
              </div>
              {/* Emergency Contact */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Contact Name</label>
                    <input value={formData.emergencyContact} onChange={e => updateField('emergencyContact', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <input value={formData.emergencyPhone} onChange={e => updateField('emergencyPhone', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Relation</label>
                    <select value={formData.emergencyRelation} onChange={e => updateField('emergencyRelation', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                      <option value="">Select</option>
                      {['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><Heart className="w-4 h-4" /> Medical Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Blood Group</label>
                  <select value={formData.bloodGroup} onChange={e => updateField('bloodGroup', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Disability Status</label>
                  <select value={formData.disabilityStatus} onChange={e => updateField('disabilityStatus', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="none">None</option>
                    <option value="visual">Visual Impairment</option>
                    <option value="hearing">Hearing Impairment</option>
                    <option value="locomotor">Locomotor Disability</option>
                    <option value="intellectual">Intellectual Disability</option>
                    <option value="multiple">Multiple Disabilities</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Department</label>
                  <select value={formData.department} onChange={e => updateField('department', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium mb-1 block">Known Allergies</label>
                  <textarea value={formData.allergies} onChange={e => updateField('allergies', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" rows={2} placeholder="e.g., Penicillin, Sulfa drugs, Peanuts..." />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium mb-1 block">Chronic Diseases</label>
                  <textarea value={formData.chronicDiseases} onChange={e => updateField('chronicDiseases', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" rows={2} placeholder="e.g., Diabetes, Hypertension, Asthma..." />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> ID & Insurance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ABHA */}
                <div className="sm:col-span-2 rounded-lg border border-dashed p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-info" />
                    <span className="text-sm font-semibold">ABHA (Ayushman Bharat Health Account)</span>
                  </div>
                  <input value={formData.abhaId} onChange={e => updateField('abhaId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="XX-XXXX-XXXX-XXXX" />
                  <p className="text-xs text-muted-foreground mt-1">Link patient's ABHA ID for digital health records</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Aadhaar Number</label>
                  <input value={formData.aadhaar} onChange={e => updateField('aadhaar', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="XXXX XXXX XXXX" maxLength={14} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Passport Number</label>
                  <input value={formData.passportNo} onChange={e => updateField('passportNo', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Government ID Type</label>
                  <select value={formData.govtIdType} onChange={e => updateField('govtIdType', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="">None</option>
                    <option value="voter">Voter ID</option>
                    <option value="driving">Driving License</option>
                    <option value="ration">Ration Card</option>
                    <option value="pan">PAN Card</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Government ID Number</label>
                  <input value={formData.govtIdNo} onChange={e => updateField('govtIdNo', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="ID number" />
                </div>
                {/* Insurance */}
                <div className="sm:col-span-2 border-t pt-4 mt-2">
                  <h3 className="text-sm font-semibold mb-3">Insurance Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Insurance Provider</label>
                      <select value={formData.insuranceProvider} onChange={e => updateField('insuranceProvider', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                        <option value="">None / Self-pay</option>
                        <option value="star">Star Health</option>
                        <option value="hdfc">HDFC ERGO</option>
                        <option value="icici">ICICI Lombard</option>
                        <option value="niva">Niva Bupa</option>
                        <option value="ayushman">Ayushman Bharat (PMJAY)</option>
                        <option value="cghs">CGHS</option>
                        <option value="esi">ESI</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Policy Number</label>
                      <input value={formData.policyNo} onChange={e => updateField('policyNo', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Policy / Card number" />
                    </div>
                  </div>
                </div>
                {/* Document Upload */}
                <div className="sm:col-span-2 border-t pt-4 mt-2">
                  <h3 className="text-sm font-semibold mb-3">Document Upload</h3>
                  <div className="rounded-lg border-2 border-dashed p-6 text-center hover:bg-accent/30 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Drop files or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">ID proofs, insurance cards, referral letters, medical records</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Review & Confirm</h2>
              <div className="bg-muted/30 rounded-lg px-4 py-2 text-sm">
                <span className="text-muted-foreground">UHID:</span> <span className="font-mono font-bold">{newUHID}</span>
                <span className="ml-4 text-muted-foreground">Type:</span> <span className={`font-semibold ${formData.patientType === 'Emergency' ? 'text-destructive' : ''}`}>{formData.patientType}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Personal</p>
                  <p className="text-sm"><span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p className="text-sm"><span className="text-muted-foreground">DOB:</span> {formData.dob || '—'} {calculatedAge !== null ? `(${calculatedAge}y)` : ''}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Gender:</span> {formData.gender}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Nationality:</span> {formData.nationality}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Contact</p>
                  <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {formData.phone || '—'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Email:</span> {formData.email || '—'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Address:</span> {formData.address || '—'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">City:</span> {formData.city} {formData.state} {formData.pin}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Medical</p>
                  <p className="text-sm"><span className="text-muted-foreground">Blood:</span> {formData.bloodGroup || '—'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Allergies:</span> {formData.allergies || 'None'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Chronic:</span> {formData.chronicDiseases || 'None'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Dept:</span> {formData.department || '—'}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-2 sm:col-span-2 lg:col-span-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ID & Insurance</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <p className="text-sm"><span className="text-muted-foreground">ABHA:</span> {formData.abhaId || 'Not linked'}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Aadhaar:</span> {formData.aadhaar || '—'}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Insurance:</span> {formData.insuranceProvider || 'Self-pay'}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Referral:</span> {formData.referralSource}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-30 hover:bg-accent transition-colors">
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Continue
            </button>
          ) : (
            <button onClick={() => { setMode('list'); setStep(0); }}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Check className="w-4 h-4" /> Register Patient
            </button>
          )}
        </div>
      </div>
    );
  }

  // Patient List (default)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">{existingPatients.length} registered patients</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode('emergency')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
            <AlertTriangle className="w-4 h-4" /> Emergency
          </button>
          <button onClick={() => setMode('new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <UserPlus className="w-4 h-4" /> New Patient
          </button>
        </div>
      </div>

      {/* Search with filters */}
      <div className="space-y-2">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'uhid', label: 'UHID' },
            { key: 'phone', label: 'Phone' },
            { key: 'name', label: 'Name' },
            { key: 'aadhaar', label: 'Aadhaar' },
          ].map(f => (
            <button key={f.key} onClick={() => setSearchBy(f.key as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${searchBy === f.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm"
            placeholder={`Search by ${searchBy === 'all' ? 'name, UHID, or phone' : searchBy}...`} />
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">ABHA / Aadhaar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(p => (
              <tr key={p.uhid} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedPatient(p)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.uhid} · {p.age}{p.gender} {p.bloodGroup ? `· ${p.bloodGroup}` : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{p.phone}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {p.abhaId ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-info/10 text-info">{p.abhaId}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not linked</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.patientType === 'Emergency' ? 'bg-destructive/10 text-destructive' :
                    p.patientType === 'IPD' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>{p.patientType}</span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{p.lastVisit || '—'}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded hover:bg-accent"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No patients found matching your search</div>
        )}
      </div>
    </div>
  );
}
