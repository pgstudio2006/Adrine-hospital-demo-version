import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertTriangle, Bed, CheckCircle, Clock, Pill, Stethoscope, Users } from "lucide-react";

const STATS = [
  { label: "My Patients", value: 12, icon: Users, change: "+2 from last shift" },
  { label: "Pending Tasks", value: 8, icon: Clock, change: "3 urgent" },
  { label: "Meds Due", value: 5, icon: Pill, change: "Next in 15 min" },
  { label: "Vitals Due", value: 4, icon: Activity, change: "2 overdue" },
];

const ALERTS = [
  { id: 1, patient: "Ramesh Kumar", uhid: "UH-2024-0012", type: "Critical Vitals", desc: "SpO2 dropped to 88%", severity: "critical", time: "2 min ago" },
  { id: 2, patient: "Anita Sharma", uhid: "UH-2024-0045", type: "Medication Reaction", desc: "Rash after Amoxicillin", severity: "high", time: "10 min ago" },
  { id: 3, patient: "Suresh Patel", uhid: "UH-2024-0078", type: "Patient Deterioration", desc: "Increased confusion, fever 102°F", severity: "high", time: "25 min ago" },
  { id: 4, patient: "Meena Devi", uhid: "UH-2024-0091", type: "Fall Risk", desc: "Attempted to walk unassisted", severity: "medium", time: "40 min ago" },
];

const MY_PATIENTS = [
  { uhid: "UH-2024-0012", name: "Ramesh Kumar", bed: "ICU-03", condition: "Critical", vitalsdue: true, medsdue: true, notes: "Post cardiac surgery Day 2" },
  { uhid: "UH-2024-0045", name: "Anita Sharma", bed: "W2-05", condition: "Stable", vitalsdue: false, medsdue: true, notes: "Pneumonia, on IV antibiotics" },
  { uhid: "UH-2024-0078", name: "Suresh Patel", bed: "W2-08", condition: "Guarded", vitalsdue: true, medsdue: false, notes: "Post hip replacement Day 1" },
  { uhid: "UH-2024-0091", name: "Meena Devi", bed: "W3-02", condition: "Stable", vitalsdue: false, medsdue: false, notes: "Diabetic foot care, dressing change today" },
  { uhid: "UH-2024-0103", name: "Vikram Singh", bed: "ICU-07", condition: "Critical", vitalsdue: true, medsdue: true, notes: "Ventilator, sedation protocol" },
];

const PENDING_TASKS = [
  { id: 1, patient: "Ramesh Kumar", task: "IV fluid change", priority: "urgent", due: "10:30 AM" },
  { id: 2, patient: "Vikram Singh", task: "Wound dressing", priority: "urgent", due: "10:45 AM" },
  { id: 3, patient: "Anita Sharma", task: "Blood sample collection", priority: "normal", due: "11:00 AM" },
  { id: 4, patient: "Suresh Patel", task: "Physiotherapy assistance", priority: "normal", due: "11:30 AM" },
  { id: 5, patient: "Meena Devi", task: "Diabetic foot dressing", priority: "normal", due: "12:00 PM" },
];

const severityColor = (s: string) => {
  if (s === "critical") return "destructive";
  if (s === "high") return "destructive";
  if (s === "medium") return "secondary";
  return "outline";
};

const conditionColor = (c: string) => {
  if (c === "Critical") return "destructive";
  if (c === "Guarded") return "secondary";
  return "outline";
};

export default function NurseDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Nursing Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Morning Shift · Ward 2 & ICU · 8 AM – 2 PM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Active Alerts & Escalations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {ALERTS.map(a => (
              <div key={a.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={severityColor(a.severity)} className="text-xs uppercase w-16 justify-center">{a.severity}</Badge>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.patient} <span className="text-muted-foreground font-normal">· {a.uhid}</span></p>
                    <p className="text-xs text-muted-foreground">{a.type}: {a.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                  <Button size="sm" variant="outline" className="text-xs h-7">Acknowledge</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* My Patients */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Bed className="h-4 w-4" /> My Assigned Patients</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MY_PATIENTS.map(p => (
                  <TableRow key={p.uhid}>
                    <TableCell>
                      <p className="font-medium text-sm text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.uhid}</p>
                    </TableCell>
                    <TableCell className="text-sm">{p.bed}</TableCell>
                    <TableCell><Badge variant={conditionColor(p.condition)} className="text-xs">{p.condition}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {p.vitalsdue && <Badge variant="outline" className="text-xs">Vitals</Badge>}
                        {p.medsdue && <Badge variant="outline" className="text-xs">Meds</Badge>}
                        {!p.vitalsdue && !p.medsdue && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{p.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {PENDING_TASKS.map(t => (
                <div key={t.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{t.task}</p>
                    <Badge variant={t.priority === "urgent" ? "destructive" : "outline"} className="text-xs">{t.priority}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">{t.patient}</p>
                    <p className="text-xs text-muted-foreground">{t.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
