import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Boxes, Download, FileText, Shield, Wrench } from "lucide-react";

const DAILY_STATS = [
  { category: "Hematology", ordered: 45, completed: 38, pending: 7, avgTAT: "42 min" },
  { category: "Biochemistry", ordered: 62, completed: 50, pending: 12, avgTAT: "1h 15m" },
  { category: "Microbiology", ordered: 18, completed: 8, pending: 10, avgTAT: "28h" },
  { category: "Serology", ordered: 22, completed: 19, pending: 3, avgTAT: "2h 50m" },
  { category: "Immunology", ordered: 8, completed: 6, pending: 2, avgTAT: "3h 20m" },
  { category: "Molecular", ordered: 5, completed: 3, pending: 2, avgTAT: "6h" },
];

const QC_RECORDS = [
  { id: "QC001", equipment: "Sysmex XN-1000 (Hematology)", control: "Normal Control", expected: "Hb 13.5±0.5", actual: "13.6", status: "Pass", date: "08:00 AM" },
  { id: "QC002", equipment: "Sysmex XN-1000 (Hematology)", control: "Low Control", expected: "Hb 7.0±0.5", actual: "6.8", status: "Pass", date: "08:00 AM" },
  { id: "QC003", equipment: "Beckman AU5800 (Biochemistry)", control: "Normal Control", expected: "Glucose 95±5", actual: "94", status: "Pass", date: "07:45 AM" },
  { id: "QC004", equipment: "Beckman AU5800 (Biochemistry)", control: "High Control", expected: "Creatinine 8.0±0.5", actual: "8.7", status: "Fail", date: "07:45 AM" },
  { id: "QC005", equipment: "Vitros 5600 (Immunoassay)", control: "Normal Control", expected: "TSH 2.5±0.3", actual: "2.4", status: "Pass", date: "07:30 AM" },
];

const INVENTORY = [
  { item: "CBC Reagent (Sysmex)", batch: "SYS-2025-0312", stock: 120, unit: "tests", expiry: "Jun 2025", status: "Adequate" },
  { item: "Glucose Reagent (Beckman)", batch: "BK-2025-0298", stock: 45, unit: "tests", expiry: "Apr 2025", status: "Low" },
  { item: "PT/INR Cartridge (Stago)", batch: "ST-2025-0105", stock: 200, unit: "tests", expiry: "Sep 2025", status: "Adequate" },
  { item: "Blood Culture Bottles", batch: "BD-2025-0450", stock: 15, unit: "bottles", expiry: "Aug 2025", status: "Critical" },
  { item: "EDTA Tubes (Vacutainer)", batch: "BD-2025-0600", stock: 500, unit: "tubes", expiry: "Dec 2025", status: "Adequate" },
  { item: "Serum Separator Tubes", batch: "BD-2025-0601", stock: 80, unit: "tubes", expiry: "Nov 2025", status: "Low" },
];

const AUDIT_LOG = [
  { time: "10:30 AM", user: "Tech. Amit", action: "Entered results for LO-4514 (Lipid Profile)", patient: "Kiran Desai" },
  { time: "10:00 AM", user: "Tech. Neha", action: "Entered results for LO-4512 (HIV, HBsAg, HCV)", patient: "Ravi Shankar" },
  { time: "09:45 AM", user: "Dr. Pathak", action: "Validated & approved LO-4517", patient: "Meena Devi" },
  { time: "09:25 AM", user: "Tech. Amit", action: "Received sample S-20250308-004", patient: "Arjun Reddy" },
  { time: "09:00 AM", user: "Dr. Pathak", action: "Validated & approved LO-4510", patient: "Ajay Kumar" },
  { time: "08:30 AM", user: "Dr. Pathak", action: "Rejected LO-4507 – requested retest", patient: "Nisha Patel" },
  { time: "08:00 AM", user: "Tech. Amit", action: "Ran QC for Sysmex XN-1000 – All passed", patient: "—" },
  { time: "07:45 AM", user: "Tech. Neha", action: "Ran QC for Beckman AU5800 – 1 failure (Creatinine high control)", patient: "—" },
];

const stockColor = (s: string) => {
  if (s === "Critical") return "destructive";
  if (s === "Low") return "secondary";
  return "outline";
};

export default function LabReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Statistics, quality control, inventory & audit trail</p>
        </div>
        <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" /> Export Report</Button>
      </div>

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats"><BarChart3 className="h-3.5 w-3.5 mr-1" /> Statistics</TabsTrigger>
          <TabsTrigger value="qc"><Wrench className="h-3.5 w-3.5 mr-1" /> Quality Control</TabsTrigger>
          <TabsTrigger value="inventory"><Boxes className="h-3.5 w-3.5 mr-1" /> Inventory</TabsTrigger>
          <TabsTrigger value="audit"><Shield className="h-3.5 w-3.5 mr-1" /> Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Daily Test Volume & Turnaround Time</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Avg TAT</TableHead>
                    <TableHead>Completion %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DAILY_STATS.map(s => (
                    <TableRow key={s.category}>
                      <TableCell className="text-sm font-medium text-foreground">{s.category}</TableCell>
                      <TableCell className="text-sm font-mono">{s.ordered}</TableCell>
                      <TableCell className="text-sm font-mono">{s.completed}</TableCell>
                      <TableCell className="text-sm font-mono">{s.pending}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.avgTAT}</TableCell>
                      <TableCell>
                        <Badge variant={s.completed / s.ordered > 0.8 ? "default" : "secondary"} className="text-xs">
                          {Math.round((s.completed / s.ordered) * 100)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qc" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quality Control Results — Today</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Control</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {QC_RECORDS.map(qc => (
                    <TableRow key={qc.id}>
                      <TableCell className="text-sm text-foreground">{qc.equipment}</TableCell>
                      <TableCell className="text-sm">{qc.control}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{qc.expected}</TableCell>
                      <TableCell className="text-sm font-mono font-bold text-foreground">{qc.actual}</TableCell>
                      <TableCell><Badge variant={qc.status === "Pass" ? "default" : "destructive"} className="text-xs">{qc.status}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{qc.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Laboratory Inventory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVENTORY.map(inv => (
                    <TableRow key={inv.item}>
                      <TableCell className="text-sm font-medium text-foreground">{inv.item}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{inv.batch}</TableCell>
                      <TableCell className="text-sm font-mono">{inv.stock} {inv.unit}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.expiry}</TableCell>
                      <TableCell><Badge variant={stockColor(inv.status)} className="text-xs">{inv.status}</Badge></TableCell>
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
              <CardTitle className="text-base">Laboratory Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {AUDIT_LOG.map((log, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-4">
                  <span className="text-xs text-muted-foreground min-w-[70px]">{log.time}</span>
                  <span className="text-sm text-foreground font-medium min-w-[100px]">{log.user}</span>
                  <span className="text-sm text-foreground flex-1">{log.action}</span>
                  {log.patient !== "—" && <span className="text-xs text-muted-foreground">{log.patient}</span>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
