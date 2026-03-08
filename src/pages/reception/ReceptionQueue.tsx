import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Users, Clock, AlertTriangle, SkipForward, ArrowRightLeft, X } from 'lucide-react';

type TokenStatus = 'waiting' | 'called' | 'in-consultation' | 'completed' | 'skipped' | 'cancelled';

interface QueueEntry {
  tokenNo: number;
  uhid: string;
  patientName: string;
  doctor: string;
  doctorId: string;
  department: string;
  status: TokenStatus;
  waitTime: string;
  checkedInAt: string;
  tokenIssueTime: string;
}

const queues: Record<string, QueueEntry[]> = {
  'General Medicine': [
    { tokenNo: 101, uhid: 'UHID-240001', patientName: 'Rajesh Sharma', doctor: 'Dr. A. Shah', doctorId: 'D001', department: 'General Medicine', status: 'completed', waitTime: '0 min', checkedInAt: '08:45 AM', tokenIssueTime: '08:46 AM' },
    { tokenNo: 102, uhid: 'UHID-240002', patientName: 'Priya Patel', doctor: 'Dr. A. Shah', doctorId: 'D001', department: 'General Medicine', status: 'in-consultation', waitTime: '12 min', checkedInAt: '09:10 AM', tokenIssueTime: '09:11 AM' },
    { tokenNo: 103, uhid: 'UHID-240003', patientName: 'Amit Kumar', doctor: 'Dr. A. Shah', doctorId: 'D001', department: 'General Medicine', status: 'called', waitTime: '25 min', checkedInAt: '09:30 AM', tokenIssueTime: '09:31 AM' },
    { tokenNo: 104, uhid: 'UHID-240004', patientName: 'Sunita Devi', doctor: 'Dr. A. Shah', doctorId: 'D001', department: 'General Medicine', status: 'waiting', waitTime: '35 min', checkedInAt: '09:45 AM', tokenIssueTime: '09:46 AM' },
    { tokenNo: 105, uhid: 'UHID-240005', patientName: 'Vikram Singh', doctor: 'Dr. V. Reddy', doctorId: 'D002', department: 'General Medicine', status: 'waiting', waitTime: '40 min', checkedInAt: '09:55 AM', tokenIssueTime: '09:56 AM' },
    { tokenNo: 106, uhid: 'UHID-240006', patientName: 'Neha Gupta', doctor: 'Dr. V. Reddy', doctorId: 'D002', department: 'General Medicine', status: 'skipped', waitTime: '—', checkedInAt: '09:20 AM', tokenIssueTime: '09:21 AM' },
  ],
  'Cardiology': [
    { tokenNo: 201, uhid: 'UHID-240007', patientName: 'Arjun Reddy', doctor: 'Dr. R. Mehta', doctorId: 'D003', department: 'Cardiology', status: 'in-consultation', waitTime: '5 min', checkedInAt: '09:00 AM', tokenIssueTime: '09:01 AM' },
    { tokenNo: 202, uhid: 'UHID-240008', patientName: 'Fatima Khan', doctor: 'Dr. R. Mehta', doctorId: 'D003', department: 'Cardiology', status: 'called', waitTime: '18 min', checkedInAt: '09:20 AM', tokenIssueTime: '09:21 AM' },
    { tokenNo: 203, uhid: 'UHID-240001', patientName: 'Rajesh Sharma', doctor: 'Dr. R. Mehta', doctorId: 'D003', department: 'Cardiology', status: 'waiting', waitTime: '30 min', checkedInAt: '09:40 AM', tokenIssueTime: '09:41 AM' },
  ],
  'Orthopedics': [
    { tokenNo: 301, uhid: 'UHID-240003', patientName: 'Amit Kumar', doctor: 'Dr. K. Rao', doctorId: 'D004', department: 'Orthopedics', status: 'completed', waitTime: '0 min', checkedInAt: '08:30 AM', tokenIssueTime: '08:31 AM' },
    { tokenNo: 302, uhid: 'UHID-240004', patientName: 'Sunita Devi', doctor: 'Dr. K. Rao', doctorId: 'D004', department: 'Orthopedics', status: 'in-consultation', waitTime: '8 min', checkedInAt: '09:15 AM', tokenIssueTime: '09:16 AM' },
    { tokenNo: 303, uhid: 'UHID-240005', patientName: 'Vikram Singh', doctor: 'Dr. K. Rao', doctorId: 'D004', department: 'Orthopedics', status: 'waiting', waitTime: '22 min', checkedInAt: '09:35 AM', tokenIssueTime: '09:36 AM' },
    { tokenNo: 304, uhid: 'UHID-240002', patientName: 'Priya Patel', doctor: 'Dr. K. Rao', doctorId: 'D004', department: 'Orthopedics', status: 'cancelled', waitTime: '—', checkedInAt: '09:50 AM', tokenIssueTime: '09:51 AM' },
  ],
};

const statusStyles: Record<TokenStatus, string> = {
  'in-consultation': 'bg-success/10 text-success border-success/30',
  called: 'bg-primary/10 text-primary border-primary/30',
  waiting: 'bg-muted text-muted-foreground border-border',
  completed: 'bg-muted/50 text-muted-foreground border-border opacity-50',
  skipped: 'bg-warning/10 text-warning border-warning/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30 line-through opacity-60',
};

const statusLabels: Record<TokenStatus, string> = {
  'in-consultation': '🟢 In Consultation',
  called: '🔵 Called',
  waiting: 'Waiting',
  completed: 'Completed',
  skipped: '⚠️ Skipped',
  cancelled: 'Cancelled',
};

export default function ReceptionQueue() {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [tvMode, setTvMode] = useState(false);
  const departments = Object.keys(queues);

  const allEntries = Object.values(queues).flat();
  const totalWaiting = allEntries.filter(q => q.status === 'waiting' || q.status === 'called').length;
  const totalInConsultation = allEntries.filter(q => q.status === 'in-consultation').length;
  const totalSkipped = allEntries.filter(q => q.status === 'skipped').length;
  const avgWait = '22 min';

  // TV Display Mode
  if (tvMode) {
    return (
      <div className="fixed inset-0 bg-background z-50 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">OPD Queue Display</h1>
          <button onClick={() => setTvMode(false)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent">
            <X className="w-4 h-4 inline mr-2" /> Exit TV Mode
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => {
            const activeEntries = queues[dept].filter(q => q.status !== 'completed' && q.status !== 'cancelled');
            const current = activeEntries.find(q => q.status === 'in-consultation');
            const called = activeEntries.find(q => q.status === 'called');
            return (
              <div key={dept} className="rounded-xl border bg-card p-6">
                <h2 className="text-xl font-bold mb-4">{dept}</h2>
                {current && (
                  <div className="rounded-lg bg-success/10 border border-success/30 p-4 mb-3">
                    <p className="text-xs text-success font-semibold uppercase">Now Serving</p>
                    <p className="text-3xl font-bold mt-1">{current.tokenNo}</p>
                    <p className="text-sm">{current.patientName}</p>
                    <p className="text-xs text-muted-foreground">{current.doctor}</p>
                  </div>
                )}
                {called && (
                  <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 mb-3">
                    <p className="text-xs text-primary font-semibold uppercase">Please Proceed</p>
                    <p className="text-3xl font-bold mt-1">{called.tokenNo}</p>
                    <p className="text-sm">{called.patientName}</p>
                  </div>
                )}
                <div className="space-y-1 mt-3">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Waiting</p>
                  {activeEntries.filter(q => q.status === 'waiting').map(q => (
                    <div key={q.tokenNo} className="flex items-center justify-between text-sm py-1">
                      <span className="font-mono font-bold">{q.tokenNo}</span>
                      <span>{q.patientName}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OPD Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Live queue status across all departments</p>
        </div>
        <button onClick={() => setTvMode(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors">
          <Monitor className="w-4 h-4" /> TV Display
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
          <p className="text-2xl font-bold">{totalWaiting}</p>
          <p className="text-xs text-muted-foreground">In Queue</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <Clock className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
          <p className="text-2xl font-bold">{avgWait}</p>
          <p className="text-xs text-muted-foreground">Avg Wait</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <Users className="w-5 h-5 mx-auto text-success mb-1" />
          <p className="text-2xl font-bold">{totalInConsultation}</p>
          <p className="text-xs text-muted-foreground">Being Seen</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto text-warning mb-1" />
          <p className="text-2xl font-bold">{totalSkipped}</p>
          <p className="text-xs text-muted-foreground">Skipped</p>
        </div>
      </div>

      {/* Department Filters */}
      <div className="flex gap-2 overflow-x-auto">
        <button onClick={() => setSelectedDept('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedDept === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
          All Departments
        </button>
        {departments.map(d => (
          <button key={d} onClick={() => setSelectedDept(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedDept === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {d}
            <span className="ml-1 text-xs opacity-70">{queues[d].filter(q => q.status === 'waiting' || q.status === 'called').length}</span>
          </button>
        ))}
      </div>

      {/* Queue Cards */}
      <div className="space-y-6">
        {departments
          .filter(d => selectedDept === 'all' || selectedDept === d)
          .map(dept => (
            <div key={dept}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">{dept}</h2>
                <span className="text-xs text-muted-foreground">{queues[dept].filter(q => q.status !== 'completed' && q.status !== 'cancelled').length} active</span>
              </div>
              <div className="space-y-2">
                {queues[dept].map((entry, i) => (
                  <motion.div key={entry.tokenNo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className={`rounded-xl border p-4 flex items-center justify-between ${statusStyles[entry.status]}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        entry.status === 'in-consultation' ? 'bg-success/20' : entry.status === 'called' ? 'bg-primary/20' : entry.status === 'skipped' ? 'bg-warning/20' : 'bg-muted'
                      }`}>
                        {entry.tokenNo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{entry.patientName}</p>
                        <p className="text-xs opacity-70">{entry.uhid} · {entry.doctor} · Token at {entry.tokenIssueTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{statusLabels[entry.status]}</p>
                        {entry.status === 'waiting' && <p className="text-xs opacity-70">Wait: {entry.waitTime}</p>}
                      </div>
                      {/* Actions for waiting/skipped */}
                      {(entry.status === 'waiting' || entry.status === 'skipped') && (
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-accent border" title="Skip token">
                            <SkipForward className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-accent border" title="Reassign">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
