import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Archive, Barcode, CheckCircle, Package, Search, TestTube, XCircle } from "lucide-react";

const SAMPLES = [
  { sampleId: "S-20250308-001", orderId: "LO-4521", uhid: "UH-2024-0045", patient: "Anita Sharma", type: "Blood", collector: "Nurse Priya", collectedAt: "10:20 AM", receivedAt: "10:35 AM", condition: "Good", status: "Received" },
  { sampleId: "S-20250308-002", orderId: "LO-4520", uhid: "UH-2024-0012", patient: "Ramesh Kumar", type: "Arterial Blood", collector: "Nurse Kavita", collectedAt: "10:05 AM", receivedAt: "10:10 AM", condition: "Good", status: "Processing" },
  { sampleId: "S-20250308-003", orderId: "LO-4519", uhid: "UH-2024-0078", patient: "Suresh Patel", type: "Blood", collector: "Nurse Rekha", collectedAt: "09:50 AM", receivedAt: "—", condition: "—", status: "Collected" },
  { sampleId: "S-20250308-004", orderId: "LO-4516", uhid: "UH-2024-0130", patient: "Arjun Reddy", type: "Blood", collector: "Nurse Priya", collectedAt: "09:15 AM", receivedAt: "09:25 AM", condition: "Good", status: "In Analysis" },
  { sampleId: "S-20250308-005", orderId: "LO-4515", uhid: "UH-2024-0142", patient: "Fatima Begum", type: "Blood", collector: "Nurse Rekha", collectedAt: "08:50 AM", receivedAt: "09:00 AM", condition: "Good", status: "Received" },
  { sampleId: "S-20250308-006", orderId: "LO-4513", uhid: "UH-2024-0091", patient: "Meena Devi", type: "Urine", collector: "Self-collected", collectedAt: "08:20 AM", receivedAt: "08:30 AM", condition: "Good", status: "In Analysis" },
  { sampleId: "S-20250308-007", orderId: "LO-4512", uhid: "UH-2024-0160", patient: "Ravi Shankar", type: "Blood", collector: "Nurse Priya", collectedAt: "08:05 AM", receivedAt: "08:15 AM", condition: "Good", status: "Analysis Complete" },
];

const REJECTED = [
  { sampleId: "S-20250307-045", orderId: "LO-4498", uhid: "UH-2024-0200", patient: "Sanjay Gupta", type: "Blood", reason: "Hemolyzed sample", rejectedBy: "Tech. Amit", time: "Yesterday 3:30 PM", recollection: "Pending" },
  { sampleId: "S-20250307-042", orderId: "LO-4495", uhid: "UH-2024-0210", patient: "Pooja Yadav", type: "Urine", reason: "Insufficient quantity", rejectedBy: "Tech. Neha", time: "Yesterday 2:00 PM", recollection: "Collected" },
];

const STORAGE = [
  { sampleId: "S-20250305-018", uhid: "UH-2024-0012", patient: "Ramesh Kumar", type: "Blood", location: "Freezer A, Rack 3", storedSince: "Mar 5, 2025", expiry: "Mar 12, 2025", purpose: "Pending retest" },
  { sampleId: "S-20250304-009", uhid: "UH-2024-0130", patient: "Arjun Reddy", type: "Tissue Biopsy", location: "Freezer B, Rack 1", storedSince: "Mar 4, 2025", expiry: "Jun 4, 2025", purpose: "Histopathology reference" },
];

const statusColor = (s: string) => {
  if (s === "Analysis Complete") return "default";
  if (s === "In Analysis" || s === "Processing") return "secondary";
  if (s === "Rejected") return "destructive";
  return "outline";
};

export default function LabSamples() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = SAMPLES.filter(s => {
    const matchSearch = s.patient.toLowerCase().includes(search.toLowerCase()) || s.uhid.includes(search) || s.sampleId.includes(search);
    const matchType = typeFilter === "all" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Samples</h1>
          <p className="text-sm text-muted-foreground mt-1">Sample collection, reception, barcode tracking & storage</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><TestTube className="h-4 w-4 mr-1" /> Register Sample</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Register Sample Collection</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Lab Order ID</Label><Input placeholder="LO-XXXX" /></div>
              <div><Label>Patient (UHID)</Label><Input placeholder="Search patient..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Sample Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Blood</SelectItem>
                      <SelectItem value="urine">Urine</SelectItem>
                      <SelectItem value="stool">Stool</SelectItem>
                      <SelectItem value="saliva">Saliva</SelectItem>
                      <SelectItem value="tissue">Tissue Biopsy</SelectItem>
                      <SelectItem value="swab">Swab</SelectItem>
                      <SelectItem value="arterial">Arterial Blood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Collector</Label><Input placeholder="Collector name" /></div>
              </div>
              <div><Label>Sample Condition</Label>
                <Select><SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="hemolyzed">Hemolyzed</SelectItem>
                    <SelectItem value="lipemic">Lipemic</SelectItem>
                    <SelectItem value="clotted">Clotted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Notes</Label><Textarea placeholder="Any observations..." /></div>
              <Button className="w-full">Register & Generate Barcode</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tracking">
        <TabsList>
          <TabsTrigger value="tracking"><Barcode className="h-3.5 w-3.5 mr-1" /> Sample Tracking</TabsTrigger>
          <TabsTrigger value="rejected"><XCircle className="h-3.5 w-3.5 mr-1" /> Rejected ({REJECTED.length})</TabsTrigger>
          <TabsTrigger value="storage"><Archive className="h-3.5 w-3.5 mr-1" /> Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search sample ID, patient, UHID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Blood">Blood</SelectItem>
                <SelectItem value="Arterial Blood">Arterial Blood</SelectItem>
                <SelectItem value="Urine">Urine</SelectItem>
                <SelectItem value="Stool">Stool</SelectItem>
                <SelectItem value="Tissue Biopsy">Tissue Biopsy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Collector</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => (
                    <TableRow key={s.sampleId}>
                      <TableCell className="font-mono text-sm text-foreground">{s.sampleId}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{s.patient}</p>
                        <p className="text-xs text-muted-foreground">{s.uhid}</p>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{s.type}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.collector}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.collectedAt}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.receivedAt}</TableCell>
                      <TableCell className="text-xs">{s.condition}</TableCell>
                      <TableCell><Badge variant={statusColor(s.status)} className="text-xs">{s.status}</Badge></TableCell>
                      <TableCell>
                        {s.status === "Collected" && <Button size="sm" variant="outline" className="text-xs h-7">Receive</Button>}
                        {s.status === "Received" && <Button size="sm" variant="outline" className="text-xs h-7">Process</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-4">
          {REJECTED.map(r => (
            <Card key={r.sampleId} className="border-border border-l-4 border-l-destructive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{r.sampleId}</span>
                    <Badge variant="destructive" className="text-xs">Rejected</Badge>
                  </div>
                  <Badge variant={r.recollection === "Collected" ? "default" : "outline"} className="text-xs">Recollection: {r.recollection}</Badge>
                </div>
                <p className="text-sm font-medium text-foreground">{r.patient} <span className="text-muted-foreground font-normal">· {r.uhid}</span></p>
                <p className="text-xs text-muted-foreground">{r.type} · Reason: {r.reason} · By {r.rejectedBy} · {r.time}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="storage" className="mt-4">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stored Since</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STORAGE.map(st => (
                    <TableRow key={st.sampleId}>
                      <TableCell className="font-mono text-sm text-foreground">{st.sampleId}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{st.patient}</p>
                        <p className="text-xs text-muted-foreground">{st.uhid}</p>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{st.type}</Badge></TableCell>
                      <TableCell className="text-sm">{st.location}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{st.storedSince}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{st.expiry}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{st.purpose}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
