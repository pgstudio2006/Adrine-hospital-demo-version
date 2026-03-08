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
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, CheckCircle, ClipboardCheck, LogOut, Search } from "lucide-react";

const DISCHARGE_QUEUE = [
  { uhid: "UH-2024-0115", name: "Geeta Rao", bed: "W1-01", doctor: "Dr. Sunita Joshi", diagnosis: "Appendectomy", admDate: "2025-03-07", dischargeDate: "2025-03-08", status: "Pending Nursing", checklist: { vitals: true, meds: true, education: false, docs: false } },
  { uhid: "UH-2024-0045", name: "Anita Sharma", bed: "W2-05", doctor: "Dr. Priya Gupta", diagnosis: "Pneumonia", admDate: "2025-03-06", dischargeDate: "2025-03-09", status: "Planned", checklist: { vitals: false, meds: false, education: false, docs: false } },
];

const COMPLETED_DISCHARGES = [
  { uhid: "UH-2024-0050", name: "Deepak Verma", bed: "W1-04", doctor: "Dr. Anil Mehta", diagnosis: "Chest infection", discharged: "2025-03-07 02:00 PM", nurse: "Nurse Priya" },
  { uhid: "UH-2024-0032", name: "Lakshmi Nair", bed: "W3-06", doctor: "Dr. Rajesh Shah", diagnosis: "Knee arthroscopy", discharged: "2025-03-06 11:00 AM", nurse: "Nurse Rekha" },
];

const EDUCATION_ITEMS = [
  { id: 1, category: "Medication", instruction: "Take prescribed antibiotics for full 7-day course", done: false },
  { id: 2, category: "Wound Care", instruction: "Keep surgical site clean and dry for 48 hours", done: false },
  { id: 3, category: "Diet", instruction: "Start with liquid diet, progress to soft diet over 2 days", done: false },
  { id: 4, category: "Activity", instruction: "Avoid heavy lifting for 4 weeks, light walking encouraged", done: false },
  { id: 5, category: "Follow-up", instruction: "Visit Dr. Sunita Joshi in 7 days for wound check", done: false },
  { id: 6, category: "Emergency", instruction: "Return to ER if fever >101°F, severe pain, or wound drainage", done: false },
];

export default function NurseDischarge() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Discharge</h1>
        <p className="text-sm text-muted-foreground mt-1">Discharge preparation, patient education & documentation</p>
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue"><LogOut className="h-3.5 w-3.5 mr-1" /> Discharge Queue</TabsTrigger>
          <TabsTrigger value="education"><BookOpen className="h-3.5 w-3.5 mr-1" /> Patient Education</TabsTrigger>
          <TabsTrigger value="completed"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patient..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>

          {DISCHARGE_QUEUE.map(d => (
            <Card key={d.uhid} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.name} <span className="text-muted-foreground font-normal">· {d.uhid}</span></p>
                    <p className="text-xs text-muted-foreground">{d.bed} · {d.doctor} · {d.diagnosis}</p>
                  </div>
                  <Badge variant={d.status === "Pending Nursing" ? "default" : "secondary"} className="text-xs">{d.status}</Badge>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={d.checklist.vitals} disabled /> <span className="text-foreground">Final vitals recorded</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={d.checklist.meds} disabled /> <span className="text-foreground">Discharge meds explained</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={d.checklist.education} disabled /> <span className="text-foreground">Patient education done</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={d.checklist.docs} disabled /> <span className="text-foreground">Documents prepared</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">Complete Checklist</Button>
                  <Button size="sm" className="text-xs" disabled={!d.checklist.vitals || !d.checklist.meds}>Mark Ready</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="education" className="mt-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Patient Education — Geeta Rao (UH-2024-0115)</CardTitle>
              <p className="text-xs text-muted-foreground">Post-Appendectomy discharge instructions</p>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {EDUCATION_ITEMS.map(ei => (
                <div key={ei.id} className="px-4 py-3 flex items-center gap-3">
                  <Checkbox />
                  <Badge variant="outline" className="text-xs min-w-[80px] justify-center">{ei.category}</Badge>
                  <span className="text-sm text-foreground">{ei.instruction}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">Print Instructions</Button>
            <Button className="flex-1">Mark Education Complete</Button>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Discharged</TableHead>
                    <TableHead>Nurse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPLETED_DISCHARGES.map(cd => (
                    <TableRow key={cd.uhid}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{cd.name}</p>
                        <p className="text-xs text-muted-foreground">{cd.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{cd.bed}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{cd.doctor}</TableCell>
                      <TableCell className="text-sm">{cd.diagnosis}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{cd.discharged}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{cd.nurse}</TableCell>
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
