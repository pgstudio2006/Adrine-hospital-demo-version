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
import { ArrowRightLeft, Bed, Search, UserCheck, Users } from "lucide-react";

const WARDS = ["Ward 1", "Ward 2", "Ward 3", "ICU", "NICU", "Emergency"];

const ASSIGNMENTS = [
  { id: "A001", nurse: "Nurse Priya", uhid: "UH-2024-0012", patient: "Ramesh Kumar", ward: "ICU", bed: "ICU-03", shift: "Morning", start: "08:00", end: "14:00", status: "active" },
  { id: "A002", nurse: "Nurse Priya", uhid: "UH-2024-0045", patient: "Anita Sharma", ward: "Ward 2", bed: "W2-05", shift: "Morning", start: "08:00", end: "14:00", status: "active" },
  { id: "A003", nurse: "Nurse Priya", uhid: "UH-2024-0078", patient: "Suresh Patel", ward: "Ward 2", bed: "W2-08", shift: "Morning", start: "08:00", end: "14:00", status: "active" },
  { id: "A004", nurse: "Nurse Rekha", uhid: "UH-2024-0091", patient: "Meena Devi", ward: "Ward 3", bed: "W3-02", shift: "Morning", start: "08:00", end: "14:00", status: "active" },
  { id: "A005", nurse: "Nurse Rekha", uhid: "UH-2024-0103", patient: "Vikram Singh", ward: "ICU", bed: "ICU-07", shift: "Morning", start: "08:00", end: "14:00", status: "active" },
  { id: "A006", nurse: "Nurse Sunita", uhid: "UH-2024-0115", patient: "Geeta Rao", ward: "Ward 1", bed: "W1-01", shift: "Evening", start: "14:00", end: "22:00", status: "upcoming" },
];

const HANDOVERS = [
  { id: "H001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", outgoing: "Nurse Kavita", incoming: "Nurse Priya", shift: "Night→Morning", notes: "SpO2 stable overnight at 94-96%. IV antibiotics due at 10 AM. Watch for chest pain.", time: "07:55 AM" },
  { id: "H002", uhid: "UH-2024-0103", patient: "Vikram Singh", outgoing: "Nurse Kavita", incoming: "Nurse Priya", shift: "Night→Morning", notes: "Ventilator settings unchanged. Sedation reduced at 5 AM. Urine output 40ml/hr. BP stable.", time: "07:50 AM" },
];

const INFECTION_CASES = [
  { uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", type: "MRSA", precaution: "Contact isolation", status: "Active" },
  { uhid: "UH-2024-0078", patient: "Suresh Patel", bed: "W2-08", type: "Surgical site infection", precaution: "Standard", status: "Monitoring" },
];

export default function NurseWard() {
  const [search, setSearch] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");

  const filtered = ASSIGNMENTS.filter(a => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.uhid.includes(search);
    const matchWard = selectedWard === "all" || a.ward === selectedWard;
    return matchSearch && matchWard;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Ward</h1>
          <p className="text-sm text-muted-foreground mt-1">Patient assignments, shift handovers & infection control</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><ArrowRightLeft className="h-4 w-4 mr-1" /> Transfer Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Transfer Patient Care</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Patient (UHID)</Label><Input placeholder="Search patient..." /></div>
              <div><Label>Transfer to Nurse</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select nurse" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rekha">Nurse Rekha</SelectItem>
                    <SelectItem value="sunita">Nurse Sunita</SelectItem>
                    <SelectItem value="kavita">Nurse Kavita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Transfer Reason</Label><Textarea placeholder="Reason for transfer..." /></div>
              <Button className="w-full">Confirm Transfer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments"><Users className="h-3.5 w-3.5 mr-1" /> Assignments</TabsTrigger>
          <TabsTrigger value="handover"><ArrowRightLeft className="h-3.5 w-3.5 mr-1" /> Shift Handover</TabsTrigger>
          <TabsTrigger value="infection"><UserCheck className="h-3.5 w-3.5 mr-1" /> Infection Control</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patient or UHID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Ward / Bed</TableHead>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{a.patient}</p>
                        <p className="text-xs text-muted-foreground">{a.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{a.ward} · {a.bed}</TableCell>
                      <TableCell className="text-sm">{a.nurse}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{a.shift}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.start} – {a.end}</TableCell>
                      <TableCell><Badge variant={a.status === "active" ? "default" : "secondary"} className="text-xs">{a.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handover" className="mt-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today's Shift Handovers</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {HANDOVERS.map(h => (
                <div key={h.id} className="px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{h.patient} <span className="text-muted-foreground font-normal">· {h.uhid}</span></p>
                      <p className="text-xs text-muted-foreground">{h.outgoing} → {h.incoming} · {h.shift}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{h.time}</span>
                  </div>
                  <p className="text-sm text-foreground bg-muted/50 rounded p-2">{h.notes}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full">+ Add Handover Note</Button>
        </TabsContent>

        <TabsContent value="infection" className="mt-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Infection Control Tracking</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>Infection Type</TableHead>
                    <TableHead>Precaution</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INFECTION_CASES.map(ic => (
                    <TableRow key={ic.uhid}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{ic.patient}</p>
                        <p className="text-xs text-muted-foreground">{ic.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{ic.bed}</TableCell>
                      <TableCell className="text-sm">{ic.type}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{ic.precaution}</Badge></TableCell>
                      <TableCell><Badge variant={ic.status === "Active" ? "destructive" : "secondary"} className="text-xs">{ic.status}</Badge></TableCell>
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
