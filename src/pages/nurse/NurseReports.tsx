import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, ClipboardList, Download, FileText, Pill, Shield } from "lucide-react";

const MAR_RECORDS = [
  { id: "MAR001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", drug: "Ceftriaxone 1g IV", scheduled: "08:00 AM", actual: "08:10 AM", status: "Administered", nurse: "Nurse Priya" },
  { id: "MAR002", uhid: "UH-2024-0012", patient: "Ramesh Kumar", drug: "Paracetamol 500mg PO", scheduled: "08:00 AM", actual: "08:05 AM", status: "Administered", nurse: "Nurse Priya" },
  { id: "MAR003", uhid: "UH-2024-0103", patient: "Vikram Singh", drug: "Meropenem 1g IV", scheduled: "08:00 AM", actual: "08:10 AM", status: "Administered", nurse: "Nurse Priya" },
  { id: "MAR004", uhid: "UH-2024-0045", patient: "Anita Sharma", drug: "Amoxicillin 500mg PO", scheduled: "08:00 AM", actual: "—", status: "Held", nurse: "Nurse Priya" },
  { id: "MAR005", uhid: "UH-2024-0012", patient: "Ramesh Kumar", drug: "Enoxaparin 40mg SC", scheduled: "10:00 AM", actual: "—", status: "Pending", nurse: "—" },
  { id: "MAR006", uhid: "UH-2024-0078", patient: "Suresh Patel", drug: "Tramadol 50mg PO", scheduled: "08:00 AM", actual: "08:15 AM", status: "Administered", nurse: "Nurse Priya" },
];

const PROCEDURES = [
  { id: "BP001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", procedure: "Chest drain management", nurse: "Nurse Priya", time: "09:00 AM", notes: "Drain output 50ml serosanguineous. No air leak." },
  { id: "BP002", uhid: "UH-2024-0103", patient: "Vikram Singh", procedure: "Wound dressing change", nurse: "Nurse Priya", time: "09:30 AM", notes: "Wound clean, no signs of infection. Dry dressing applied." },
  { id: "BP003", uhid: "UH-2024-0078", patient: "Suresh Patel", procedure: "Catheter care", nurse: "Nurse Rekha", time: "08:30 AM", notes: "Catheter patent. Urine clear. Site clean." },
];

const SAMPLE_COLLECTIONS = [
  { id: "SC001", uhid: "UH-2024-0045", patient: "Anita Sharma", test: "CBC, CRP", type: "Blood", collected: "11:00 AM", nurse: "Nurse Priya", labStatus: "Received" },
  { id: "SC002", uhid: "UH-2024-0012", patient: "Ramesh Kumar", test: "ABG", type: "Arterial Blood", collected: "07:30 AM", nurse: "Nurse Kavita", labStatus: "Reported" },
  { id: "SC003", uhid: "UH-2024-0103", patient: "Vikram Singh", test: "Blood Culture", type: "Blood", collected: "06:00 AM", nurse: "Nurse Kavita", labStatus: "In Progress" },
];

const AUDIT_LOG = [
  { time: "09:30 AM", nurse: "Nurse Priya", action: "Recorded vitals", patient: "Ramesh Kumar", uhid: "UH-2024-0012" },
  { time: "09:15 AM", nurse: "Nurse Priya", action: "Administered Meropenem 1g IV", patient: "Vikram Singh", uhid: "UH-2024-0103" },
  { time: "09:00 AM", nurse: "Nurse Priya", action: "Completed wound dressing", patient: "Vikram Singh", uhid: "UH-2024-0103" },
  { time: "08:45 AM", nurse: "Nurse Priya", action: "Reported medication reaction incident", patient: "Anita Sharma", uhid: "UH-2024-0045" },
  { time: "08:20 AM", nurse: "Nurse Priya", action: "Recorded vitals (BP flagged high)", patient: "Suresh Patel", uhid: "UH-2024-0078" },
  { time: "08:10 AM", nurse: "Nurse Priya", action: "Shift handover accepted from Nurse Kavita", patient: "—", uhid: "—" },
];

const statusColor = (s: string) => {
  if (s === "Administered" || s === "Reported" || s === "Received") return "default";
  if (s === "Held" || s === "In Progress") return "secondary";
  return "outline";
};

export default function NurseReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">MAR, procedures, sample collections & audit trail</p>
        </div>
        <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" /> Export Report</Button>
      </div>

      <Tabs defaultValue="mar">
        <TabsList>
          <TabsTrigger value="mar"><Pill className="h-3.5 w-3.5 mr-1" /> MAR</TabsTrigger>
          <TabsTrigger value="procedures"><ClipboardList className="h-3.5 w-3.5 mr-1" /> Procedures</TabsTrigger>
          <TabsTrigger value="samples"><FileText className="h-3.5 w-3.5 mr-1" /> Samples</TabsTrigger>
          <TabsTrigger value="audit"><Shield className="h-3.5 w-3.5 mr-1" /> Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="mar" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Medication Administration Record</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Drug</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nurse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MAR_RECORDS.map(m => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{m.patient}</p>
                        <p className="text-xs text-muted-foreground">{m.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{m.drug}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.scheduled}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.actual}</TableCell>
                      <TableCell><Badge variant={statusColor(m.status)} className="text-xs">{m.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.nurse}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="mt-4">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Procedure</TableHead>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PROCEDURES.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{p.patient}</p>
                        <p className="text-xs text-muted-foreground">{p.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{p.procedure}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.nurse}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.time}</TableCell>
                      <TableCell className="text-sm max-w-[250px] truncate">{p.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="samples" className="mt-4">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Lab Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_COLLECTIONS.map(sc => (
                    <TableRow key={sc.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{sc.patient}</p>
                        <p className="text-xs text-muted-foreground">{sc.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{sc.test}</TableCell>
                      <TableCell className="text-sm">{sc.type}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sc.collected}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sc.nurse}</TableCell>
                      <TableCell><Badge variant={statusColor(sc.labStatus)} className="text-xs">{sc.labStatus}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nursing Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {AUDIT_LOG.map((log, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-4">
                  <span className="text-xs text-muted-foreground min-w-[70px]">{log.time}</span>
                  <span className="text-sm text-foreground font-medium min-w-[100px]">{log.nurse}</span>
                  <span className="text-sm text-foreground flex-1">{log.action}</span>
                  {log.patient !== "—" && (
                    <span className="text-xs text-muted-foreground">{log.patient} · {log.uhid}</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
