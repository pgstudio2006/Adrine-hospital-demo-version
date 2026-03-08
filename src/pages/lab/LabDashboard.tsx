import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertTriangle, Beaker, CheckCircle, Clock, FlaskConical, TestTube } from "lucide-react";

const STATS = [
  { label: "Pending Samples", value: 24, icon: TestTube, change: "8 urgent" },
  { label: "In Progress", value: 18, icon: FlaskConical, change: "6 near TAT" },
  { label: "Awaiting Validation", value: 7, icon: Beaker, change: "2 critical" },
  { label: "Completed Today", value: 42, icon: CheckCircle, change: "+12 vs yesterday" },
];

const CRITICAL_ALERTS = [
  { id: 1, patient: "Ramesh Kumar", uhid: "UH-2024-0012", test: "Potassium", value: "6.8 mEq/L", ref: "3.5–5.0", doctor: "Dr. Anil Mehta", time: "5 min ago" },
  { id: 2, patient: "Vikram Singh", uhid: "UH-2024-0103", test: "Hemoglobin", value: "5.2 g/dL", ref: "13.0–17.0", doctor: "Dr. Anil Mehta", time: "20 min ago" },
  { id: 3, patient: "Meena Devi", uhid: "UH-2024-0091", test: "Blood Sugar (Fasting)", value: "320 mg/dL", ref: "70–100", doctor: "Dr. Sunita Joshi", time: "35 min ago" },
];

const RECENT_ORDERS = [
  { id: "LO-4521", uhid: "UH-2024-0045", patient: "Anita Sharma", tests: "CBC, CRP, ESR", priority: "Urgent", doctor: "Dr. Priya Gupta", time: "10:15 AM", status: "Sample Received" },
  { id: "LO-4520", uhid: "UH-2024-0012", patient: "Ramesh Kumar", tests: "ABG, Electrolytes", priority: "Emergency", doctor: "Dr. Anil Mehta", time: "10:00 AM", status: "Processing" },
  { id: "LO-4519", uhid: "UH-2024-0078", patient: "Suresh Patel", tests: "PT/INR, aPTT", priority: "Routine", doctor: "Dr. Rajesh Shah", time: "09:45 AM", status: "Sample Collected" },
  { id: "LO-4518", uhid: "UH-2024-0115", patient: "Geeta Rao", tests: "CBC, LFT, RFT", priority: "Routine", doctor: "Dr. Sunita Joshi", time: "09:30 AM", status: "Result Ready" },
  { id: "LO-4517", uhid: "UH-2024-0091", patient: "Meena Devi", tests: "HbA1c, FBS, PPBS", priority: "Urgent", doctor: "Dr. Sunita Joshi", time: "09:00 AM", status: "Validated" },
];

const TAT_TRACKING = [
  { category: "Hematology", avg: "45 min", target: "60 min", status: "On Track" },
  { category: "Biochemistry", avg: "1h 20m", target: "2h", status: "On Track" },
  { category: "Microbiology", avg: "36h", target: "48h", status: "On Track" },
  { category: "Serology", avg: "3h 10m", target: "3h", status: "Delayed" },
];

const priorityColor = (p: string) => {
  if (p === "Emergency") return "destructive";
  if (p === "Urgent") return "default";
  return "outline";
};

const statusColor = (s: string) => {
  if (s === "Validated" || s === "Result Ready") return "default";
  if (s === "Processing") return "secondary";
  return "outline";
};

export default function LabDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Laboratory Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Today's overview · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
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

      {/* Critical Alerts */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Critical Value Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {CRITICAL_ALERTS.map(a => (
            <div key={a.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.patient} <span className="text-muted-foreground font-normal">· {a.uhid}</span></p>
                  <p className="text-xs text-muted-foreground">{a.test}: <span className="font-mono font-bold text-foreground">{a.value}</span> (Ref: {a.ref}) · {a.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{a.time}</span>
                <Button size="sm" variant="outline" className="text-xs h-7">Notify Doctor</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" /> Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_ORDERS.map(o => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <p className="text-sm font-mono text-foreground">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{o.time}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">{o.patient}</p>
                      <p className="text-xs text-muted-foreground">{o.uhid}</p>
                    </TableCell>
                    <TableCell className="text-sm max-w-[180px] truncate">{o.tests}</TableCell>
                    <TableCell><Badge variant={priorityColor(o.priority)} className="text-xs">{o.priority}</Badge></TableCell>
                    <TableCell><Badge variant={statusColor(o.status)} className="text-xs">{o.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* TAT Tracking */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Turnaround Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border">
            {TAT_TRACKING.map(t => (
              <div key={t.category} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{t.category}</p>
                  <Badge variant={t.status === "Delayed" ? "destructive" : "outline"} className="text-xs">{t.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Avg: {t.avg} · Target: {t.target}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
