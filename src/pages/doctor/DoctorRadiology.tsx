import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Scan, Eye, Download, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

interface RadiologyOrder {
  id: string; patient: string; uhid: string; type: string; bodyPart: string;
  indication: string; orderedAt: string; priority: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'reported';
  findings?: string;
}

const orders: RadiologyOrder[] = [
  { id: 'RAD-1201', patient: 'Rajesh Kumar', uhid: 'UHID-10234', type: 'X-ray', bodyPart: 'Chest PA', indication: 'Persistent cough, R/O pneumonia', orderedAt: '08 Mar, 09:00 AM', priority: 'routine', status: 'reported', findings: 'Bilateral clear lung fields. No active infiltrates. Normal cardiac silhouette. No pleural effusion.' },
  { id: 'RAD-1202', patient: 'Mohammed Ali', uhid: 'UHID-10238', type: 'CT Scan', bodyPart: 'Chest HRCT', indication: 'COPD exacerbation, R/O pulmonary embolism', orderedAt: '08 Mar, 10:15 AM', priority: 'stat', status: 'completed', findings: 'Extensive emphysematous changes. No evidence of PE. Bilateral lower lobe consolidation suggestive of superimposed infection.' },
  { id: 'RAD-1203', patient: 'Sunita Devi', uhid: 'UHID-10237', type: 'Ultrasound', bodyPart: 'Abdomen + Pelvis', indication: 'Renal disease monitoring', orderedAt: '08 Mar, 11:00 AM', priority: 'routine', status: 'in-progress' },
  { id: 'RAD-1204', patient: 'Suresh Patel', uhid: 'UHID-10240', type: 'Echocardiography', bodyPart: '2D Echo + Doppler', indication: 'CAD follow-up, ejection fraction assessment', orderedAt: '08 Mar, 11:30 AM', priority: 'urgent', status: 'scheduled' },
  { id: 'RAD-1205', patient: 'Lakshmi Nair', uhid: 'UHID-10243', type: 'MRI', bodyPart: 'Knee Bilateral', indication: 'Osteoarthritis assessment, R/O meniscal tear', orderedAt: '07 Mar, 02:00 PM', priority: 'routine', status: 'reported', findings: 'Grade 3 osteoarthritis bilateral knees. Medial meniscus tear (Grade II) right knee. Small joint effusion bilateral.' },
  { id: 'RAD-1206', patient: 'Amit Singh', uhid: 'UHID-10236', type: 'X-ray', bodyPart: 'Lumbar Spine AP/Lat', indication: 'Chronic back pain', orderedAt: '07 Mar, 03:00 PM', priority: 'routine', status: 'pending' },
];

const statusStyle: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  scheduled: 'bg-blue-500/10 text-blue-600',
  'in-progress': 'bg-amber-500/10 text-amber-600',
  completed: 'bg-emerald-500/10 text-emerald-600',
  reported: 'bg-foreground/10 text-foreground',
};

const priorityStyle: Record<string, string> = {
  routine: 'text-muted-foreground',
  urgent: 'text-amber-600',
  stat: 'text-destructive font-bold',
};

const filters = ['All', 'Pending', 'In-progress', 'Completed', 'Reported'];

export default function DoctorRadiology() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<RadiologyOrder | null>(orders[0]);

  const filtered = orders.filter(o => {
    const matchSearch = o.patient.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || o.status === filter.toLowerCase().replace(' ', '-');
    return matchSearch && matchFilter;
  });

  const summary = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'scheduled').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    reported: orders.filter(o => o.status === 'reported' || o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Radiology Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track imaging requests and view reports</p>
        </div>
        <Button size="sm" className="gap-1.5"><Scan className="w-3.5 h-3.5" /> New Imaging Order</Button>
      </motion.div>

      <motion.div {...fadeIn(1)} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: summary.total, color: '' },
          { label: 'Pending', value: summary.pending, color: 'text-blue-600' },
          { label: 'In Progress', value: summary.inProgress, color: 'text-amber-600' },
          { label: 'Reported', value: summary.reported, color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="border rounded-xl p-4 bg-card text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div {...fadeIn(2)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient, order ID, or type..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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
        <motion.div {...fadeIn(3)} className="lg:col-span-1 border rounded-xl bg-card overflow-hidden">
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filtered.map(o => (
              <div key={o.id} onClick={() => setSelected(o)}
                className={`px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer ${selected?.id === o.id ? 'bg-accent/70' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-semibold text-muted-foreground">{o.id}</span>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${statusStyle[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-xs font-semibold">{o.patient}</p>
                <p className="text-[11px] text-muted-foreground">{o.type} — {o.bodyPart}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">{o.orderedAt}</span>
                  <span className={`text-[10px] uppercase ${priorityStyle[o.priority]}`}>{o.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeIn(4)} className="lg:col-span-2 border rounded-xl bg-card">
          {selected ? (
            <div className="p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{selected.type} — {selected.bodyPart}</h3>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${statusStyle[selected.status]}`}>{selected.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selected.patient} · {selected.uhid}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Ordered: {selected.orderedAt} · Priority: <span className={priorityStyle[selected.priority]}>{selected.priority.toUpperCase()}</span></p>
                  <p className="text-xs mt-2"><span className="text-muted-foreground">Indication:</span> {selected.indication}</p>
                </div>
                {selected.findings && (
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" className="gap-1 text-xs h-7"><Eye className="w-3 h-3" /> View Images</Button>
                    <Button variant="outline" size="sm" className="gap-1 text-xs h-7"><Download className="w-3 h-3" /> Download</Button>
                  </div>
                )}
              </div>

              {selected.findings ? (
                <div className="border rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Report Findings</p>
                  <p className="text-sm leading-relaxed">{selected.findings}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Clock className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">Report Pending</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selected.status === 'pending' ? 'Not yet scheduled' : selected.status === 'scheduled' ? 'Imaging scheduled' : 'Imaging in progress'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Scan className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Select an order</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
