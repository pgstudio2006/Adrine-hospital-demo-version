import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Circle, Clock, ListTodo, Pill, Syringe, TestTube } from "lucide-react";

interface Task {
  id: string;
  uhid: string;
  patient: string;
  bed: string;
  task: string;
  category: string;
  priority: "urgent" | "high" | "normal" | "low";
  scheduled: string;
  completed?: string;
  status: "pending" | "in_progress" | "completed" | "missed";
  orderedBy?: string;
}

const TASKS: Task[] = [
  { id: "T001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", task: "IV Ceftriaxone 1g", category: "Medication", priority: "urgent", scheduled: "10:00 AM", status: "pending", orderedBy: "Dr. Anil Mehta" },
  { id: "T002", uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", task: "Chest drain output measurement", category: "Monitoring", priority: "high", scheduled: "10:00 AM", status: "pending" },
  { id: "T003", uhid: "UH-2024-0103", patient: "Vikram Singh", bed: "ICU-07", task: "Wound dressing change", category: "Procedure", priority: "urgent", scheduled: "10:30 AM", status: "pending", orderedBy: "Dr. Anil Mehta" },
  { id: "T004", uhid: "UH-2024-0103", patient: "Vikram Singh", bed: "ICU-07", task: "Sedation assessment (RASS)", category: "Monitoring", priority: "high", scheduled: "10:30 AM", status: "pending" },
  { id: "T005", uhid: "UH-2024-0045", patient: "Anita Sharma", bed: "W2-05", task: "Blood sample – CBC, CRP", category: "Sample Collection", priority: "normal", scheduled: "11:00 AM", status: "pending", orderedBy: "Dr. Priya Gupta" },
  { id: "T006", uhid: "UH-2024-0078", patient: "Suresh Patel", bed: "W2-08", task: "Physiotherapy assistance – leg exercises", category: "Procedure", priority: "normal", scheduled: "11:30 AM", status: "pending" },
  { id: "T007", uhid: "UH-2024-0091", patient: "Meena Devi", bed: "W3-02", task: "Diabetic foot dressing", category: "Procedure", priority: "normal", scheduled: "12:00 PM", status: "pending" },
  { id: "T008", uhid: "UH-2024-0012", patient: "Ramesh Kumar", bed: "ICU-03", task: "Vitals q2h", category: "Monitoring", priority: "high", scheduled: "08:00 AM", status: "completed", completed: "08:05 AM" },
  { id: "T009", uhid: "UH-2024-0103", patient: "Vikram Singh", bed: "ICU-07", task: "IV Meropenem 1g", category: "Medication", priority: "urgent", scheduled: "08:00 AM", status: "completed", completed: "08:10 AM" },
  { id: "T010", uhid: "UH-2024-0045", patient: "Anita Sharma", bed: "W2-05", task: "Nebulization – Salbutamol", category: "Procedure", priority: "normal", scheduled: "08:30 AM", status: "completed", completed: "08:35 AM" },
];

const NURSING_ORDERS = [
  { id: "NO001", uhid: "UH-2024-0012", patient: "Ramesh Kumar", order: "IV NS 500ml at 80ml/hr", doctor: "Dr. Anil Mehta", priority: "High", time: "09:00 AM", status: "Active" },
  { id: "NO002", uhid: "UH-2024-0103", patient: "Vikram Singh", order: "Oxygen therapy 4L/min via nasal cannula if SpO2 <94%", doctor: "Dr. Anil Mehta", priority: "Urgent", time: "07:30 AM", status: "Active" },
  { id: "NO003", uhid: "UH-2024-0078", patient: "Suresh Patel", order: "Catheter care – maintain strict I/O chart", doctor: "Dr. Rajesh Shah", priority: "Normal", time: "Yesterday", status: "Active" },
  { id: "NO004", uhid: "UH-2024-0045", patient: "Anita Sharma", order: "Chest physiotherapy TID", doctor: "Dr. Priya Gupta", priority: "Normal", time: "Yesterday", status: "Active" },
];

const priorityColor = (p: string) => {
  if (p === "urgent" || p === "Urgent") return "destructive";
  if (p === "high" || p === "High") return "default";
  return "outline";
};

const categoryIcon = (c: string) => {
  if (c === "Medication") return <Pill className="h-3.5 w-3.5" />;
  if (c === "Sample Collection") return <TestTube className="h-3.5 w-3.5" />;
  if (c === "Procedure") return <Syringe className="h-3.5 w-3.5" />;
  return <Circle className="h-3.5 w-3.5" />;
};

export default function NurseTasks() {
  const [filter, setFilter] = useState("all");

  const pending = TASKS.filter(t => t.status === "pending" || t.status === "in_progress");
  const completed = TASKS.filter(t => t.status === "completed");

  const filteredPending = filter === "all" ? pending : pending.filter(t => t.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">Nursing tasks, medication administration & doctor orders</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-foreground">{pending.length}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-foreground">{completed.length}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Urgent</p>
          <p className="text-2xl font-bold text-foreground">{pending.filter(t => t.priority === "urgent").length}</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Active Orders</p>
          <p className="text-2xl font-bold text-foreground">{NURSING_ORDERS.length}</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks"><ListTodo className="h-3.5 w-3.5 mr-1" /> Task List</TabsTrigger>
          <TabsTrigger value="orders"><ClipboardIcon className="h-3.5 w-3.5 mr-1" /> Nursing Orders</TabsTrigger>
          <TabsTrigger value="completed"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4 space-y-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Medication">Medication</SelectItem>
              <SelectItem value="Monitoring">Monitoring</SelectItem>
              <SelectItem value="Procedure">Procedure</SelectItem>
              <SelectItem value="Sample Collection">Sample Collection</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            {filteredPending.map(t => (
              <Card key={t.id} className="border-border">
                <CardContent className="p-3 flex items-center gap-3">
                  <Checkbox />
                  <div className="flex items-center gap-2">
                    {categoryIcon(t.category)}
                    <Badge variant={priorityColor(t.priority)} className="text-xs w-14 justify-center">{t.priority}</Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{t.task}</p>
                    <p className="text-xs text-muted-foreground">{t.patient} · {t.bed} {t.orderedBy ? `· Ordered by ${t.orderedBy}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{t.scheduled}</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">Complete</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4 space-y-4">
          {NURSING_ORDERS.map(o => (
            <Card key={o.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={priorityColor(o.priority)} className="text-xs">{o.priority}</Badge>
                    <span className="text-sm font-medium text-foreground">{o.patient}</span>
                    <span className="text-xs text-muted-foreground">{o.uhid}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{o.status}</Badge>
                </div>
                <p className="text-sm text-foreground mt-1">{o.order}</p>
                <p className="text-xs text-muted-foreground mt-1">Ordered by {o.doctor} · {o.time}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-2">
          {completed.map(t => (
            <Card key={t.id} className="border-border opacity-75">
              <CardContent className="p-3 flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  {categoryIcon(t.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-through">{t.task}</p>
                  <p className="text-xs text-muted-foreground">{t.patient} · {t.bed}</p>
                </div>
                <span className="text-xs text-muted-foreground">Done at {t.completed}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
