import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle, Clock, Pill, Search, XCircle } from "lucide-react";

interface MedSchedule {
  id: string;
  uhid: string;
  patient: string;
  bed: string;
  drug: string;
  dosage: string;
  route: string;
  frequency: string;
  scheduledTime: string;
  status: "pending" | "administered" | "missed" | "delayed" | "refused";
  doctor: string;
  notes?: string;
}

const MED_SCHEDULE: MedSchedule[] = [
  { id: "MS001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", drug: "Ceftriaxone", dosage: "1g", route: "IV", frequency: "BD", scheduledTime: "10:00 AM", status: "pending", doctor: "Dr. Anil Mehta" },
  { id: "MS002", uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", drug: "Enoxaparin", dosage: "40mg", route: "SC", frequency: "OD", scheduledTime: "10:00 AM", status: "pending", doctor: "Dr. Anil Mehta" },
  { id: "MS003", uhid: "UH-2024-0103", patient: "Vikram Singh", bed: "ICU-07", drug: "Meropenem", dosage: "1g", route: "IV", frequency: "TID", scheduledTime: "10:00 AM", status: "pending", doctor: "Dr. Anil Mehta" },
  { id: "MS004", uhid: "UH-2024-0103", patient: "Vikram Singh", bed: "ICU-07", drug: "Midazolam", dosage: "2mg/hr", route: "IV infusion", frequency: "Continuous", scheduledTime: "Ongoing", status: "administered", doctor: "Dr. Anil Mehta" },
  { id: "MS005", uhid: "UH-2024-0045", patient: "Anita Sharma", bed: "W2-05", drug: "Amoxicillin", dosage: "500mg", route: "PO", frequency: "TID", scheduledTime: "08:00 AM", status: "refused", doctor: "Dr. Priya Gupta", notes: "Patient refused due to rash, doctor notified" },
  { id: "MS006", uhid: "UH-2024-0078", patient: "Suresh Patel", bed: "W2-08", drug: "Tramadol", dosage: "50mg", route: "PO", frequency: "TID", scheduledTime: "08:00 AM", status: "administered", doctor: "Dr. Rajesh Shah" },
  { id: "MS007", uhid: "UH-2024-0078", patient: "Suresh Patel", bed: "W2-08", drug: "Pantoprazole", dosage: "40mg", route: "IV", frequency: "OD", scheduledTime: "07:00 AM", status: "delayed", doctor: "Dr. Rajesh Shah", notes: "Delayed by 30 min, IV access difficult" },
  { id: "MS008", uhid: "UH-2024-0091", patient: "Meena Devi", bed: "W3-02", drug: "Insulin Glargine", dosage: "16 units", route: "SC", frequency: "OD", scheduledTime: "08:00 AM", status: "administered", doctor: "Dr. Sunita Joshi" },
];

const statusConfig: Record<string, { icon: React.ReactNode; color: "default" | "destructive" | "secondary" | "outline" }> = {
  pending: { icon: <Clock className="h-3.5 w-3.5" />, color: "outline" },
  administered: { icon: <CheckCircle className="h-3.5 w-3.5" />, color: "default" },
  missed: { icon: <XCircle className="h-3.5 w-3.5" />, color: "destructive" },
  delayed: { icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "secondary" },
  refused: { icon: <XCircle className="h-3.5 w-3.5" />, color: "destructive" },
};

export default function NurseMedications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = MED_SCHEDULE.filter(m => {
    const matchSearch = m.patient.toLowerCase().includes(search.toLowerCase()) || m.uhid.includes(search) || m.drug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = MED_SCHEDULE.filter(m => m.status === "pending").length;
  const administeredCount = MED_SCHEDULE.filter(m => m.status === "administered").length;
  const issueCount = MED_SCHEDULE.filter(m => m.status === "missed" || m.status === "delayed" || m.status === "refused").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Medications</h1>
          <p className="text-sm text-muted-foreground mt-1">Medication schedule, administration & MAR tracking</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Pill className="h-4 w-4 mr-1" /> Record Administration</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Medication Administration</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Patient (UHID)</Label><Input placeholder="Search patient..." /></div>
              <div><Label>Drug</Label><Input placeholder="Medication name..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Dosage</Label><Input placeholder="e.g. 500mg" /></div>
                <div><Label>Route</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Route" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PO">Oral (PO)</SelectItem>
                      <SelectItem value="IV">IV</SelectItem>
                      <SelectItem value="IM">IM</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="Topical">Topical</SelectItem>
                      <SelectItem value="Inhaled">Inhaled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Status</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administered">Administered</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="refused">Refused by Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Notes</Label><Textarea placeholder="Any observations..." /></div>
              <Button className="w-full">Save Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Administered</p>
          <p className="text-2xl font-bold text-foreground">{administeredCount}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Issues</p>
          <p className="text-2xl font-bold text-foreground">{issueCount}</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient, UHID or drug..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="administered">Administered</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="refused">Refused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Schedule Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Drug</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => {
                const sc = statusConfig[m.status];
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <p className="font-medium text-sm text-foreground">{m.patient}</p>
                      <p className="text-xs text-muted-foreground">{m.uhid} · {m.bed}</p>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{m.drug}</TableCell>
                    <TableCell className="text-sm">{m.dosage}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{m.route}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.frequency}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.scheduledTime}</TableCell>
                    <TableCell>
                      <Badge variant={sc.color} className="text-xs gap-1">
                        {sc.icon} {m.status}
                      </Badge>
                      {m.notes && <p className="text-[10px] text-muted-foreground mt-1 max-w-[150px] truncate">{m.notes}</p>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.doctor}</TableCell>
                    <TableCell>
                      {m.status === "pending" && (
                        <Button size="sm" variant="outline" className="text-xs h-7">Administer</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
