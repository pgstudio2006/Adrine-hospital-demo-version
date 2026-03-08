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
import { Activity, Droplets, Heart, Search, Thermometer, Wind } from "lucide-react";

const VITALS_LOG = [
  { id: "V001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", bp: "128/82", pulse: 88, rr: 18, temp: 98.6, spo2: 95, nurse: "Nurse Priya", time: "08:00 AM", flag: "" },
  { id: "V002", uhid: "UH-2024-0103", patient: "Vikram Singh", bed: "ICU-07", bp: "110/70", pulse: 102, rr: 22, temp: 100.2, spo2: 92, nurse: "Nurse Priya", time: "08:05 AM", flag: "SpO2 low" },
  { id: "V003", uhid: "UH-2024-0045", patient: "Anita Sharma", bed: "W2-05", bp: "118/76", pulse: 78, rr: 16, temp: 99.1, spo2: 97, nurse: "Nurse Priya", time: "08:15 AM", flag: "" },
  { id: "V004", uhid: "UH-2024-0078", patient: "Suresh Patel", bed: "W2-08", bp: "140/90", pulse: 82, rr: 17, temp: 98.4, spo2: 98, nurse: "Nurse Priya", time: "08:20 AM", flag: "BP high" },
];

const IO_RECORDS = [
  { id: "IO001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", intakeOral: 100, intakeIV: 500, intakeBlood: 0, outputUrine: 200, outputDrain: 50, outputVomit: 0, balance: "+350", time: "08:00 AM", nurse: "Nurse Priya" },
  { id: "IO002", uhid: "UH-2024-0103", patient: "Vikram Singh", bed: "ICU-07", intakeOral: 0, intakeIV: 1000, intakeBlood: 0, outputUrine: 320, outputDrain: 0, outputVomit: 0, balance: "+680", time: "08:00 AM", nurse: "Nurse Priya" },
];

const PAIN_ASSESSMENTS = [
  { id: "PA001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", score: 6, location: "Chest / Sternum", description: "Dull ache, worse on deep breathing", time: "08:00 AM" },
  { id: "PA002", uhid: "UH-2024-0078", patient: "Suresh Patel", score: 4, location: "Right hip", description: "Moderate pain on movement, manageable at rest", time: "08:20 AM" },
  { id: "PA003", uhid: "UH-2024-0103", patient: "Vikram Singh", score: 2, location: "General", description: "Sedated, minimal response to pain stimuli", time: "08:05 AM" },
];

const painColor = (score: number) => {
  if (score >= 7) return "destructive";
  if (score >= 4) return "secondary";
  return "outline";
};

export default function NurseVitals() {
  const [search, setSearch] = useState("");

  const filteredVitals = VITALS_LOG.filter(v =>
    v.patient.toLowerCase().includes(search.toLowerCase()) || v.uhid.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Vitals & Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">Vital signs, intake/output, pain assessment & fall risk</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Activity className="h-4 w-4 mr-1" /> Record Vitals</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Record Vital Signs</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Patient (UHID)</Label><Input placeholder="Search patient..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Blood Pressure</Label><Input placeholder="e.g. 120/80" /></div>
                <div><Label>Pulse Rate (bpm)</Label><Input type="number" placeholder="72" /></div>
                <div><Label>Respiratory Rate</Label><Input type="number" placeholder="16" /></div>
                <div><Label>Temperature (°F)</Label><Input type="number" step="0.1" placeholder="98.6" /></div>
                <div><Label>SpO2 (%)</Label><Input type="number" placeholder="98" /></div>
                <div><Label>Blood Sugar (mg/dL)</Label><Input type="number" placeholder="Optional" /></div>
                <div><Label>Height (cm)</Label><Input type="number" placeholder="Optional" /></div>
                <div><Label>Weight (kg)</Label><Input type="number" placeholder="Optional" /></div>
              </div>
              <div><Label>Observations</Label><Textarea placeholder="Any clinical observations..." /></div>
              <Button className="w-full">Save Vitals</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="vitals">
        <TabsList>
          <TabsTrigger value="vitals"><Heart className="h-3.5 w-3.5 mr-1" /> Vital Signs</TabsTrigger>
          <TabsTrigger value="io"><Droplets className="h-3.5 w-3.5 mr-1" /> Intake / Output</TabsTrigger>
          <TabsTrigger value="pain"><Thermometer className="h-3.5 w-3.5 mr-1" /> Pain Assessment</TabsTrigger>
          <TabsTrigger value="fallrisk"><Wind className="h-3.5 w-3.5 mr-1" /> Fall Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patient..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>BP</TableHead>
                    <TableHead>Pulse</TableHead>
                    <TableHead>RR</TableHead>
                    <TableHead>Temp</TableHead>
                    <TableHead>SpO2</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Flag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVitals.map(v => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{v.patient}</p>
                        <p className="text-xs text-muted-foreground">{v.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{v.bed}</TableCell>
                      <TableCell className="text-sm font-mono">{v.bp}</TableCell>
                      <TableCell className="text-sm font-mono">{v.pulse}</TableCell>
                      <TableCell className="text-sm font-mono">{v.rr}</TableCell>
                      <TableCell className="text-sm font-mono">{v.temp}°F</TableCell>
                      <TableCell className={`text-sm font-mono ${v.spo2 < 94 ? 'text-destructive font-bold' : ''}`}>{v.spo2}%</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{v.time}</TableCell>
                      <TableCell>{v.flag && <Badge variant="destructive" className="text-xs">{v.flag}</Badge>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="io" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Fluid intake and output tracking</p>
            <Button size="sm" variant="outline">+ Record I/O</Button>
          </div>
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>Oral (ml)</TableHead>
                    <TableHead>IV (ml)</TableHead>
                    <TableHead>Blood (ml)</TableHead>
                    <TableHead>Urine (ml)</TableHead>
                    <TableHead>Drain (ml)</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {IO_RECORDS.map(io => (
                    <TableRow key={io.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{io.patient}</p>
                        <p className="text-xs text-muted-foreground">{io.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{io.bed}</TableCell>
                      <TableCell className="text-sm font-mono">{io.intakeOral}</TableCell>
                      <TableCell className="text-sm font-mono">{io.intakeIV}</TableCell>
                      <TableCell className="text-sm font-mono">{io.intakeBlood}</TableCell>
                      <TableCell className="text-sm font-mono">{io.outputUrine}</TableCell>
                      <TableCell className="text-sm font-mono">{io.outputDrain}</TableCell>
                      <TableCell className="text-sm font-mono font-bold">{io.balance}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{io.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pain" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Pain assessment records (0-10 scale)</p>
            <Button size="sm" variant="outline">+ Assess Pain</Button>
          </div>
          <div className="space-y-2">
            {PAIN_ASSESSMENTS.map(pa => (
              <Card key={pa.id} className="border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex flex-col items-center min-w-[50px]">
                    <Badge variant={painColor(pa.score)} className="text-lg w-10 h-10 rounded-full flex items-center justify-center">{pa.score}</Badge>
                    <span className="text-[10px] text-muted-foreground mt-1">/10</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{pa.patient} <span className="text-muted-foreground font-normal">· {pa.uhid}</span></p>
                    <p className="text-sm text-foreground">{pa.location}: {pa.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pa.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fallrisk" className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">Morse Fall Scale assessment for admitted patients</p>
          <div className="space-y-2">
            {[
              { patient: "Ramesh Kumar", uhid: "UH-2024-0012", bed: "ICU-03", risk: "High", score: 65, measures: "Bed rails up, call bell within reach, non-slip socks", date: "2025-03-08" },
              { patient: "Suresh Patel", uhid: "UH-2024-0078", bed: "W2-08", risk: "High", score: 55, measures: "Assisted mobility only, walker provided, bed alarm active", date: "2025-03-08" },
              { patient: "Meena Devi", uhid: "UH-2024-0091", bed: "W3-02", risk: "Moderate", score: 35, measures: "Non-slip footwear, assisted to bathroom", date: "2025-03-08" },
              { patient: "Anita Sharma", uhid: "UH-2024-0045", bed: "W2-05", risk: "Low", score: 15, measures: "Standard precautions", date: "2025-03-08" },
            ].map(fr => (
              <Card key={fr.uhid} className="border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <Badge variant={fr.risk === "High" ? "destructive" : fr.risk === "Moderate" ? "secondary" : "outline"} className="min-w-[70px] justify-center">{fr.risk}</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{fr.patient} <span className="text-muted-foreground font-normal">· {fr.uhid} · {fr.bed}</span></p>
                    <p className="text-xs text-muted-foreground">Morse Score: {fr.score} · {fr.measures}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">Reassess</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
