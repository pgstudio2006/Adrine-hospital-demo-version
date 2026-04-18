import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Users, Clock, AlertTriangle, SkipForward, ArrowRightLeft, Play } from 'lucide-react';
import { OPDTVDisplay } from '@/components/reception/OPDTVDisplay';
import { useHospital } from '@/stores/hospitalStore';

type QueueGroup = Record<string, ReturnType<typeof useHospital>['queue']>;

const statusStyles: Record<string, string> = {
  waiting: 'bg-muted text-muted-foreground border-border',
  called: 'bg-primary/10 text-primary border-primary/30',
  'in-consultation': 'bg-success/10 text-success border-success/30',
  completed: 'bg-muted/50 text-muted-foreground border-border opacity-50',
  skipped: 'bg-warning/10 text-warning border-warning/30',
};

const statusLabels: Record<string, string> = {
  waiting: 'Waiting',
  called: 'Called',
  'in-consultation': 'In Consultation',
  completed: 'Completed',
  skipped: 'Skipped',
};

export default function ReceptionQueue() {
  const { queue, updateQueueStatus } = useHospital();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [tvMode, setTvMode] = useState(false);

  const queuesByDepartment = useMemo<QueueGroup>(() => {
    return queue.reduce<QueueGroup>((groups, entry) => {
      if (!groups[entry.department]) {
        groups[entry.department] = [];
      }

      groups[entry.department] = [...groups[entry.department], entry].sort((left, right) => left.tokenNo - right.tokenNo);
      return groups;
    }, {});
  }, [queue]);

  const departments = Object.keys(queuesByDepartment);
  const totalWaiting = queue.filter(entry => entry.status === 'waiting' || entry.status === 'called').length;
  const totalInConsultation = queue.filter(entry => entry.status === 'in-consultation').length;
  const totalSkipped = queue.filter(entry => entry.status === 'skipped').length;
  const avgWait = totalWaiting > 0 ? `${Math.max(6, totalWaiting * 6)} min` : '0 min';

  if (tvMode) {
    return (
      <OPDTVDisplay
        queues={queuesByDepartment}
        avgWait={avgWait}
        onClose={() => setTvMode(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OPD Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Live queue status driven by front-desk registrations and check-ins</p>
        </div>
        <button
          onClick={() => setTvMode(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
        >
          <Monitor className="w-4 h-4" /> TV Display
        </button>
      </div>

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

      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedDept('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedDept === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          All Departments
        </button>
        {departments.map((department) => (
          <button
            key={department}
            onClick={() => setSelectedDept(department)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedDept === department ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {department}
            <span className="ml-1 text-xs opacity-70">
              {queuesByDepartment[department].filter(entry => entry.status === 'waiting' || entry.status === 'called').length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {departments.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center text-sm text-muted-foreground">
            No patients are in queue yet. Register a patient from Reception to start the demo journey.
          </div>
        )}

        {departments
          .filter((department) => selectedDept === 'all' || selectedDept === department)
          .map((department) => (
            <div key={department}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">{department}</h2>
                <span className="text-xs text-muted-foreground">
                  {queuesByDepartment[department].filter(entry => entry.status !== 'completed').length} active
                </span>
              </div>

              <div className="space-y-2">
                {queuesByDepartment[department].map((entry, index) => (
                  <motion.div
                    key={entry.tokenNo}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`rounded-xl border p-4 flex items-center justify-between ${statusStyles[entry.status]}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold bg-background/70">
                        {entry.tokenNo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{entry.patientName}</p>
                        <p className="text-xs opacity-70">
                          {entry.uhid} · {entry.doctor} · Checked in at {entry.checkedInAt}
                        </p>
                        {entry.complaint && (
                          <p className="text-xs opacity-70 mt-1">{entry.complaint}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{statusLabels[entry.status]}</p>
                        <p className="text-xs opacity-70">Token #{entry.tokenNo}</p>
                      </div>

                      {(entry.status === 'waiting' || entry.status === 'called') && (
                        <div className="flex gap-1">
                          {entry.status === 'waiting' && (
                            <button
                              onClick={() => updateQueueStatus(entry.tokenNo, 'called')}
                              className="p-1.5 rounded-lg hover:bg-accent border"
                              title="Call patient"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => updateQueueStatus(entry.tokenNo, 'in-consultation')}
                            className="p-1.5 rounded-lg hover:bg-accent border"
                            title="Start consultation"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => updateQueueStatus(entry.tokenNo, 'skipped')}
                            className="p-1.5 rounded-lg hover:bg-accent border"
                            title="Skip token"
                          >
                            <SkipForward className="w-3.5 h-3.5" />
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
