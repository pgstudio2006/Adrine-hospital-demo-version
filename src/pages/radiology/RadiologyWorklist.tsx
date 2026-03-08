import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, CheckCircle, Clock, ScanLine, AlertTriangle } from "lucide-react";

interface WorklistItem {
  id: string;
  patient: string;
  uhid: string;
  procedure: string;
  modality: string;
  bodyPart: string;
  priority: "Routine" | "Urgent" | "Emergency";
  scheduledTime: string;
  equipment: string;
  technician: string;
  status: "Waiting" | "In Progress" | "Completed" | "On Hold";
  prepStatus: "Ready" | "Pending" | "Not Required";
  contrast: boolean;
}

const worklist: WorklistItem[] = [
  { id: "RAD-4501", patient: "Ravi Sharma", uhid: "UH-10042", procedure: "CT Chest with Contrast", modality: "CT Scan", bodyPart: "Chest", priority: "Urgent", scheduledTime: "11:30 AM", equipment: "CT Scanner — Siemens", technician: "Tech. Ramesh", status: "Waiting", prepStatus: "Ready", contrast: true },
  { id: "RAD-4500", patient: "Anita Desai", uhid: "UH-10038", procedure: "X-ray Left Knee AP/Lat", modality: "X-ray", bodyPart: "Left Knee", priority: "Routine", scheduledTime: "11:00 AM", equipment: "X-ray — Philips", technician: "Tech. Sunita", status: "In Progress", prepStatus: "Not Required", contrast: false },
  { id: "RAD-4496", patient: "Deepa Nair", uhid: "UH-10018", procedure: "CT Abdomen with Contrast", modality: "CT Scan", bodyPart: "Abdomen", priority: "Urgent", scheduledTime: "12:00 PM", equipment: "CT Scanner — Siemens", technician: "Tech. Ramesh", status: "Waiting", prepStatus: "Pending", contrast: true },
  { id: "RAD-4495", patient: "Arun Pillai", uhid: "UH-10015", procedure: "MRI Lumbar Spine", modality: "MRI", bodyPart: "Lumbar Spine", priority: "Routine", scheduledTime: "01:00 PM", equipment: "MRI 3T — GE Signa", technician: "Tech. Anil", status: "Waiting", prepStatus: "Ready", contrast: false },
  { id: "RAD-4494", patient: "Kavita Reddy", uhid: "UH-10012", procedure: "Ultrasound Pelvis", modality: "Ultrasound", bodyPart: "Pelvis", priority: "Routine", scheduledTime: "01:30 PM", equipment: "US — Samsung HS60", technician: "Tech. Priya", status: "On Hold", prepStatus: "Pending", contrast: false },
];

const statusColor: Record<string, string> = {
  Waiting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "In Progress": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "On Hold": "bg-muted text-muted-foreground",
};

const prepColor: Record<string, string> = {
  Ready: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Not Required": "bg-muted text-muted-foreground",
};

export default function RadiologyWorklist() {
  const [search, setSearch] = useState("");
  const [modalityFilter, setModalityFilter] = useState("All");
  const [tab, setTab] = useState("active");

  const modalities = ["All", "CT Scan", "MRI", "X-ray", "Ultrasound"];

  const filtered = worklist.filter(w => {
    const matchSearch = w.patient.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase());
    const matchModality = modalityFilter === "All" || w.modality === modalityFilter;
    const matchTab = tab === "active" ? w.status !== "Completed" : w.status === "Completed";
    return matchSearch && matchModality && matchTab;
  });

  const waiting = worklist.filter(w => w.status === "Waiting").length;
  const inProgress = worklist.filter(w => w.status === "In Progress").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Radiology Worklist</h1>
        <p className="text-muted-foreground text-sm">Track scheduled imaging procedures and workflow progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Clock className="h-8 w-8 text-yellow-600" /><div><p className="text-2xl font-bold">{waiting}</p><p className="text-xs text-muted-foreground">Waiting</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><ScanLine className="h-8 w-8 text-purple-600" /><div><p className="text-2xl font-bold">{inProgress}</p><p className="text-xs text-muted-foreground">In Progress</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-green-600" /><div><p className="text-2xl font-bold">{worklist.filter(w => w.status === "Completed").length}</p><p className="text-xs text-muted-foreground">Completed Today</p></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient or study ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={modalityFilter} onValueChange={setModalityFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{modalities.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Study ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Procedure</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Prep</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No studies found</TableCell></TableRow>
              ) : (
                filtered.map(w => (
                  <TableRow key={w.id}>
                    <TableCell className="font-mono text-sm">{w.id}</TableCell>
                    <TableCell>
                      <div><span className="font-medium">{w.patient}</span><br /><span className="text-xs text-muted-foreground">{w.uhid}</span></div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm">{w.procedure}</span>
                        {w.contrast && <Badge variant="outline" className="ml-1 text-xs">Contrast</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{w.equipment}</TableCell>
                    <TableCell className="font-medium">{w.scheduledTime}</TableCell>
                    <TableCell>
                      <Badge variant={w.priority === "Emergency" ? "destructive" : w.priority === "Urgent" ? "default" : "secondary"} className="text-xs">{w.priority}</Badge>
                    </TableCell>
                    <TableCell><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prepColor[w.prepStatus]}`}>{w.prepStatus}</span></TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[w.status]}`}>{w.status}</span></TableCell>
                    <TableCell>
                      {w.status === "Waiting" && w.prepStatus === "Ready" && (
                        <Button size="sm" variant="outline"><Play className="h-3 w-3 mr-1" /> Start</Button>
                      )}
                      {w.status === "In Progress" && (
                        <Button size="sm"><CheckCircle className="h-3 w-3 mr-1" /> Complete</Button>
                      )}
                      {w.status === "Waiting" && w.prepStatus === "Pending" && (
                        <span className="text-xs text-yellow-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Prep needed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
