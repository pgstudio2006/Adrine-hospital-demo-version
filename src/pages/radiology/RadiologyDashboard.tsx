import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanLine, Clock, AlertTriangle, Activity, CheckCircle, Calendar, Monitor, Zap } from "lucide-react";

const stats = [
  { label: "Pending Orders", value: "18", icon: Clock, trend: "+4 since morning" },
  { label: "In Progress", value: "5", icon: ScanLine, trend: "3 CT, 1 MRI, 1 X-ray" },
  { label: "Completed Today", value: "34", icon: CheckCircle, trend: "8% above avg" },
  { label: "Critical Findings", value: "2", icon: AlertTriangle, trend: "Awaiting acknowledgment" },
];

const recentStudies = [
  { id: "RAD-4501", patient: "Ravi Sharma", uhid: "UH-10042", modality: "CT Scan", bodyPart: "Chest", doctor: "Dr. Patel", priority: "Urgent", status: "Scheduled", time: "11:30 AM" },
  { id: "RAD-4500", patient: "Anita Desai", uhid: "UH-10038", modality: "X-ray", bodyPart: "Left Knee", doctor: "Dr. Rao", priority: "Routine", status: "Imaging", time: "11:00 AM" },
  { id: "RAD-4499", patient: "Suresh Kumar", uhid: "UH-10035", modality: "MRI", bodyPart: "Brain", doctor: "Dr. Mehta", priority: "Emergency", status: "Reporting", time: "10:15 AM" },
  { id: "RAD-4498", patient: "Meena Joshi", uhid: "UH-10029", modality: "Ultrasound", bodyPart: "Abdomen", doctor: "Dr. Shah", priority: "Routine", status: "Completed", time: "09:45 AM" },
  { id: "RAD-4497", patient: "Vikram Singh", uhid: "UH-10021", modality: "X-ray", bodyPart: "Chest PA", doctor: "Dr. Gupta", priority: "Routine", status: "Delivered", time: "09:00 AM" },
];

const criticalAlerts = [
  { patient: "Suresh Kumar", study: "MRI Brain", finding: "Large subdural hematoma — left parietal region", doctor: "Dr. Mehta", time: "10:40 AM", ack: false },
  { patient: "Prakash Verma", study: "CT Chest", finding: "Bilateral pulmonary embolism", doctor: "Dr. Patel", time: "Yesterday 4:15 PM", ack: true },
];

const equipmentStatus = [
  { name: "CT Scanner — Siemens Somatom", status: "Active", studies: 12, uptime: "99.2%" },
  { name: "MRI 3T — GE Signa Premier", status: "Active", studies: 6, uptime: "98.8%" },
  { name: "X-ray Digital — Philips DigitalDiagnost", status: "Active", studies: 18, uptime: "99.5%" },
  { name: "Ultrasound — Samsung HS60", status: "Maintenance", studies: 0, uptime: "—" },
  { name: "Mammography — Hologic 3Dimensions", status: "Active", studies: 4, uptime: "97.6%" },
];

const statusColor: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Imaging: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Reporting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Delivered: "bg-muted text-muted-foreground",
};

export default function RadiologyDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Radiology Dashboard</h1>
        <p className="text-muted-foreground text-sm">Imaging operations overview and workflow tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.trend}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Studies */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Imaging Studies</CardTitle>
            <Button variant="outline" size="sm">View Worklist</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Study ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Body Part</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudies.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-sm">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.patient}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{s.modality}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{s.bodyPart}</TableCell>
                    <TableCell>
                      <Badge variant={s.priority === "Emergency" ? "destructive" : s.priority === "Urgent" ? "default" : "secondary"} className="text-xs">{s.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{s.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Critical Findings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Critical Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAlerts.map((a, i) => (
              <div key={i} className={`border rounded-lg p-3 space-y-1 ${a.ack ? "border-border" : "border-destructive/50 bg-destructive/5"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">{a.patient}</span>
                  {!a.ack && <Badge variant="destructive" className="text-xs">Unacknowledged</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{a.study}</p>
                <p className="text-sm text-foreground">{a.finding}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Dr: {a.doctor}</span>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Equipment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Monitor className="h-5 w-5" /> Equipment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Studies Today</TableHead>
                <TableHead>Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentStatus.map((eq, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{eq.name}</TableCell>
                  <TableCell>
                    <Badge variant={eq.status === "Active" ? "default" : "secondary"} className="text-xs">{eq.status}</Badge>
                  </TableCell>
                  <TableCell>{eq.studies}</TableCell>
                  <TableCell className="text-muted-foreground">{eq.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
