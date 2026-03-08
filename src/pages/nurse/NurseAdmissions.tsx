import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, ClipboardList, FileText, Search, UserPlus } from "lucide-react";

const ADMISSIONS = [
  { uhid: "UH-2024-0012", name: "Ramesh Kumar", age: 58, gender: "M", ward: "ICU", bed: "ICU-03", doctor: "Dr. Anil Mehta", diagnosis: "Post-CABG", admDate: "2025-03-05", status: "Active", diet: "Liquid", mobility: "Bed rest" },
  { uhid: "UH-2024-0045", name: "Anita Sharma", age: 34, gender: "F", ward: "Ward 2", bed: "W2-05", doctor: "Dr. Priya Gupta", diagnosis: "Pneumonia", admDate: "2025-03-06", status: "Active", diet: "Soft", mobility: "Assisted" },
  { uhid: "UH-2024-0078", name: "Suresh Patel", age: 62, gender: "M", ward: "Ward 2", bed: "W2-08", doctor: "Dr. Rajesh Shah", diagnosis: "Hip replacement", admDate: "2025-03-07", status: "Active", diet: "Regular", mobility: "Assisted" },
  { uhid: "UH-2024-0103", name: "Vikram Singh", age: 45, gender: "M", ward: "ICU", bed: "ICU-07", doctor: "Dr. Anil Mehta", diagnosis: "Respiratory failure", admDate: "2025-03-04", status: "Critical", diet: "NPO", mobility: "Immobilized" },
  { uhid: "UH-2024-0115", name: "Geeta Rao", age: 28, gender: "F", ward: "Ward 1", bed: "W1-01", doctor: "Dr. Sunita Joshi", diagnosis: "Appendectomy", admDate: "2025-03-07", status: "Active", diet: "Liquid", mobility: "Assisted" },
];

const NURSING_NOTES = [
  { id: "N001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", nurse: "Nurse Priya", type: "Shift Note", content: "Patient stable. Chest drain output 50ml. Pain managed with IV paracetamol. SpO2 maintained at 95%.", time: "09:30 AM" },
  { id: "N002", uhid: "UH-2024-0103", patient: "Vikram Singh", nurse: "Nurse Priya", type: "Observation", content: "Patient responsive to verbal commands. Ventilator weaning attempted, tolerated for 30 min. FiO2 reduced to 40%.", time: "09:15 AM" },
  { id: "N003", uhid: "UH-2024-0045", patient: "Anita Sharma", nurse: "Nurse Priya", type: "Incident Report", content: "Patient developed rash on arms after Amoxicillin dose. Doctor notified. Medication held pending review.", time: "08:45 AM" },
];

const INCIDENTS = [
  { id: "INC001", uhid: "UH-2024-0045", patient: "Anita Sharma", type: "Medication Reaction", desc: "Allergic rash after Amoxicillin administration", severity: "Moderate", reporter: "Nurse Priya", time: "08:45 AM", status: "Reported" },
  { id: "INC002", uhid: "UH-2024-0091", patient: "Meena Devi", type: "Patient Fall", desc: "Patient attempted to walk to bathroom, slipped near bed", severity: "Minor", reporter: "Nurse Rekha", time: "Yesterday 11 PM", status: "Investigated" },
];

export default function NurseAdmissions() {
  const [search, setSearch] = useState("");

  const filtered = ADMISSIONS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.uhid.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Admitted patients, nursing notes & incident reports</p>
        </div>
      </div>

      <Tabs defaultValue="patients">
        <TabsList>
          <TabsTrigger value="patients"><Bed className="h-3.5 w-3.5 mr-1" /> Admitted Patients</TabsTrigger>
          <TabsTrigger value="notes"><FileText className="h-3.5 w-3.5 mr-1" /> Nursing Notes</TabsTrigger>
          <TabsTrigger value="incidents"><ClipboardList className="h-3.5 w-3.5 mr-1" /> Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patient or UHID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Ward / Bed</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Diet</TableHead>
                    <TableHead>Mobility</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(a => (
                    <TableRow key={a.uhid}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.uhid} · {a.age}{a.gender} · Adm: {a.admDate}</p>
                      </TableCell>
                      <TableCell className="text-sm">{a.ward} · {a.bed}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.doctor}</TableCell>
                      <TableCell className="text-sm">{a.diagnosis}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{a.diet}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{a.mobility}</Badge></TableCell>
                      <TableCell><Badge variant={a.status === "Critical" ? "destructive" : "default"} className="text-xs">{a.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Recent nursing notes from your shift</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><FileText className="h-4 w-4 mr-1" /> Add Note</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Nursing Note</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div><Label>Patient (UHID)</Label><Input placeholder="Search patient..." /></div>
                  <div><Label>Note Type</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shift">Shift Note</SelectItem>
                        <SelectItem value="observation">Observation</SelectItem>
                        <SelectItem value="incident">Incident Report</SelectItem>
                        <SelectItem value="complaint">Patient Complaint</SelectItem>
                        <SelectItem value="condition">Condition Change</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Note Content</Label><Textarea rows={4} placeholder="Describe observations..." /></div>
                  <Button className="w-full">Save Note</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card className="border-border">
            <CardContent className="p-0 divide-y divide-border">
              {NURSING_NOTES.map(n => (
                <div key={n.id} className="px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{n.type}</Badge>
                      <span className="text-sm font-medium text-foreground">{n.patient}</span>
                      <span className="text-xs text-muted-foreground">{n.uhid}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{n.nurse} · {n.time}</div>
                  </div>
                  <p className="text-sm text-foreground bg-muted/50 rounded p-2">{n.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Adverse event reports</p>
            <Button size="sm" variant="destructive"><ClipboardList className="h-4 w-4 mr-1" /> Report Incident</Button>
          </div>
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INCIDENTS.map(i => (
                    <TableRow key={i.id}>
                      <TableCell className="text-xs font-mono text-muted-foreground">{i.id}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{i.patient}</p>
                        <p className="text-xs text-muted-foreground">{i.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{i.type}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{i.desc}</TableCell>
                      <TableCell><Badge variant={i.severity === "Moderate" ? "destructive" : "secondary"} className="text-xs">{i.severity}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{i.reporter}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{i.status}</Badge></TableCell>
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
