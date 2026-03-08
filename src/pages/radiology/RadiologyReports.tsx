import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, FileText, CheckCircle, Edit, Send } from "lucide-react";

interface RadiologyReport {
  id: string;
  orderId: string;
  patient: string;
  uhid: string;
  procedure: string;
  modality: string;
  bodyPart: string;
  radiologist: string;
  reportDate: string;
  status: "Draft" | "Pending Review" | "Approved" | "Delivered";
  findings: string;
  impression: string;
  recommendation: string;
  critical: boolean;
}

const reports: RadiologyReport[] = [
  {
    id: "RPT-3001", orderId: "RAD-4499", patient: "Suresh Kumar", uhid: "UH-10035", procedure: "MRI Brain with Contrast", modality: "MRI", bodyPart: "Brain", radiologist: "Dr. Iyer (Radiologist)", reportDate: "2026-03-08",
    status: "Pending Review",
    findings: "Large left parietal subdural hematoma measuring approximately 18mm in maximum thickness with significant midline shift of 8mm to the right. No evidence of skull fracture. Cerebral edema noted in left hemisphere.",
    impression: "Acute subdural hematoma — left parietal convexity with mass effect and midline shift. Neurosurgical emergency.",
    recommendation: "Immediate neurosurgical consultation. Consider emergent craniotomy for evacuation.",
    critical: true,
  },
  {
    id: "RPT-3000", orderId: "RAD-4498", patient: "Meena Joshi", uhid: "UH-10029", procedure: "Ultrasound Neck", modality: "Ultrasound", bodyPart: "Neck/Thyroid", radiologist: "Dr. Iyer (Radiologist)", reportDate: "2026-03-08",
    status: "Approved",
    findings: "Right thyroid lobe: 12x8mm hypoechoic nodule with smooth margins, no calcification. Left thyroid lobe: Normal. No cervical lymphadenopathy.",
    impression: "Solitary right thyroid nodule — TIRADS 3 (mildly suspicious). No malignant features identified.",
    recommendation: "Follow-up ultrasound in 6 months. FNAC if nodule increases in size.",
    critical: false,
  },
  {
    id: "RPT-2999", orderId: "RAD-4497", patient: "Vikram Singh", uhid: "UH-10021", procedure: "X-ray Chest PA", modality: "X-ray", bodyPart: "Chest", radiologist: "Dr. Iyer (Radiologist)", reportDate: "2026-03-08",
    status: "Delivered",
    findings: "Both lung fields are clear. No pneumothorax identified. Heart size normal. Costophrenic angles are clear. No bony abnormality.",
    impression: "Normal chest radiograph. No evidence of pneumothorax or acute pulmonary pathology.",
    recommendation: "Clinical correlation advised. No further imaging needed at this time.",
    critical: false,
  },
  {
    id: "RPT-2998", orderId: "RAD-4493", patient: "Sanjay Patil", uhid: "UH-10009", procedure: "CT Head Plain", modality: "CT Scan", bodyPart: "Head", radiologist: "Dr. Iyer (Radiologist)", reportDate: "2026-03-07",
    status: "Delivered",
    findings: "No intracranial hemorrhage or mass lesion. Ventricles are normal in size. Grey-white matter differentiation preserved. No midline shift.",
    impression: "Normal non-contrast CT head. No acute intracranial pathology.",
    recommendation: "MRI brain if symptoms persist.",
    critical: false,
  },
];

const statusColor: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  "Pending Review": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Delivered: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function RadiologyReports() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RadiologyReport | null>(null);
  const [tab, setTab] = useState("all");

  const filtered = reports.filter(r => {
    const matchSearch = r.patient.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || r.status === tab;
    return matchSearch && matchTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Radiology Reports</h1>
        <p className="text-muted-foreground text-sm">Review, approve, and deliver imaging diagnostic reports</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient or report ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({reports.length})</TabsTrigger>
          <TabsTrigger value="Pending Review">Pending ({reports.filter(r => r.status === "Pending Review").length})</TabsTrigger>
          <TabsTrigger value="Approved">Approved ({reports.filter(r => r.status === "Approved").length})</TabsTrigger>
          <TabsTrigger value="Delivered">Delivered ({reports.filter(r => r.status === "Delivered").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Procedure</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Radiologist</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-1">
                      {r.id}
                      {r.critical && <Badge variant="destructive" className="text-xs">CRITICAL</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div><span className="font-medium">{r.patient}</span><br /><span className="text-xs text-muted-foreground">{r.uhid}</span></div>
                  </TableCell>
                  <TableCell className="text-sm">{r.procedure}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{r.modality}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.radiologist}</TableCell>
                  <TableCell className="text-muted-foreground">{r.reportDate}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelected(r)}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Report {selected.id}
                  {selected.critical && <Badge variant="destructive" className="text-xs">CRITICAL</Badge>}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient}</span></div>
                  <div><span className="text-muted-foreground">UHID:</span> {selected.uhid}</div>
                  <div><span className="text-muted-foreground">Procedure:</span> {selected.procedure}</div>
                  <div><span className="text-muted-foreground">Modality:</span> {selected.modality}</div>
                  <div><span className="text-muted-foreground">Body Part:</span> {selected.bodyPart}</div>
                  <div><span className="text-muted-foreground">Date:</span> {selected.reportDate}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Radiologist:</span> {selected.radiologist}</div>
                </div>

                {/* Report Content */}
                <div className="space-y-3">
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Findings</p>
                      <p className="text-sm text-foreground leading-relaxed">{selected.findings}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Impression</p>
                      <p className="text-sm text-foreground font-medium leading-relaxed">{selected.impression}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Recommendation</p>
                      <p className="text-sm text-foreground leading-relaxed">{selected.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Actions based on status */}
                {selected.status === "Pending Review" && (
                  <div className="space-y-3 border-t border-border pt-3">
                    <div><Label>Reviewer Comments</Label><Textarea placeholder="Add validation comments..." rows={2} /></div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => setSelected(null)}>
                        <CheckCircle className="h-4 w-4 mr-2" /> Approve Report
                      </Button>
                      <Button variant="outline" onClick={() => setSelected(null)}>
                        <Edit className="h-4 w-4 mr-2" /> Request Revision
                      </Button>
                    </div>
                  </div>
                )}
                {selected.status === "Approved" && (
                  <Button className="w-full" onClick={() => setSelected(null)}>
                    <Send className="h-4 w-4 mr-2" /> Deliver to Doctor & Patient
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
