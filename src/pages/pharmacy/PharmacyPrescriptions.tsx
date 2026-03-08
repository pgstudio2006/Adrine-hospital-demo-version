import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, CheckCircle, XCircle, AlertTriangle, Pill } from "lucide-react";

type RxStatus = "Pending" | "Verified" | "Dispensed" | "Partially dispensed" | "Cancelled";

interface Medication {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  qty: number;
  dispensed: number;
  interaction?: string;
}

interface Prescription {
  id: string;
  uhid: string;
  patient: string;
  doctor: string;
  dept: string;
  date: string;
  priority: "Routine" | "Urgent" | "Emergency";
  status: RxStatus;
  meds: Medication[];
}

const prescriptions: Prescription[] = [
  {
    id: "RX-2401", uhid: "UH-10042", patient: "Ravi Sharma", doctor: "Dr. Patel", dept: "Medicine", date: "2026-03-08",
    priority: "Urgent", status: "Pending",
    meds: [
      { drug: "Amoxicillin 500mg", dosage: "500mg", frequency: "TID", duration: "7 days", route: "Oral", qty: 21, dispensed: 0 },
      { drug: "Paracetamol 650mg", dosage: "650mg", frequency: "SOS", duration: "5 days", route: "Oral", qty: 10, dispensed: 0 },
      { drug: "Omeprazole 20mg", dosage: "20mg", frequency: "OD", duration: "7 days", route: "Oral", qty: 7, dispensed: 0 },
      { drug: "Cetirizine 10mg", dosage: "10mg", frequency: "OD", duration: "5 days", route: "Oral", qty: 5, dispensed: 0 },
    ],
  },
  {
    id: "RX-2400", uhid: "UH-10038", patient: "Anita Desai", doctor: "Dr. Mehta", dept: "Cardiology", date: "2026-03-08",
    priority: "Routine", status: "Verified",
    meds: [
      { drug: "Atorvastatin 20mg", dosage: "20mg", frequency: "OD", duration: "30 days", route: "Oral", qty: 30, dispensed: 0 },
      { drug: "Aspirin 75mg", dosage: "75mg", frequency: "OD", duration: "30 days", route: "Oral", qty: 30, dispensed: 0, interaction: "Monitor with Atorvastatin — mild interaction" },
    ],
  },
  {
    id: "RX-2399", uhid: "UH-10035", patient: "Suresh Kumar", doctor: "Dr. Rao", dept: "Orthopedics", date: "2026-03-08",
    priority: "Routine", status: "Dispensed",
    meds: [
      { drug: "Diclofenac 50mg", dosage: "50mg", frequency: "BID", duration: "5 days", route: "Oral", qty: 10, dispensed: 10 },
      { drug: "Calcium + Vit D3", dosage: "500mg", frequency: "OD", duration: "30 days", route: "Oral", qty: 30, dispensed: 30 },
    ],
  },
  {
    id: "RX-2398", uhid: "UH-10029", patient: "Meena Joshi", doctor: "Dr. Shah", dept: "ENT", date: "2026-03-07",
    priority: "Urgent", status: "Partially dispensed",
    meds: [
      { drug: "Azithromycin 500mg", dosage: "500mg", frequency: "OD", duration: "3 days", route: "Oral", qty: 3, dispensed: 3 },
      { drug: "Fluticasone Nasal Spray", dosage: "50mcg", frequency: "BID", duration: "14 days", route: "Nasal", qty: 1, dispensed: 0 },
      { drug: "Montelukast 10mg", dosage: "10mg", frequency: "OD", duration: "14 days", route: "Oral", qty: 14, dispensed: 0 },
    ],
  },
  {
    id: "RX-2397", uhid: "UH-10021", patient: "Vikram Singh", doctor: "Dr. Gupta", dept: "Emergency", date: "2026-03-07",
    priority: "Emergency", status: "Dispensed",
    meds: [
      { drug: "Morphine 10mg", dosage: "10mg", frequency: "STAT", duration: "Single dose", route: "IV", qty: 1, dispensed: 1 },
    ],
  },
];

const statusColor: Record<RxStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Verified: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Dispensed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Partially dispensed": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function PharmacyPrescriptions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [dispenseQtys, setDispenseQtys] = useState<Record<number, number>>({});
  const [rejectNote, setRejectNote] = useState("");

  const filtered = prescriptions.filter(rx => {
    const matchesSearch = rx.patient.toLowerCase().includes(search.toLowerCase()) || rx.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || rx.status === filter;
    return matchesSearch && matchesFilter;
  });

  const openDispense = (rx: Prescription) => {
    setSelected(rx);
    const initial: Record<number, number> = {};
    rx.meds.forEach((m, i) => { initial[i] = m.qty - m.dispensed; });
    setDispenseQtys(initial);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
        <p className="text-muted-foreground text-sm">Verify and dispense doctor prescriptions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by patient name or Rx ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Dispensed">Dispensed</SelectItem>
            <SelectItem value="Partially dispensed">Partially Dispensed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rx ID</TableHead>
                <TableHead>UHID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Dept</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(rx => (
                <TableRow key={rx.id}>
                  <TableCell className="font-mono text-sm">{rx.id}</TableCell>
                  <TableCell className="text-muted-foreground">{rx.uhid}</TableCell>
                  <TableCell className="font-medium">{rx.patient}</TableCell>
                  <TableCell>{rx.doctor}</TableCell>
                  <TableCell className="text-muted-foreground">{rx.dept}</TableCell>
                  <TableCell>{rx.meds.length}</TableCell>
                  <TableCell>
                    <Badge variant={rx.priority === "Emergency" ? "destructive" : rx.priority === "Urgent" ? "default" : "secondary"} className="text-xs">{rx.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[rx.status]}`}>{rx.status}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelected(rx)}><Eye className="h-4 w-4" /></Button>
                      {(rx.status === "Pending" || rx.status === "Verified" || rx.status === "Partially dispensed") && (
                        <Button variant="ghost" size="icon" onClick={() => openDispense(rx)}><Pill className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Prescription Detail / Dispense Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Prescription {selected.id}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient}</span></div>
                <div><span className="text-muted-foreground">UHID:</span> {selected.uhid}</div>
                <div><span className="text-muted-foreground">Doctor:</span> {selected.doctor}</div>
                <div><span className="text-muted-foreground">Department:</span> {selected.dept}</div>
                <div><span className="text-muted-foreground">Date:</span> {selected.date}</div>
                <div><span className="text-muted-foreground">Priority:</span> <Badge variant={selected.priority === "Emergency" ? "destructive" : "secondary"} className="text-xs">{selected.priority}</Badge></div>
              </div>

              <Tabs defaultValue="medications" className="mt-4">
                <TabsList>
                  <TabsTrigger value="medications">Medications ({selected.meds.length})</TabsTrigger>
                  <TabsTrigger value="dispense">Dispense</TabsTrigger>
                </TabsList>
                <TabsContent value="medications" className="space-y-3 mt-3">
                  {selected.meds.map((m, i) => (
                    <div key={i} className="border border-border rounded-lg p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{m.drug}</span>
                        {m.interaction && <Badge variant="outline" className="text-xs text-yellow-600"><AlertTriangle className="h-3 w-3 mr-1" />{m.interaction}</Badge>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <span>Dose: {m.dosage}</span>
                        <span>Freq: {m.frequency}</span>
                        <span>Duration: {m.duration}</span>
                        <span>Route: {m.route}</span>
                        <span>Qty: {m.qty}</span>
                        <span>Dispensed: {m.dispensed}</span>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="dispense" className="space-y-3 mt-3">
                  {selected.meds.filter(m => m.qty - m.dispensed > 0).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">All medications fully dispensed.</p>
                  ) : (
                    <>
                      {selected.meds.map((m, i) => {
                        const remaining = m.qty - m.dispensed;
                        if (remaining <= 0) return null;
                        return (
                          <div key={i} className="flex items-center justify-between border border-border rounded-lg p-3">
                            <div>
                              <p className="font-medium text-sm text-foreground">{m.drug}</p>
                              <p className="text-xs text-muted-foreground">Remaining: {remaining} units</p>
                            </div>
                            <Input
                              type="number"
                              min={0}
                              max={remaining}
                              value={dispenseQtys[i] ?? remaining}
                              onChange={e => setDispenseQtys(prev => ({ ...prev, [i]: Number(e.target.value) }))}
                              className="w-20"
                            />
                          </div>
                        );
                      })}
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1" onClick={() => setSelected(null)}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Dispense
                        </Button>
                      </div>
                    </>
                  )}
                  <div className="border-t border-border pt-3 space-y-2">
                    <p className="text-sm font-medium text-foreground">Reject Prescription</p>
                    <Textarea placeholder="Reason for rejection..." value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={2} />
                    <Button variant="destructive" size="sm" disabled={!rejectNote.trim()} onClick={() => { setRejectNote(""); setSelected(null); }}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
