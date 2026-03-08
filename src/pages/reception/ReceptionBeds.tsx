import { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Search, Filter } from 'lucide-react';

interface Bed {
  id: string;
  ward: string;
  bedNo: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  patient?: { name: string; admittedOn: string; diagnosis: string };
}

const beds: Bed[] = [
  { id: '1', ward: 'General Ward A', bedNo: 'A-01', status: 'occupied', patient: { name: 'Rajesh Sharma', admittedOn: '5 Mar', diagnosis: 'Pneumonia' } },
  { id: '2', ward: 'General Ward A', bedNo: 'A-02', status: 'available' },
  { id: '3', ward: 'General Ward A', bedNo: 'A-03', status: 'occupied', patient: { name: 'Priya Patel', admittedOn: '6 Mar', diagnosis: 'Post-surgery recovery' } },
  { id: '4', ward: 'General Ward A', bedNo: 'A-04', status: 'reserved' },
  { id: '5', ward: 'General Ward A', bedNo: 'A-05', status: 'available' },
  { id: '6', ward: 'General Ward A', bedNo: 'A-06', status: 'maintenance' },
  { id: '7', ward: 'General Ward B', bedNo: 'B-01', status: 'occupied', patient: { name: 'Amit Kumar', admittedOn: '4 Mar', diagnosis: 'Cardiac monitoring' } },
  { id: '8', ward: 'General Ward B', bedNo: 'B-02', status: 'occupied', patient: { name: 'Sunita Devi', admittedOn: '7 Mar', diagnosis: 'Fracture - Femur' } },
  { id: '9', ward: 'General Ward B', bedNo: 'B-03', status: 'available' },
  { id: '10', ward: 'General Ward B', bedNo: 'B-04', status: 'available' },
  { id: '11', ward: 'ICU', bedNo: 'ICU-01', status: 'occupied', patient: { name: 'Vikram Singh', admittedOn: '3 Mar', diagnosis: 'Sepsis' } },
  { id: '12', ward: 'ICU', bedNo: 'ICU-02', status: 'occupied', patient: { name: 'Neha Gupta', admittedOn: '6 Mar', diagnosis: 'Post-op ICU care' } },
  { id: '13', ward: 'ICU', bedNo: 'ICU-03', status: 'available' },
  { id: '14', ward: 'ICU', bedNo: 'ICU-04', status: 'reserved' },
  { id: '15', ward: 'Private Room', bedNo: 'PVT-01', status: 'occupied', patient: { name: 'Arjun Reddy', admittedOn: '7 Mar', diagnosis: 'Knee replacement' } },
  { id: '16', ward: 'Private Room', bedNo: 'PVT-02', status: 'available' },
  { id: '17', ward: 'Private Room', bedNo: 'PVT-03', status: 'occupied', patient: { name: 'Fatima Khan', admittedOn: '5 Mar', diagnosis: 'Cholecystectomy' } },
  { id: '18', ward: 'Private Room', bedNo: 'PVT-04', status: 'available' },
];

const statusColors: Record<string, { bg: string; label: string }> = {
  available: { bg: 'border-success/40 bg-success/5', label: 'Available' },
  occupied: { bg: 'border-destructive/30 bg-destructive/5', label: 'Occupied' },
  reserved: { bg: 'border-warning/30 bg-warning/5', label: 'Reserved' },
  maintenance: { bg: 'border-muted bg-muted/30', label: 'Maintenance' },
};

export default function ReceptionBeds() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bed Management</h1>
        <p className="text-sm text-muted-foreground mt-1">{counts.available} of {counts.total} beds available · {Math.round((counts.occupied / counts.total) * 100)}% occupancy</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusColors).map(([status, config]) => (
          <div key={status} className={`rounded-xl border p-4 text-center ${config.bg}`}>
            <p className="text-2xl font-bold">{counts[status as keyof typeof counts]}</p>
            <p className="text-xs text-muted-foreground">{config.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card text-sm" placeholder="Search beds..." />
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
        return (
          <div key={ward}>
            <h2 className="font-semibold mb-3">{ward}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {wardBeds.map((bed, i) => (
                <motion.div key={bed.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                  className={`rounded-xl border p-3 cursor-pointer hover:shadow-md transition-all ${statusColors[bed.status].bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">{bed.bedNo}</span>
                    <BedDouble className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {bed.patient ? (
                    <div>
                      <p className="text-xs font-medium truncate">{bed.patient.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{bed.patient.diagnosis}</p>
                      <p className="text-xs text-muted-foreground mt-1">Since {bed.patient.admittedOn}</p>
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
    </div>
  );
}
