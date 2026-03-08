import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, FlaskConical, ListChecks, Search } from "lucide-react";

interface WorklistItem {
  orderId: string;
  uhid: string;
  patient: string;
  tests: string;
  category: string;
  priority: "Routine" | "Urgent" | "Emergency";
  doctor: string;
  orderTime: string;
  sampleStatus: string;
  stage: string;
  tat: string;
}

const WORKLIST: WorklistItem[] = [
  { orderId: "LO-4521", uhid: "UH-2024-0045", patient: "Anita Sharma", tests: "CBC, CRP, ESR", category: "Hematology", priority: "Urgent", doctor: "Dr. Priya Gupta", orderTime: "10:15 AM", sampleStatus: "Received", stage: "Pending Analysis", tat: "1h 45m left" },
  { orderId: "LO-4520", uhid: "UH-2024-0012", patient: "Ramesh Kumar", tests: "ABG, Electrolytes, RFT", category: "Biochemistry", priority: "Emergency", doctor: "Dr. Anil Mehta", orderTime: "10:00 AM", sampleStatus: "Processing", stage: "In Analysis", tat: "30m left" },
  { orderId: "LO-4519", uhid: "UH-2024-0078", patient: "Suresh Patel", tests: "PT/INR, aPTT", category: "Hematology", priority: "Routine", doctor: "Dr. Rajesh Shah", orderTime: "09:45 AM", sampleStatus: "Collected", stage: "Awaiting Reception", tat: "3h left" },
  { orderId: "LO-4516", uhid: "UH-2024-0130", patient: "Arjun Reddy", tests: "Blood Culture, Sensitivity", category: "Microbiology", priority: "Urgent", doctor: "Dr. Anil Mehta", orderTime: "09:00 AM", sampleStatus: "Processing", stage: "Incubation", tat: "36h left" },
  { orderId: "LO-4515", uhid: "UH-2024-0142", patient: "Fatima Begum", tests: "Thyroid Panel (T3, T4, TSH)", category: "Biochemistry", priority: "Routine", doctor: "Dr. Sunita Joshi", orderTime: "08:45 AM", sampleStatus: "Received", stage: "Pending Analysis", tat: "1h 15m left" },
  { orderId: "LO-4514", uhid: "UH-2024-0155", patient: "Kiran Desai", tests: "Lipid Profile, HbA1c", category: "Biochemistry", priority: "Routine", doctor: "Dr. Priya Gupta", orderTime: "08:30 AM", sampleStatus: "Analysis Complete", stage: "Awaiting Validation", tat: "Done" },
  { orderId: "LO-4513", uhid: "UH-2024-0091", patient: "Meena Devi", tests: "Urine Routine, Culture", category: "Microbiology", priority: "Routine", doctor: "Dr. Sunita Joshi", orderTime: "08:15 AM", sampleStatus: "Received", stage: "In Analysis", tat: "24h left" },
  { orderId: "LO-4512", uhid: "UH-2024-0160", patient: "Ravi Shankar", tests: "HIV, HBsAg, HCV", category: "Serology", priority: "Urgent", doctor: "Dr. Rajesh Shah", orderTime: "08:00 AM", sampleStatus: "Analysis Complete", stage: "Awaiting Validation", tat: "Done" },
];

const DELAYED = [
  { orderId: "LO-4508", uhid: "UH-2024-0170", patient: "Sundar Lal", tests: "Widal Test", category: "Serology", doctor: "Dr. Priya Gupta", orderTime: "Yesterday 4 PM", delay: "2h overdue", reason: "Reagent shortage" },
  { orderId: "LO-4505", uhid: "UH-2024-0185", patient: "Prathima S", tests: "ANA, dsDNA", category: "Immunology", doctor: "Dr. Anil Mehta", orderTime: "Yesterday 2 PM", delay: "4h overdue", reason: "Equipment maintenance" },
];

const priorityColor = (p: string) => {
  if (p === "Emergency") return "destructive";
  if (p === "Urgent") return "default";
  return "outline";
};

const stageColor = (s: string) => {
  if (s === "Awaiting Validation") return "default";
  if (s === "In Analysis" || s === "Incubation") return "secondary";
  return "outline";
};

export default function LabWorklist() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = WORKLIST.filter(w => {
    const matchSearch = w.patient.toLowerCase().includes(search.toLowerCase()) || w.uhid.includes(search) || w.orderId.includes(search);
    const matchCat = categoryFilter === "all" || w.category === categoryFilter;
    const matchPri = priorityFilter === "all" || w.priority === priorityFilter;
    return matchSearch && matchCat && matchPri;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Worklist</h1>
        <p className="text-sm text-muted-foreground mt-1">Pending tests, processing queue & delayed tests</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active"><ListChecks className="h-3.5 w-3.5 mr-1" /> Active ({WORKLIST.length})</TabsTrigger>
          <TabsTrigger value="delayed"><Clock className="h-3.5 w-3.5 mr-1" /> Delayed ({DELAYED.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search order, patient, UHID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hematology">Hematology</SelectItem>
                <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                <SelectItem value="Microbiology">Microbiology</SelectItem>
                <SelectItem value="Serology">Serology</SelectItem>
                <SelectItem value="Immunology">Immunology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Routine">Routine</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>TAT</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(w => (
                    <TableRow key={w.orderId}>
                      <TableCell>
                        <p className="text-sm font-mono text-foreground">{w.orderId}</p>
                        <p className="text-xs text-muted-foreground">{w.orderTime}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{w.patient}</p>
                        <p className="text-xs text-muted-foreground">{w.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">{w.tests}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{w.category}</Badge></TableCell>
                      <TableCell><Badge variant={priorityColor(w.priority)} className="text-xs">{w.priority}</Badge></TableCell>
                      <TableCell><Badge variant={stageColor(w.stage)} className="text-xs">{w.stage}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{w.tat}</TableCell>
                      <TableCell>
                        {w.stage === "Pending Analysis" && <Button size="sm" variant="outline" className="text-xs h-7">Start</Button>}
                        {w.stage === "In Analysis" && <Button size="sm" variant="outline" className="text-xs h-7">Enter Results</Button>}
                        {w.stage === "Awaiting Validation" && <Button size="sm" className="text-xs h-7">Validate</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delayed" className="mt-4 space-y-4">
          {DELAYED.map(d => (
            <Card key={d.orderId} className="border-border border-l-4 border-l-destructive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{d.orderId}</span>
                    <Badge variant="destructive" className="text-xs">{d.delay}</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">Escalate</Button>
                </div>
                <p className="text-sm font-medium text-foreground">{d.patient} <span className="text-muted-foreground font-normal">· {d.uhid}</span></p>
                <p className="text-xs text-muted-foreground">{d.tests} · {d.category} · {d.doctor}</p>
                <p className="text-xs text-muted-foreground mt-1">Reason: {d.reason}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
