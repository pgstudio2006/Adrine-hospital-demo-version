import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, ClipboardCheck, Search, XCircle } from "lucide-react";

interface ValidationItem {
  orderId: string;
  sampleId: string;
  uhid: string;
  patient: string;
  category: string;
  tests: { name: string; value: string; unit: string; ref: string; flag: string }[];
  enteredBy: string;
  enteredAt: string;
  priority: string;
}

const PENDING_VALIDATION: ValidationItem[] = [
  {
    orderId: "LO-4514", sampleId: "S-20250308-007", uhid: "UH-2024-0155", patient: "Kiran Desai",
    category: "Biochemistry", enteredBy: "Tech. Amit", enteredAt: "10:30 AM", priority: "Routine",
    tests: [
      { name: "Total Cholesterol", value: "242", unit: "mg/dL", ref: "<200", flag: "High" },
      { name: "HDL Cholesterol", value: "38", unit: "mg/dL", ref: ">40", flag: "Low" },
      { name: "LDL Cholesterol", value: "168", unit: "mg/dL", ref: "<100", flag: "High" },
      { name: "Triglycerides", value: "180", unit: "mg/dL", ref: "<150", flag: "High" },
    ],
  },
  {
    orderId: "LO-4521", sampleId: "S-20250308-001", uhid: "UH-2024-0045", patient: "Anita Sharma",
    category: "Hematology", enteredBy: "Tech. Neha", enteredAt: "11:15 AM", priority: "Routine",
    tests: [
      { name: "Hemoglobin", value: "10.5", unit: "g/dL", ref: "12.0–15.5", flag: "Low" },
      { name: "WBC Count", value: "12.2", unit: "×10³/μL", ref: "4.0–11.0", flag: "High" },
      { name: "Platelet Count", value: "140", unit: "×10³/μL", ref: "150–400", flag: "Low" },
      { name: "RBC Count", value: "3.9", unit: "mill/μL", ref: "4.0–5.5", flag: "Low" },
    ],
  },
];

const VALIDATED = [
  { orderId: "LO-4517", uhid: "UH-2024-0091", patient: "Meena Devi", category: "Biochemistry", tests: "HbA1c, FBS, PPBS", validator: "Dr. Pathak", validatedAt: "09:45 AM", status: "Approved" },
  { orderId: "LO-4510", uhid: "UH-2024-0175", patient: "Ajay Kumar", category: "Hematology", tests: "CBC, Peripheral Smear", validator: "Dr. Pathak", validatedAt: "09:00 AM", status: "Approved" },
  { orderId: "LO-4507", uhid: "UH-2024-0180", patient: "Nisha Patel", category: "Biochemistry", tests: "RFT, Electrolytes", validator: "Dr. Pathak", validatedAt: "08:30 AM", status: "Rejected – Retest Required" },
];

const flagColor = (f: string) => {
  if (f === "Critical") return "destructive";
  if (f === "High" || f === "Low") return "secondary";
  return "outline";
};

export default function LabVerification() {
  const [search, setSearch] = useState("");

  const filtered = PENDING_VALIDATION.filter(v =>
    v.patient.toLowerCase().includes(search.toLowerCase()) || v.uhid.includes(search) || v.orderId.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">Pathologist review, result validation & report approval</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Awaiting Validation</p>
          <p className="text-2xl font-bold text-foreground">{PENDING_VALIDATION.length}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Validated Today</p>
          <p className="text-2xl font-bold text-foreground">{VALIDATED.filter(v => v.status === "Approved").length}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Rejected / Retest</p>
          <p className="text-2xl font-bold text-foreground">{VALIDATED.filter(v => v.status.includes("Rejected")).length}</p>
        </CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search order, patient, UHID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Pending Validation */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pending Validation</h2>
        {filtered.map(v => {
          const hasCritical = v.tests.some(t => t.flag === "Critical");
          return (
            <Card key={v.orderId} className={`border-border ${hasCritical ? 'border-l-4 border-l-destructive' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4" />
                      <span className="font-mono">{v.orderId}</span>
                      <Badge variant={v.priority === "Urgent" ? "default" : "outline"} className="text-xs">{v.priority}</Badge>
                      {hasCritical && <Badge variant="destructive" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Critical Value</Badge>}
                    </CardTitle>
                    <p className="text-sm text-foreground mt-1">{v.patient} <span className="text-muted-foreground">· {v.uhid} · {v.category}</span></p>
                    <p className="text-xs text-muted-foreground">Entered by {v.enteredBy} at {v.enteredAt} · Sample: {v.sampleId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs h-7"><XCircle className="h-3.5 w-3.5 mr-1" /> Reject</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Reject Results — {v.orderId}</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-2">
                          <div><Label>Rejection Reason</Label><Textarea placeholder="Explain why results are being rejected..." /></div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">Request Retest</Button>
                            <Button variant="destructive" className="flex-1">Reject & Notify</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="text-xs h-7"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Approve & Sign Report — {v.orderId}</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-2">
                          <div><Label>Clinical Comments (optional)</Label><Textarea placeholder="Pathologist interpretation or comments..." /></div>
                          <Button className="w-full">Approve, Sign & Generate Report</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Flag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {v.tests.map(t => (
                      <TableRow key={t.name}>
                        <TableCell className="text-sm font-medium text-foreground">{t.name}</TableCell>
                        <TableCell className={`text-sm font-mono font-bold ${t.flag === "Critical" ? "text-destructive" : "text-foreground"}`}>{t.value}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{t.unit}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{t.ref}</TableCell>
                        <TableCell>{t.flag && <Badge variant={flagColor(t.flag)} className="text-xs">{t.flag}</Badge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Validation History */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Validation History</h2>
        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Validator</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VALIDATED.map(v => (
                  <TableRow key={v.orderId}>
                    <TableCell className="font-mono text-sm text-foreground">{v.orderId}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">{v.patient}</p>
                      <p className="text-xs text-muted-foreground">{v.uhid}</p>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{v.category}</Badge></TableCell>
                    <TableCell className="text-sm max-w-[180px] truncate">{v.tests}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{v.validator}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{v.validatedAt}</TableCell>
                    <TableCell><Badge variant={v.status === "Approved" ? "default" : "destructive"} className="text-xs">{v.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
