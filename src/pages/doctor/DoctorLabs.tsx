import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FlaskConical, CheckCircle2, Clock, AlertTriangle, FileText, Download, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface LabOrder {
  id: string;
  patient: string;
  uhid: string;
  test: string;
  category: string;
  orderedAt: string;
  status: 'pending' | 'sample-collected' | 'processing' | 'completed' | 'critical';
  priority: 'routine' | 'urgent' | 'stat';
  results?: { param: string; value: string; unit: string; range: string; flag: 'normal' | 'high' | 'low' | 'critical' }[];
}

const labOrders: LabOrder[] = [
  {
    id: 'LAB-4521', patient: 'Rajesh Kumar', uhid: 'UHID-10234', test: 'Complete Blood Count', category: 'Hematology',
    orderedAt: '08 Mar, 09:15 AM', status: 'completed', priority: 'routine',
    results: [
      { param: 'Hemoglobin', value: '13.2', unit: 'g/dL', range: '13.0-17.0', flag: 'normal' },
      { param: 'WBC', value: '12400', unit: '/μL', range: '4000-11000', flag: 'high' },
      { param: 'Platelets', value: '245000', unit: '/μL', range: '150000-400000', flag: 'normal' },
      { param: 'RBC', value: '4.8', unit: 'M/μL', range: '4.5-5.5', flag: 'normal' },
      { param: 'ESR', value: '28', unit: 'mm/hr', range: '0-20', flag: 'high' },
    ],
  },
  {
    id: 'LAB-4522', patient: 'Priya Sharma', uhid: 'UHID-10235', test: 'Lipid Profile', category: 'Biochemistry',
    orderedAt: '08 Mar, 09:30 AM', status: 'completed', priority: 'routine',
    results: [
      { param: 'Total Cholesterol', value: '242', unit: 'mg/dL', range: '<200', flag: 'high' },
      { param: 'LDL', value: '168', unit: 'mg/dL', range: '<100', flag: 'high' },
      { param: 'HDL', value: '42', unit: 'mg/dL', range: '>40', flag: 'normal' },
      { param: 'Triglycerides', value: '186', unit: 'mg/dL', range: '<150', flag: 'high' },
    ],
  },
  {
    id: 'LAB-4523', patient: 'Amit Singh', uhid: 'UHID-10236', test: 'HbA1c + Fasting Blood Sugar', category: 'Biochemistry',
    orderedAt: '08 Mar, 10:00 AM', status: 'processing', priority: 'urgent',
  },
  {
    id: 'LAB-4524', patient: 'Sunita Devi', uhid: 'UHID-10237', test: 'Thyroid Panel (T3, T4, TSH)', category: 'Endocrinology',
    orderedAt: '08 Mar, 10:15 AM', status: 'sample-collected', priority: 'routine',
  },
  {
    id: 'LAB-4525', patient: 'Mohammed Ali', uhid: 'UHID-10238', test: 'Renal Function Test', category: 'Biochemistry',
    orderedAt: '08 Mar, 10:30 AM', status: 'critical', priority: 'stat',
    results: [
      { param: 'Creatinine', value: '4.2', unit: 'mg/dL', range: '0.7-1.3', flag: 'critical' },
      { param: 'BUN', value: '68', unit: 'mg/dL', range: '7-20', flag: 'critical' },
      { param: 'eGFR', value: '14', unit: 'mL/min', range: '>60', flag: 'critical' },
      { param: 'Potassium', value: '5.8', unit: 'mEq/L', range: '3.5-5.0', flag: 'high' },
    ],
  },
  {
    id: 'LAB-4526', patient: 'Kavita Reddy', uhid: 'UHID-10239', test: 'Iron Studies', category: 'Hematology',
    orderedAt: '08 Mar, 11:00 AM', status: 'pending', priority: 'routine',
  },
  {
    id: 'LAB-4527', patient: 'Suresh Patel', uhid: 'UHID-10240', test: 'Troponin I + CK-MB', category: 'Cardiology',
    orderedAt: '08 Mar, 11:15 AM', status: 'processing', priority: 'stat',
  },
  {
    id: 'LAB-4528', patient: 'Deepak Verma', uhid: 'UHID-10242', test: 'Liver Function Test', category: 'Biochemistry',
    orderedAt: '07 Mar, 03:00 PM', status: 'completed', priority: 'routine',
    results: [
      { param: 'SGPT (ALT)', value: '42', unit: 'U/L', range: '7-56', flag: 'normal' },
      { param: 'SGOT (AST)', value: '38', unit: 'U/L', range: '10-40', flag: 'normal' },
      { param: 'Bilirubin (Total)', value: '0.9', unit: 'mg/dL', range: '0.1-1.2', flag: 'normal' },
      { param: 'Albumin', value: '4.1', unit: 'g/dL', range: '3.5-5.5', flag: 'normal' },
    ],
  },
];

const statusStyle: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  'sample-collected': 'bg-blue-500/10 text-blue-600',
  processing: 'bg-amber-500/10 text-amber-600',
  completed: 'bg-emerald-500/10 text-emerald-600',
  critical: 'bg-destructive/10 text-destructive',
};

const priorityStyle: Record<string, string> = {
  routine: 'text-muted-foreground',
  urgent: 'text-amber-600',
  stat: 'text-destructive font-bold',
};

const flagStyle: Record<string, string> = {
  normal: 'text-foreground',
  high: 'text-destructive font-semibold',
  low: 'text-blue-600 font-semibold',
  critical: 'text-destructive font-bold bg-destructive/10 px-1 rounded',
};

const filters = ['All', 'Pending', 'Processing', 'Completed', 'Critical'];

export default function DoctorLabs() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedLab, setSelectedLab] = useState<LabOrder | null>(labOrders[0]);

  const filtered = labOrders.filter(l => {
    const matchSearch = l.patient.toLowerCase().includes(search.toLowerCase()) ||
      l.test.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || l.status === filter.toLowerCase().replace(' ', '-');
    return matchSearch && matchFilter;
  });

  const summary = {
    total: labOrders.length,
    pending: labOrders.filter(l => l.status === 'pending' || l.status === 'sample-collected').length,
    processing: labOrders.filter(l => l.status === 'processing').length,
    completed: labOrders.filter(l => l.status === 'completed').length,
    critical: labOrders.filter(l => l.status === 'critical').length,
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Orders & Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Track investigations and review reports</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <FlaskConical className="w-3.5 h-3.5" /> New Lab Order
        </Button>
      </motion.div>

      {/* Summary */}
      <motion.div {...fadeIn(1)} className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Orders', value: summary.total, color: '' },
          { label: 'Pending', value: summary.pending, color: 'text-blue-600' },
          { label: 'Processing', value: summary.processing, color: 'text-amber-600' },
          { label: 'Completed', value: summary.completed, color: 'text-emerald-600' },
          { label: 'Critical', value: summary.critical, color: 'text-destructive' },
        ].map(s => (
          <div key={s.label} className="border rounded-xl p-4 bg-card text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <motion.div {...fadeIn(2)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient, test, or lab ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders List */}
        <motion.div {...fadeIn(3)} className="lg:col-span-1 border rounded-xl bg-card overflow-hidden">
          <div className="divide-y max-h-[650px] overflow-y-auto">
            {filtered.map(lab => (
              <div key={lab.id} onClick={() => setSelectedLab(lab)}
                className={`px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer ${selectedLab?.id === lab.id ? 'bg-accent/70' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-semibold text-muted-foreground">{lab.id}</span>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${statusStyle[lab.status]}`}>
                    {lab.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-xs font-semibold">{lab.patient}</p>
                <p className="text-[11px] text-muted-foreground">{lab.test}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">{lab.orderedAt}</span>
                  <span className={`text-[10px] uppercase ${priorityStyle[lab.priority]}`}>{lab.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Result Detail */}
        <motion.div {...fadeIn(4)} className="lg:col-span-2 border rounded-xl bg-card">
          {selectedLab ? (
            <div className="p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{selectedLab.test}</h3>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${statusStyle[selectedLab.status]}`}>
                      {selectedLab.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedLab.patient} · {selectedLab.uhid} · {selectedLab.category}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Ordered: {selectedLab.orderedAt} · Priority: <span className={priorityStyle[selectedLab.priority]}>{selectedLab.priority.toUpperCase()}</span></p>
                </div>
                {selectedLab.results && (
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" className="gap-1 text-xs h-7"><Eye className="w-3 h-3" /> View PDF</Button>
                    <Button variant="outline" size="sm" className="gap-1 text-xs h-7"><Download className="w-3 h-3" /> Download</Button>
                  </div>
                )}
              </div>

              {selectedLab.results ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Parameter</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Result</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Unit</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Ref. Range</th>
                        <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedLab.results.map(r => (
                        <tr key={r.param} className="hover:bg-accent/30 transition-colors">
                          <td className="py-2.5 px-3 font-medium">{r.param}</td>
                          <td className={`py-2.5 px-3 ${flagStyle[r.flag]}`}>{r.value}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{r.unit}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{r.range}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] font-semibold uppercase ${flagStyle[r.flag]}`}>
                              {r.flag === 'normal' ? '✓ Normal' : r.flag === 'critical' ? '⚠ CRITICAL' : `↑ ${r.flag.toUpperCase()}`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Clock className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">Results Pending</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedLab.status === 'pending' ? 'Sample not yet collected' :
                      selectedLab.status === 'sample-collected' ? 'Sample collected, awaiting processing' :
                        'Test in progress, results expected soon'}
                  </p>
                </div>
              )}

              {selectedLab.results && (
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Add to Case Notes
                  </Button>
                  <Button variant="outline" size="sm">Reorder Test</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <FlaskConical className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Select a lab order</p>
              <p className="text-xs text-muted-foreground mt-1">Click on an order to view details</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
