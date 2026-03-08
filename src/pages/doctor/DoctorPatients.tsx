import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ChevronRight, Phone, MapPin, Calendar, FileText, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  uhid: string;
  lastVisit: string;
  diagnosis: string;
  status: 'active' | 'discharged' | 'follow-up' | 'critical';
  bloodGroup: string;
  city: string;
  visits: number;
}

const patients: Patient[] = [
  { id: '1', name: 'Rajesh Kumar', age: 45, gender: 'M', phone: '+91 98765 43210', uhid: 'UHID-10234', lastVisit: '08 Mar 2026', diagnosis: 'Type 2 Diabetes Mellitus', status: 'active', bloodGroup: 'B+', city: 'Mumbai', visits: 12 },
  { id: '2', name: 'Priya Sharma', age: 32, gender: 'F', phone: '+91 87654 32109', uhid: 'UHID-10235', lastVisit: '07 Mar 2026', diagnosis: 'Hypothyroidism', status: 'follow-up', bloodGroup: 'A+', city: 'Delhi', visits: 5 },
  { id: '3', name: 'Amit Singh', age: 58, gender: 'M', phone: '+91 76543 21098', uhid: 'UHID-10236', lastVisit: '06 Mar 2026', diagnosis: 'Hypertension Stage 2', status: 'active', bloodGroup: 'O+', city: 'Pune', visits: 18 },
  { id: '4', name: 'Sunita Devi', age: 41, gender: 'F', phone: '+91 65432 10987', uhid: 'UHID-10237', lastVisit: '05 Mar 2026', diagnosis: 'Chronic Kidney Disease', status: 'critical', bloodGroup: 'AB+', city: 'Jaipur', visits: 8 },
  { id: '5', name: 'Mohammed Ali', age: 67, gender: 'M', phone: '+91 54321 09876', uhid: 'UHID-10238', lastVisit: '04 Mar 2026', diagnosis: 'COPD with Acute Exacerbation', status: 'critical', bloodGroup: 'B-', city: 'Hyderabad', visits: 22 },
  { id: '6', name: 'Kavita Reddy', age: 29, gender: 'F', phone: '+91 43210 98765', uhid: 'UHID-10239', lastVisit: '03 Mar 2026', diagnosis: 'Iron Deficiency Anemia', status: 'follow-up', bloodGroup: 'O-', city: 'Chennai', visits: 3 },
  { id: '7', name: 'Suresh Patel', age: 53, gender: 'M', phone: '+91 32109 87654', uhid: 'UHID-10240', lastVisit: '02 Mar 2026', diagnosis: 'Coronary Artery Disease', status: 'active', bloodGroup: 'A-', city: 'Ahmedabad', visits: 15 },
  { id: '8', name: 'Anita Gupta', age: 38, gender: 'F', phone: '+91 21098 76543', uhid: 'UHID-10241', lastVisit: '01 Mar 2026', diagnosis: 'Migraine with Aura', status: 'discharged', bloodGroup: 'AB-', city: 'Kolkata', visits: 6 },
  { id: '9', name: 'Deepak Verma', age: 49, gender: 'M', phone: '+91 10987 65432', uhid: 'UHID-10242', lastVisit: '28 Feb 2026', diagnosis: 'Lumbar Disc Herniation', status: 'discharged', bloodGroup: 'B+', city: 'Lucknow', visits: 9 },
  { id: '10', name: 'Lakshmi Nair', age: 62, gender: 'F', phone: '+91 09876 54321', uhid: 'UHID-10243', lastVisit: '27 Feb 2026', diagnosis: 'Osteoarthritis Bilateral Knee', status: 'follow-up', bloodGroup: 'O+', city: 'Kochi', visits: 14 },
];

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  'follow-up': 'bg-blue-500/10 text-blue-600',
  critical: 'bg-destructive/10 text-destructive',
  discharged: 'bg-muted text-muted-foreground',
};

const filterOptions = ['All', 'Active', 'Follow-up', 'Critical', 'Discharged'];

export default function DoctorPatients() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter.toLowerCase().replace('-', '-');
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">{patients.length} patients under your care</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Patient
        </Button>
      </motion.div>

      {/* Search & Filters */}
      <motion.div {...fadeIn(1)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, UHID, or diagnosis..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Patient List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List */}
        <motion.div {...fadeIn(2)} className="lg:col-span-2 border rounded-xl bg-card overflow-hidden">
          <div className="divide-y">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors cursor-pointer ${
                  selectedPatient?.id === p.id ? 'bg-accent/70' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">{p.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <span className="text-[10px] font-mono text-muted-foreground">{p.uhid}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {p.age}y/{p.gender} · {p.diagnosis}
                  </p>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyles[p.status]}`}>
                    {p.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">No patients match your search.</div>
            )}
          </div>
        </motion.div>

        {/* Detail Panel */}
        <motion.div {...fadeIn(3)} className="border rounded-xl bg-card">
          {selectedPatient ? (
            <div className="p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-bold">{selectedPatient.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedPatient.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedPatient.uhid} · {selectedPatient.bloodGroup}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Full Record</DropdownMenuItem>
                    <DropdownMenuItem>Write Prescription</DropdownMenuItem>
                    <DropdownMenuItem>Order Lab Test</DropdownMenuItem>
                    <DropdownMenuItem>Refer Patient</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Age / Gender</p>
                  <p className="text-sm font-semibold">{selectedPatient.age}y / {selectedPatient.gender === 'M' ? 'Male' : 'Female'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Blood Group</p>
                  <p className="text-sm font-semibold">{selectedPatient.bloodGroup}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Total Visits</p>
                  <p className="text-sm font-semibold">{selectedPatient.visits}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Status</p>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyles[selectedPatient.status]}`}>
                    {selectedPatient.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" /> {selectedPatient.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" /> {selectedPatient.city}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" /> Last visit: {selectedPatient.lastVisit}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Current Diagnosis</p>
                <p className="text-sm font-medium">{selectedPatient.diagnosis}</p>
              </div>

              <div className="space-y-2">
                <Button size="sm" className="w-full gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Write Prescription
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <FlaskConical className="w-3 h-3" /> Order Lab
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="w-3 h-3" /> Schedule
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Select a patient</p>
              <p className="text-xs text-muted-foreground mt-1">Click on a patient to view details</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function FlaskConical(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>
}
