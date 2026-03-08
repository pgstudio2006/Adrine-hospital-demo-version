import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BedDouble, Search, X, UserPlus, Activity, Clock, MapPin } from 'lucide-react';

interface Bed {
  id: string;
  ward: string;
  bedNo: string;
  floor: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  patient?: { name: string; uhid: string; admittedOn: string; diagnosis: string; doctor: string; condition: 'stable' | 'critical' | 'improving'; };
}

const beds: Bed[] = [
  { id: '1', ward: 'General Ward A', bedNo: 'A-01', floor: 'Ground Floor', status: 'occupied', patient: { name: 'Rajesh Sharma', uhid: 'UHID-240001', admittedOn: '5 Mar', diagnosis: 'Pneumonia', doctor: 'Dr. A. Shah', condition: 'improving' } },
  { id: '2', ward: 'General Ward A', bedNo: 'A-02', floor: 'Ground Floor', status: 'available' },
  { id: '3', ward: 'General Ward A', bedNo: 'A-03', floor: 'Ground Floor', status: 'occupied', patient: { name: 'Priya Patel', uhid: 'UHID-240002', admittedOn: '6 Mar', diagnosis: 'Post-surgery', doctor: 'Dr. S. Iyer', condition: 'stable' } },
  { id: '4', ward: 'General Ward A', bedNo: 'A-04', floor: 'Ground Floor', status: 'reserved' },
  { id: '5', ward: 'General Ward A', bedNo: 'A-05', floor: 'Ground Floor', status: 'available' },
  { id: '6', ward: 'General Ward A', bedNo: 'A-06', floor: 'Ground Floor', status: 'maintenance' },
  { id: '7', ward: 'General Ward B', bedNo: 'B-01', floor: '1st Floor', status: 'occupied', patient: { name: 'Amit Kumar', uhid: 'UHID-240003', admittedOn: '4 Mar', diagnosis: 'Cardiac monitoring', doctor: 'Dr. R. Mehta', condition: 'stable' } },
  { id: '8', ward: 'General Ward B', bedNo: 'B-02', floor: '1st Floor', status: 'occupied', patient: { name: 'Sunita Devi', uhid: 'UHID-240004', admittedOn: '7 Mar', diagnosis: 'Fracture - Femur', doctor: 'Dr. K. Rao', condition: 'improving' } },
  { id: '9', ward: 'General Ward B', bedNo: 'B-03', floor: '1st Floor', status: 'available' },
  { id: '10', ward: 'General Ward B', bedNo: 'B-04', floor: '1st Floor', status: 'available' },
  { id: '11', ward: 'ICU', bedNo: 'ICU-01', floor: '2nd Floor', status: 'occupied', patient: { name: 'Vikram Singh', uhid: 'UHID-240005', admittedOn: '3 Mar', diagnosis: 'Sepsis', doctor: 'Dr. A. Shah', condition: 'critical' } },
  { id: '12', ward: 'ICU', bedNo: 'ICU-02', floor: '2nd Floor', status: 'occupied', patient: { name: 'Neha Gupta', uhid: 'UHID-240006', admittedOn: '6 Mar', diagnosis: 'Post-op ICU care', doctor: 'Dr. P. Nair', condition: 'improving' } },
  { id: '13', ward: 'ICU', bedNo: 'ICU-03', floor: '2nd Floor', status: 'available' },
  { id: '14', ward: 'ICU', bedNo: 'ICU-04', floor: '2nd Floor', status: 'reserved' },
  { id: '15', ward: 'Private Room', bedNo: 'PVT-01', floor: '3rd Floor', status: 'occupied', patient: { name: 'Arjun Reddy', uhid: 'UHID-240007', admittedOn: '7 Mar', diagnosis: 'Knee replacement', doctor: 'Dr. K. Rao', condition: 'stable' } },
  { id: '16', ward: 'Private Room', bedNo: 'PVT-02', floor: '3rd Floor', status: 'available' },
  { id: '17', ward: 'Private Room', bedNo: 'PVT-03', floor: '3rd Floor', status: 'occupied', patient: { name: 'Fatima Khan', uhid: 'UHID-240008', admittedOn: '5 Mar', diagnosis: 'Cholecystectomy', doctor: 'Dr. S. Iyer', condition: 'stable' } },
  { id: '18', ward: 'Private Room', bedNo: 'PVT-04', floor: '3rd Floor', status: 'available' },
];

const statusColors: Record<string, { bg: string; label: string; dot: string }> = {
  available: { bg: 'border-success/40 bg-success/5', label: 'Available', dot: 'bg-success' },
  occupied: { bg: 'border-destructive/30 bg-destructive/5', label: 'Occupied', dot: 'bg-destructive' },
  reserved: { bg: 'border-warning/30 bg-warning/5', label: 'Reserved', dot: 'bg-warning' },
  maintenance: { bg: 'border-muted bg-muted/30', label: 'Maintenance', dot: 'bg-muted-foreground' },
};

const conditionStyles: Record<string, string> = {
  stable: 'bg-success/10 text-success',
  critical: 'bg-destructive/10 text-destructive',
  improving: 'bg-info/10 text-info',
};

export default function ReceptionBeds() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [showAdmission, setShowAdmission] = useState(false);

  const wards = [...new Set(beds.map(b => b.ward))];
  const counts = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    reserved: beds.filter(b => b.status === 'reserved').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  };

  const filteredBeds = beds.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const matchSearch = !search || b.bedNo.toLowerCase().includes(search.toLowerCase()) || b.patient?.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bed Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{counts.available} of {counts.total} beds available · {Math.round((counts.occupied / counts.total) * 100)}% occupancy</p>
        </div>
        <button onClick={() => setShowAdmission(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <UserPlus className="w-4 h-4" /> Admit Patient
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusColors).map(([status, config]) => (
          <div key={status} className={`rounded-xl border p-4 ${config.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>
            <p className="text-2xl font-bold">{counts[status as keyof typeof counts]}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card text-sm" placeholder="Search beds or patients..." />
        </div>
        <div className="flex gap-1.5">
          {['all', 'available', 'occupied', 'reserved', 'maintenance'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Ward Groups */}
      {wards.map(ward => {
        const wardBeds = filteredBeds.filter(b => b.ward === ward);
        if (wardBeds.length === 0) return null;
        const wardFloor = beds.find(b => b.ward === ward)?.floor;
        return (
          <div key={ward}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold">{ward}</h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {wardFloor}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {wardBeds.filter(b => b.status === 'available').length}/{wardBeds.length} available
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {wardBeds.map((bed, i) => (
                <motion.div key={bed.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedBed(bed)}
                  className={`rounded-xl border p-3 cursor-pointer hover:shadow-md transition-all ${statusColors[bed.status].bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">{bed.bedNo}</span>
                    <BedDouble className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {bed.patient ? (
                    <div>
                      <p className="text-xs font-medium truncate">{bed.patient.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{bed.patient.diagnosis}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">Since {bed.patient.admittedOn}</p>
                        <span className={`w-2 h-2 rounded-full ${
                          bed.patient.condition === 'critical' ? 'bg-destructive animate-pulse' :
                          bed.patient.condition === 'improving' ? 'bg-info' : 'bg-success'
                        }`} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">{statusColors[bed.status].label}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bed Detail Modal */}
      <AnimatePresence>
        {selectedBed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedBed(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border rounded-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColors[selectedBed.status].bg}`}>
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{selectedBed.bedNo}</h2>
                    <p className="text-xs text-muted-foreground">{selectedBed.ward} · {selectedBed.floor}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBed(null)} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
              </div>

              <div className={`text-sm px-3 py-2 rounded-lg ${statusColors[selectedBed.status].bg}`}>
                Status: <span className="font-semibold">{statusColors[selectedBed.status].label}</span>
              </div>

              {selectedBed.patient && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base">{selectedBed.patient.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${conditionStyles[selectedBed.patient.condition]}`}>{selectedBed.patient.condition}</span>
                  </div>
                  <p><span className="text-muted-foreground">UHID:</span> {selectedBed.patient.uhid}</p>
                  <p><span className="text-muted-foreground">Diagnosis:</span> {selectedBed.patient.diagnosis}</p>
                  <p><span className="text-muted-foreground">Doctor:</span> {selectedBed.patient.doctor}</p>
                  <p><span className="text-muted-foreground">Admitted:</span> {selectedBed.patient.admittedOn} 2026</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selectedBed.status === 'available' && (
                  <button className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-1">
                    <UserPlus className="w-4 h-4" /> Assign Patient
                  </button>
                )}
                {selectedBed.patient && (
                  <>
                    <button className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent flex items-center justify-center gap-1">
                      <Activity className="w-4 h-4" /> View Details
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" /> Discharge
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
