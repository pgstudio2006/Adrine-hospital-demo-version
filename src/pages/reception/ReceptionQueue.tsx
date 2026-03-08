import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Users, Clock, AlertTriangle, Maximize2 } from 'lucide-react';

interface QueueEntry {
  tokenNo: number;
  patientName: string;
  doctor: string;
  department: string;
  status: 'waiting' | 'current' | 'next' | 'completed' | 'skipped';
  waitTime: string;
  checkedInAt: string;
}

const queues: Record<string, QueueEntry[]> = {
  'General Medicine': [
    { tokenNo: 101, patientName: 'Rajesh Sharma', doctor: 'Dr. A. Shah', department: 'General Medicine', status: 'completed', waitTime: '0 min', checkedInAt: '08:45 AM' },
    { tokenNo: 102, patientName: 'Priya Patel', doctor: 'Dr. A. Shah', department: 'General Medicine', status: 'current', waitTime: '12 min', checkedInAt: '09:10 AM' },
    { tokenNo: 103, patientName: 'Amit Kumar', doctor: 'Dr. A. Shah', department: 'General Medicine', status: 'next', waitTime: '25 min', checkedInAt: '09:30 AM' },
    { tokenNo: 104, patientName: 'Sunita Devi', doctor: 'Dr. A. Shah', department: 'General Medicine', status: 'waiting', waitTime: '35 min', checkedInAt: '09:45 AM' },
    { tokenNo: 105, patientName: 'Vikram Singh', doctor: 'Dr. A. Shah', department: 'General Medicine', status: 'waiting', waitTime: '40 min', checkedInAt: '09:55 AM' },
  ],
  'Cardiology': [
    { tokenNo: 201, patientName: 'Neha Gupta', doctor: 'Dr. R. Mehta', department: 'Cardiology', status: 'current', waitTime: '5 min', checkedInAt: '09:00 AM' },
    { tokenNo: 202, patientName: 'Arjun Reddy', doctor: 'Dr. R. Mehta', department: 'Cardiology', status: 'next', waitTime: '18 min', checkedInAt: '09:20 AM' },
    { tokenNo: 203, patientName: 'Fatima Khan', doctor: 'Dr. R. Mehta', department: 'Cardiology', status: 'waiting', waitTime: '30 min', checkedInAt: '09:40 AM' },
  ],
  'Orthopedics': [
    { tokenNo: 301, patientName: 'Ravi Teja', doctor: 'Dr. K. Rao', department: 'Orthopedics', status: 'completed', waitTime: '0 min', checkedInAt: '08:30 AM' },
    { tokenNo: 302, patientName: 'Kavita Joshi', doctor: 'Dr. K. Rao', department: 'Orthopedics', status: 'current', waitTime: '8 min', checkedInAt: '09:15 AM' },
    { tokenNo: 303, patientName: 'Deepak Verma', doctor: 'Dr. K. Rao', department: 'Orthopedics', status: 'waiting', waitTime: '22 min', checkedInAt: '09:35 AM' },
  ],
};

const statusStyles: Record<string, string> = {
  current: 'bg-success/10 text-success border-success/30',
  next: 'bg-info/10 text-info border-info/30',
  waiting: 'bg-muted text-muted-foreground border-border',
  completed: 'bg-muted/50 text-muted-foreground border-border opacity-50',
  skipped: 'bg-destructive/10 text-destructive border-destructive/30 line-through',
};

export default function ReceptionQueue() {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const departments = Object.keys(queues);

  const totalWaiting = Object.values(queues).flat().filter(q => q.status === 'waiting' || q.status === 'next').length;
  const totalCurrent = Object.values(queues).flat().filter(q => q.status === 'current').length;
  const avgWait = '22 min';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OPD Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Live queue status across all departments</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors">
          <Monitor className="w-4 h-4" /> TV Display
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
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
          <AlertTriangle className="w-5 h-5 mx-auto text-warning mb-1" />
          <p className="text-2xl font-bold">{totalCurrent}</p>
          <p className="text-xs text-muted-foreground">Being Seen</p>
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
                <span className="text-xs text-muted-foreground">{queues[dept].filter(q => q.status !== 'completed').length} in queue</span>
              </div>
              <div className="space-y-2">
                {queues[dept].map((entry, i) => (
                  <motion.div key={entry.tokenNo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className={`rounded-xl border p-4 flex items-center justify-between ${statusStyles[entry.status]}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        entry.status === 'current' ? 'bg-success/20' : entry.status === 'next' ? 'bg-info/20' : 'bg-muted'
                      }`}>
                        {entry.tokenNo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{entry.patientName}</p>
                        <p className="text-xs opacity-70">{entry.doctor} · Checked in {entry.checkedInAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{entry.status === 'current' ? '🟢 Now Serving' : entry.status === 'next' ? '🔵 Up Next' : entry.status}</p>
                        {entry.status === 'waiting' && <p className="text-xs opacity-70">Wait: {entry.waitTime}</p>}
                      </div>
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
