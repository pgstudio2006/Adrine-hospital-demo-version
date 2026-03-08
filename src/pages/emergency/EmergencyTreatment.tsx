import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Stethoscope, FileText, Syringe, HeartPulse, AlertTriangle, Clock, Zap
} from 'lucide-react';

const activeTreatments = [
  {
    id: 'ER-0891', patient: 'Unknown Male (~45y)', triage: 'Critical', doctor: 'Dr. Sharma',
    location: 'Resuscitation Bay 1', startTime: '10:45 AM',
    vitals: { bp: '90/60', hr: '120', spo2: '88%', temp: '37.8°C', rr: '28' },
    procedures: ['IV Access (x2)', 'ECG - STEMI detected', 'Aspirin 325mg administered'],
    diagnosis: 'Acute Myocardial Infarction (STEMI)',
    medications: [
      { drug: 'Aspirin', dose: '325mg', route: 'PO', time: '10:47 AM' },
      { drug: 'Heparin', dose: '5000 IU', route: 'IV', time: '10:50 AM' },
      { drug: 'Morphine', dose: '4mg', route: 'IV', time: '10:52 AM' },
    ],
  },
  {
    id: 'ER-0889', patient: 'Rajesh Kumar (58M)', triage: 'Critical', doctor: 'Dr. Patel',
    location: 'Trauma Bay 2', startTime: '10:20 AM',
    vitals: { bp: '110/70', hr: '98', spo2: '96%', temp: '36.5°C', rr: '20' },
    procedures: ['C-Spine immobilization', 'Wound suturing (scalp)', 'Splint applied (right tibia)'],
    diagnosis: 'Polytrauma - RTA',
    medications: [
      { drug: 'Tetanus Toxoid', dose: '0.5ml', route: 'IM', time: '10:25 AM' },
      { drug: 'Tramadol', dose: '100mg', route: 'IV', time: '10:30 AM' },
    ],
  },
];

const emergencyProcedures = [
  { name: 'CPR', icon: HeartPulse },
  { name: 'Intubation', icon: Zap },
  { name: 'Defibrillation', icon: Zap },
  { name: 'Wound Suturing', icon: Syringe },
  { name: 'Fracture Stabilization', icon: Stethoscope },
  { name: 'Chest Tube', icon: Stethoscope },
];

export default function EmergencyTreatment() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Treatment Documentation</h1>
        <p className="text-sm text-muted-foreground mt-1">Record symptoms, procedures, and medications for active ER cases</p>
      </div>

      {/* Quick Procedure Buttons */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-2">Quick Procedure Log</h2>
        <div className="flex flex-wrap gap-2">
          {emergencyProcedures.map((p) => (
            <Button key={p.name} variant="outline" size="sm" className="text-xs gap-1.5">
              <p.icon className="w-3 h-3" /> {p.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Treatment Cases */}
      <div className="space-y-4">
        {activeTreatments.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5 border-l-4 border-l-destructive">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                    <Badge variant="destructive" className="text-[10px]">{t.triage}</Badge>
                  </div>
                  <p className="font-medium text-foreground mt-1">{t.patient}</p>
                  <p className="text-xs text-muted-foreground">{t.doctor} · {t.location} · Started {t.startTime}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">Complete Case</Button>
              </div>

              <Tabs defaultValue="vitals">
                <TabsList className="h-8">
                  <TabsTrigger value="vitals" className="text-xs">Vitals</TabsTrigger>
                  <TabsTrigger value="procedures" className="text-xs">Procedures</TabsTrigger>
                  <TabsTrigger value="medications" className="text-xs">Medications</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="vitals" className="mt-3">
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(t.vitals).map(([key, val]) => (
                      <Card key={key} className="p-3 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground">{key}</p>
                        <p className="text-sm font-bold text-foreground mt-1">{val}</p>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="procedures" className="mt-3">
                  <div className="space-y-2">
                    {t.procedures.map((p, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        <span className="text-foreground">{p}</span>
                      </div>
                    ))}
                    <p className="text-xs font-medium text-muted-foreground mt-2">Diagnosis: <span className="text-foreground">{t.diagnosis}</span></p>
                  </div>
                </TabsContent>

                <TabsContent value="medications" className="mt-3">
                  <div className="space-y-2">
                    {t.medications.map((m, j) => (
                      <div key={j} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                        <div>
                          <span className="font-medium text-foreground">{m.drug}</span>
                          <span className="text-muted-foreground ml-2">{m.dose} · {m.route}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{m.time}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-3">
                  <Textarea placeholder="Add treatment notes..." className="text-sm min-h-[80px]" />
                  <Button size="sm" className="mt-2 text-xs">Save Notes</Button>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}