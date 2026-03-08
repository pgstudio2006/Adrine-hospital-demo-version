import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, BedDouble, Clock, Activity, X, FileText, AlertTriangle } from 'lucide-react';

interface Admission {
  id: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  bed: string;
  ward: string;
  admittedOn: string;
  doctor: string;
  diagnosis: string;
  status: 'active' | 'discharge-pending' | 'discharged';
  condition: 'stable' | 'critical' | 'improving' | 'observation';
  admissionType: 'planned' | 'emergency' | 'transfer';
  insuranceStatus: 'verified' | 'pending' | 'self-pay';
  estimatedDischarge?: string;
  navigation: { department: string; roomNo: string; labDept?: string; radiologyDept?: string; pharmacyDept?: string };
}

const admissions: Admission[] = [
  { id: 'ADM-301', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', age: 45, gender: 'M', phone: '9876543210', bed: 'A-01', ward: 'General Ward A', admittedOn: '5 Mar 2026', doctor: 'Dr. R. Mehta', diagnosis: 'Pneumonia', status: 'active', condition: 'improving', admissionType: 'planned', insuranceStatus: 'verified', estimatedDischarge: '10 Mar', navigation: { department: 'Pulmonology', roomNo: 'Room 102', labDept: 'Lab Block B', pharmacyDept: 'Main Pharmacy' } },
  { id: 'ADM-302', uhid: 'UHID-240002', patientName: 'Priya Patel', age: 28, gender: 'F', phone: '9876543211', bed: 'A-03', ward: 'General Ward A', admittedOn: '6 Mar 2026', doctor: 'Dr. S. Iyer', diagnosis: 'Post-surgery recovery', status: 'active', condition: 'stable', admissionType: 'planned', insuranceStatus: 'self-pay', navigation: { department: 'Surgery', roomNo: 'Room 305' } },
  { id: 'ADM-303', uhid: 'UHID-240003', patientName: 'Amit Kumar', age: 62, gender: 'M', phone: '9876543212', bed: 'B-01', ward: 'General Ward B', admittedOn: '4 Mar 2026', doctor: 'Dr. R. Mehta', diagnosis: 'Cardiac monitoring', status: 'discharge-pending', condition: 'stable', admissionType: 'emergency', insuranceStatus: 'verified', estimatedDischarge: '8 Mar', navigation: { department: 'Cardiology', roomNo: 'Room 201', labDept: 'Lab Block A', radiologyDept: 'Radiology Wing' } },
  { id: 'ADM-304', uhid: 'UHID-240004', patientName: 'Sunita Devi', age: 55, gender: 'F', phone: '9876543213', bed: 'B-02', ward: 'General Ward B', admittedOn: '7 Mar 2026', doctor: 'Dr. K. Rao', diagnosis: 'Fracture - Femur', status: 'active', condition: 'observation', admissionType: 'emergency', insuranceStatus: 'pending', navigation: { department: 'Orthopedics', roomNo: 'Room 204', radiologyDept: 'Radiology Wing' } },
  { id: 'ADM-305', uhid: 'UHID-240005', patientName: 'Vikram Singh', age: 38, gender: 'M', phone: '9876543214', bed: 'ICU-01', ward: 'ICU', admittedOn: '3 Mar 2026', doctor: 'Dr. A. Shah', diagnosis: 'Sepsis', status: 'active', condition: 'critical', admissionType: 'emergency', insuranceStatus: 'verified', navigation: { department: 'ICU', roomNo: 'ICU Bay 1', labDept: 'ICU Lab', pharmacyDept: 'ICU Pharmacy' } },
  { id: 'ADM-306', uhid: 'UHID-240006', patientName: 'Neha Gupta', age: 32, gender: 'F', phone: '9876543215', bed: 'ICU-02', ward: 'ICU', admittedOn: '6 Mar 2026', doctor: 'Dr. P. Nair', diagnosis: 'Post-op ICU care', status: 'active', condition: 'improving', admissionType: 'transfer', insuranceStatus: 'self-pay', navigation: { department: 'ICU', roomNo: 'ICU Bay 2' } },
  { id: 'ADM-307', uhid: 'UHID-240007', patientName: 'Arjun Reddy', age: 50, gender: 'M', phone: '9876543216', bed: 'PVT-01', ward: 'Private Room', admittedOn: '7 Mar 2026', doctor: 'Dr. K. Rao', diagnosis: 'Knee replacement', status: 'active', condition: 'stable', admissionType: 'planned', insuranceStatus: 'verified', estimatedDischarge: '14 Mar', navigation: { department: 'Orthopedics', roomNo: 'Room 204', labDept: 'Lab Block A', pharmacyDept: 'Main Pharmacy' } },
];

const conditionStyles: Record<string, string> = {
  stable: 'bg-success/10 text-success',
  critical: 'bg-destructive/10 text-destructive',
  improving: 'bg-info/10 text-info',
  observation: 'bg-warning/10 text-warning',
};

const statusStyles: Record<string, string> = {
  active: 'bg-success/10 text-success',
  'discharge-pending': 'bg-warning/10 text-warning',
  discharged: 'bg-muted text-muted-foreground',
};

const admissionTypeStyles: Record<string, string> = {
  planned: 'bg-muted text-muted-foreground',
  emergency: 'bg-destructive/10 text-destructive',
  transfer: 'bg-info/10 text-info',
};

export default function ReceptionIPD() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);

  const filtered = admissions.filter(a => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search) || a.bed.includes(search) || a.uhid.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter || a.condition === filter;
    return matchSearch && matchFilter;
  });

  const activeCount = admissions.filter(a => a.status === 'active').length;
  const criticalCount = admissions.filter(a => a.condition === 'critical').length;
  const dischargePending = admissions.filter(a => a.status === 'discharge-pending').length;
  const emergencyAdmissions = admissions.filter(a => a.admissionType === 'emergency').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IPD Admissions</h1>
          <p className="text-sm text-muted-foreground mt-1">{activeCount} active · {criticalCount} critical · {dischargePending} discharge pending</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <UserPlus className="w-4 h-4" /> New Admission
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><Activity className="w-5 h-5 text-success" /></div>
          <div><p className="text-xl font-bold">{activeCount}</p><p className="text-xs text-muted-foreground">Active</p></div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
          <div><p className="text-xl font-bold">{criticalCount}</p><p className="text-xs text-muted-foreground">Critical</p></div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><Clock className="w-5 h-5 text-warning" /></div>
          <div><p className="text-xl font-bold">{dischargePending}</p><p className="text-xs text-muted-foreground">Discharge Pending</p></div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><Activity className="w-5 h-5 text-destructive" /></div>
          <div><p className="text-xl font-bold">{emergencyAdmissions}</p><p className="text-xs text-muted-foreground">Emergency</p></div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card text-sm" placeholder="Search by name, UHID, admission ID, or bed..." />
        </div>
        <div className="flex gap-1.5">
          {['all', 'active', 'critical', 'discharge-pending', 'observation'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f === 'all' ? 'All' : f === 'discharge-pending' ? 'Discharge Pending' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Admissions Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Bed / Ward</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Doctor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Type</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Condition</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Insurance</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a, i) => (
              <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedAdmission(a)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${a.condition === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-muted'}`}>
                      {a.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.patientName}</p>
                      <p className="text-xs text-muted-foreground">{a.id} · {a.uhid} · {a.age}{a.gender}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm">{a.bed}</span>
                    <span className="text-xs text-muted-foreground">· {a.ward}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{a.doctor}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${admissionTypeStyles[a.admissionType]}`}>{a.admissionType}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${conditionStyles[a.condition]}`}>{a.condition}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    a.insuranceStatus === 'verified' ? 'bg-success/10 text-success' :
                    a.insuranceStatus === 'pending' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>{a.insuranceStatus === 'self-pay' ? 'Self-pay' : a.insuranceStatus}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[a.status]}`}>
                    {a.status === 'discharge-pending' ? 'Discharge Pending' : a.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admission Detail Modal */}
      <AnimatePresence>
        {selectedAdmission && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedAdmission(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selectedAdmission.patientName}</h2>
                  <p className="text-xs text-muted-foreground">{selectedAdmission.id} · {selectedAdmission.uhid}</p>
                </div>
                <button onClick={() => setSelectedAdmission(null)} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${conditionStyles[selectedAdmission.condition]}`}>{selectedAdmission.condition}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${admissionTypeStyles[selectedAdmission.admissionType]}`}>{selectedAdmission.admissionType}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[selectedAdmission.status]}`}>{selectedAdmission.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Bed:</span> {selectedAdmission.bed} ({selectedAdmission.ward})</div>
                <div><span className="text-muted-foreground">Doctor:</span> {selectedAdmission.doctor}</div>
                <div><span className="text-muted-foreground">Diagnosis:</span> {selectedAdmission.diagnosis}</div>
                <div><span className="text-muted-foreground">Admitted:</span> {selectedAdmission.admittedOn}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selectedAdmission.phone}</div>
                <div><span className="text-muted-foreground">Insurance:</span> {selectedAdmission.insuranceStatus}</div>
                {selectedAdmission.estimatedDischarge && (
                  <div className="col-span-2"><span className="text-muted-foreground">Est. Discharge:</span> {selectedAdmission.estimatedDischarge}</div>
                )}
              </div>

              {/* Navigation Data */}
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Patient Navigation</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedAdmission.navigation.department}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Room</p>
                    <p className="font-medium">{selectedAdmission.navigation.roomNo}</p>
                  </div>
                  {selectedAdmission.navigation.labDept && (
                    <div className="rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Lab</p>
                      <p className="font-medium">{selectedAdmission.navigation.labDept}</p>
                    </div>
                  )}
                  {selectedAdmission.navigation.pharmacyDept && (
                    <div className="rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Pharmacy</p>
                      <p className="font-medium">{selectedAdmission.navigation.pharmacyDept}</p>
                    </div>
                  )}
                  {selectedAdmission.navigation.radiologyDept && (
                    <div className="rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Radiology</p>
                      <p className="font-medium">{selectedAdmission.navigation.radiologyDept}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent flex items-center justify-center gap-1">
                  <FileText className="w-4 h-4" /> View Records
                </button>
                {selectedAdmission.status === 'active' && (
                  <button className="flex-1 px-3 py-2 rounded-lg border border-warning/30 text-warning text-sm font-medium hover:bg-warning/10 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" /> Initiate Discharge
                  </button>
                )}
                {selectedAdmission.admissionType === 'emergency' && selectedAdmission.status === 'active' && (
                  <button className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-1">
                    Convert to IPD
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
