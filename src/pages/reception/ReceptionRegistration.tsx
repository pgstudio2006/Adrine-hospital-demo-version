import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Phone, CreditCard, Shield, ChevronRight, X, Check, User, FileText } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string;
  registeredOn: string;
  lastVisit?: string;
}

const existingPatients: Patient[] = [
  { id: 'P-2301', name: 'Rajesh Sharma', age: 45, gender: 'M', phone: '9876543210', abhaId: '91-1234-5678-9012', registeredOn: '15 Jan 2025', lastVisit: '2 Mar 2026' },
  { id: 'P-2145', name: 'Priya Patel', age: 28, gender: 'F', phone: '9876543211', registeredOn: '22 Aug 2024', lastVisit: '28 Feb 2026' },
  { id: 'P-2089', name: 'Amit Kumar', age: 62, gender: 'M', phone: '9876543212', abhaId: '91-2345-6789-0123', registeredOn: '10 Jun 2024', lastVisit: '1 Mar 2026' },
  { id: 'P-1956', name: 'Sunita Devi', age: 55, gender: 'F', phone: '9876543213', registeredOn: '3 Mar 2024' },
  { id: 'P-2210', name: 'Vikram Singh', age: 38, gender: 'M', phone: '9876543214', abhaId: '91-3456-7890-1234', registeredOn: '11 Oct 2024', lastVisit: '5 Mar 2026' },
];

const STEPS = ['Patient Info', 'Contact & Address', 'ID & Insurance', 'Review'];

export default function ReceptionRegistration() {
  const [mode, setMode] = useState<'list' | 'new'>('list');
  const [search, setSearch] = useState('');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: 'male', bloodGroup: '',
    phone: '', altPhone: '', email: '', address: '', city: '', state: '', pin: '',
    abhaId: '', aadhaar: '', insuranceProvider: '', policyNo: '', emergencyContact: '', emergencyPhone: '',
  });

  const filtered = existingPatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (mode === 'new') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Patient Registration</h1>
            <p className="text-sm text-muted-foreground mt-1">Complete all steps to register a new patient</p>
          </div>
          <button onClick={() => { setMode('list'); setStep(0); }} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
                i === step ? 'bg-primary text-primary-foreground' :
                i < step ? 'bg-success/10 text-success' :
                'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : <span className="w-4 h-4 flex items-center justify-center text-xs">{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border bg-card p-6"
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Patient Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">First Name *</label>
                  <input value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Enter first name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Last Name *</label>
                  <input value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Enter last name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date of Birth *</label>
                  <input type="date" value={formData.dob} onChange={e => updateField('dob', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
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
                  <label className="text-sm font-medium mb-1 block">Blood Group</label>
                  <select value={formData.bloodGroup} onChange={e => updateField('bloodGroup', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
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
                  <input value={formData.phone} onChange={e => updateField('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="+91" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Alternate Phone</label>
                  <input value={formData.altPhone} onChange={e => updateField('altPhone', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="+91" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="patient@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Address *</label>
                  <textarea value={formData.address} onChange={e => updateField('address', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" rows={2} placeholder="Full address" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <input value={formData.city} onChange={e => updateField('city', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State</label>
                  <input value={formData.state} onChange={e => updateField('state', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">PIN Code</label>
                  <input value={formData.pin} onChange={e => updateField('pin', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="6 digits" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Emergency Contact</label>
                  <input value={formData.emergencyContact} onChange={e => updateField('emergencyContact', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Emergency Phone</label>
                  <input value={formData.emergencyPhone} onChange={e => updateField('emergencyPhone', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="+91" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> ID & Insurance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 rounded-lg border border-dashed p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-info" />
                    <span className="text-sm font-semibold">ABHA (Ayushman Bharat Health Account)</span>
                  </div>
                  <input value={formData.abhaId} onChange={e => updateField('abhaId', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="XX-XXXX-XXXX-XXXX" />
                  <p className="text-xs text-muted-foreground mt-1">Link patient's ABHA ID for digital health records</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Aadhaar Number</label>
                  <input value={formData.aadhaar} onChange={e => updateField('aadhaar', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="XXXX XXXX XXXX" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Insurance Provider</label>
                  <select value={formData.insuranceProvider} onChange={e => updateField('insuranceProvider', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="">None / Self-pay</option>
                    <option value="star">Star Health</option>
                    <option value="hdfc">HDFC ERGO</option>
                    <option value="icici">ICICI Lombard</option>
                    <option value="niva">Niva Bupa</option>
                    <option value="ayushman">Ayushman Bharat (PMJAY)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Policy Number</label>
                  <input value={formData.policyNo} onChange={e => updateField('policyNo', e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Policy / Card number" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Review & Confirm</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Personal</p>
                  <p className="text-sm"><span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p className="text-sm"><span className="text-muted-foreground">DOB:</span> {formData.dob || '—'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Gender:</span> {formData.gender}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Blood:</span> {formData.bloodGroup || '—'}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Contact</p>
                  <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {formData.phone || '—'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Email:</span> {formData.email || '—'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Address:</span> {formData.address || '—'}, {formData.city} {formData.pin}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-2 sm:col-span-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Insurance & ID</p>
                  <p className="text-sm"><span className="text-muted-foreground">ABHA:</span> {formData.abhaId || 'Not linked'}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Insurance:</span> {formData.insuranceProvider || 'Self-pay'}</p>
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
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Register Patient
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">{existingPatients.length} registered patients</p>
        </div>
        <button onClick={() => setMode('new')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <UserPlus className="w-4 h-4" /> New Patient
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm"
          placeholder="Search by name, ID, or phone number..." />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">ABHA</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Registered</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.id} · {p.age}{p.gender}</p>
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
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{p.registeredOn}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{p.lastVisit || '—'}</td>
                <td className="px-4 py-3">
                  <button className="text-xs px-3 py-1.5 rounded-lg border hover:bg-accent transition-colors">Check-In</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
