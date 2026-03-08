import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface ImagingOrder {
  id: string;
  uhid: string;
  patient: string;
  age: number;
  gender: string;
  doctor: string;
  dept: string;
  procedure: string;
  modality: string;
  bodyPart: string;
  indication: string;
  priority: "Routine" | "Urgent" | "Emergency";
  status: "Pending" | "Scheduled" | "Imaging" | "Reporting" | "Completed" | "Cancelled";
  orderDate: string;
  scheduledDate?: string;
  scheduledTime?: string;
  equipment?: string;
  technician?: string;
  contrast: boolean;
  prepInstructions: string;
}

const orders: ImagingOrder[] = [
  { id: "RAD-4501", uhid: "UH-10042", patient: "Ravi Sharma", age: 45, gender: "M", doctor: "Dr. Patel", dept: "Medicine", procedure: "CT Chest with Contrast", modality: "CT Scan", bodyPart: "Chest", indication: "Persistent cough, rule out mass lesion", priority: "Urgent", status: "Scheduled", orderDate: "2026-03-08", scheduledDate: "2026-03-08", scheduledTime: "11:30", equipment: "CT Scanner — Siemens", technician: "Tech. Ramesh", contrast: true, prepInstructions: "NPO 4 hours, check creatinine" },
  { id: "RAD-4500", uhid: "UH-10038", patient: "Anita Desai", age: 62, gender: "F", doctor: "Dr. Rao", dept: "Orthopedics", procedure: "X-ray Left Knee AP/Lateral", modality: "X-ray", bodyPart: "Left Knee", indication: "Knee pain, suspected OA", priority: "Routine", status: "Imaging", orderDate: "2026-03-08", scheduledDate: "2026-03-08", scheduledTime: "11:00", equipment: "X-ray — Philips Digital", technician: "Tech. Sunita", contrast: false, prepInstructions: "Remove metallic objects from area" },
  { id: "RAD-4499", uhid: "UH-10035", patient: "Suresh Kumar", age: 58, gender: "M", doctor: "Dr. Mehta", dept: "Neurology", procedure: "MRI Brain with Contrast", modality: "MRI", bodyPart: "Brain", indication: "Sudden severe headache, suspected intracranial bleed", priority: "Emergency", status: "Reporting", orderDate: "2026-03-08", scheduledDate: "2026-03-08", scheduledTime: "10:00", equipment: "MRI 3T — GE Signa", technician: "Tech. Anil", contrast: true, prepInstructions: "Check for metallic implants, NPO 4 hours" },
  { id: "RAD-4498", uhid: "UH-10029", patient: "Meena Joshi", age: 35, gender: "F", doctor: "Dr. Shah", dept: "ENT", procedure: "Ultrasound Neck", modality: "Ultrasound", bodyPart: "Neck/Thyroid", indication: "Thyroid nodule evaluation", priority: "Routine", status: "Completed", orderDate: "2026-03-08", scheduledDate: "2026-03-08", scheduledTime: "09:30", equipment: "US — Samsung HS60", technician: "Tech. Priya", contrast: false, prepInstructions: "None" },
  { id: "RAD-4497", uhid: "UH-10021", patient: "Vikram Singh", age: 40, gender: "M", doctor: "Dr. Gupta", dept: "Emergency", procedure: "X-ray Chest PA", modality: "X-ray", bodyPart: "Chest", indication: "Breathlessness, rule out pneumothorax", priority: "Urgent", status: "Completed", orderDate: "2026-03-08", equipment: "X-ray — Philips Digital", technician: "Tech. Ramesh", contrast: false, prepInstructions: "None" },
  { id: "RAD-4496", uhid: "UH-10018", patient: "Deepa Nair", age: 50, gender: "F", doctor: "Dr. Patel", dept: "Medicine", procedure: "CT Abdomen", modality: "CT Scan", bodyPart: "Abdomen", indication: "Abdominal pain, suspected appendicitis", priority: "Urgent", status: "Pending", orderDate: "2026-03-08", contrast: true, prepInstructions: "NPO 4 hours, check creatinine, oral contrast 1 hour prior" },
  { id: "RAD-4495", uhid: "UH-10015", patient: "Arun Pillai", age: 72, gender: "M", doctor: "Dr. Rao", dept: "Orthopedics", procedure: "MRI Lumbar Spine", modality: "MRI", bodyPart: "Lumbar Spine", indication: "Chronic low back pain with radiculopathy", priority: "Routine", status: "Pending", orderDate: "2026-03-07", contrast: false, prepInstructions: "Check for metallic implants, remove jewellery" },
];

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Imaging: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Reporting: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const modalities = ["All", "X-ray", "CT Scan", "MRI", "Ultrasound", "Mammography", "PET Scan"];

export default function RadiologyOrders() {
  const [search, setSearch] = useState("");
  const [modalityFilter, setModalityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<ImagingOrder | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.patient.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchModality = modalityFilter === "All" || o.modality === modalityFilter;
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchModality && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Imaging Orders</h1>
        <p className="text-muted-foreground text-sm">Manage radiology orders, scheduling, and procedure tracking</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient or order ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={modalityFilter} onValueChange={setModalityFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Modality" /></SelectTrigger>
          <SelectContent>{modalities.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Imaging">Imaging</SelectItem>
            <SelectItem value="Reporting">Reporting</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Body Part</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-sm">{o.id}</TableCell>
                  <TableCell>
                    <div><span className="font-medium">{o.patient}</span><br /><span className="text-xs text-muted-foreground">{o.uhid} • {o.age}{o.gender}</span></div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{o.modality}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{o.bodyPart}</TableCell>
                  <TableCell className="text-sm">{o.doctor}</TableCell>
                  <TableCell>
                    <Badge variant={o.priority === "Emergency" ? "destructive" : o.priority === "Urgent" ? "default" : "secondary"} className="text-xs">{o.priority}</Badge>
                  </TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelected(o)}><Eye className="h-4 w-4" /></Button>
                      {o.status === "Pending" && <Button variant="ghost" size="icon" title="Schedule"><Calendar className="h-4 w-4" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail / Schedule Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order {selected.id}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="procedure">Procedure</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient}</span></div>
                    <div><span className="text-muted-foreground">UHID:</span> {selected.uhid}</div>
                    <div><span className="text-muted-foreground">Age/Gender:</span> {selected.age}/{selected.gender}</div>
                    <div><span className="text-muted-foreground">Doctor:</span> {selected.doctor}</div>
                    <div><span className="text-muted-foreground">Department:</span> {selected.dept}</div>
                    <div><span className="text-muted-foreground">Order Date:</span> {selected.orderDate}</div>
                  </div>
                  <div className="border border-border rounded-lg p-3 space-y-2">
                    <p className="font-medium text-sm text-foreground">{selected.procedure}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Modality: {selected.modality}</span>
                      <span>Body Part: {selected.bodyPart}</span>
                      <span>Contrast: {selected.contrast ? "Yes" : "No"}</span>
                      <span>Priority: {selected.priority}</span>
                    </div>
                    <div className="text-sm"><span className="text-muted-foreground">Indication:</span> {selected.indication}</div>
                    {selected.prepInstructions !== "None" && (
                      <div className="text-sm"><span className="text-muted-foreground">Preparation:</span> {selected.prepInstructions}</div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4 mt-3">
                  {selected.scheduledDate ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Date:</span> {selected.scheduledDate}</div>
                      <div><span className="text-muted-foreground">Time:</span> {selected.scheduledTime}</div>
                      <div><span className="text-muted-foreground">Equipment:</span> {selected.equipment}</div>
                      <div><span className="text-muted-foreground">Technician:</span> {selected.technician}</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Not yet scheduled. Assign a time slot below.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Date</Label><Input type="date" /></div>
                        <div><Label>Time</Label><Input type="time" /></div>
                        <div><Label>Equipment</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ct1">CT Scanner — Siemens</SelectItem>
                              <SelectItem value="mri1">MRI 3T — GE Signa</SelectItem>
                              <SelectItem value="xray1">X-ray — Philips Digital</SelectItem>
                              <SelectItem value="us1">Ultrasound — Samsung HS60</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Label>Technician</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="t1">Tech. Ramesh</SelectItem>
                              <SelectItem value="t2">Tech. Sunita</SelectItem>
                              <SelectItem value="t3">Tech. Anil</SelectItem>
                              <SelectItem value="t4">Tech. Priya</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => setSelected(null)}>
                        <Calendar className="h-4 w-4 mr-2" /> Schedule Procedure
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="procedure" className="space-y-4 mt-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Patient identity confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Procedure details verified</span>
                    </div>
                    {selected.contrast && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Contrast administration — confirm creatinine clearance</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Procedure Start</Label><Input type="time" /></div>
                      <div><Label>Procedure End</Label><Input type="time" /></div>
                    </div>
                    <div><Label>Technician Notes</Label><Textarea placeholder="Imaging parameters, patient cooperation, any complications..." rows={3} /></div>
                    <div><Label>Radiation Dose (mGy)</Label><Input type="number" step="0.01" placeholder="0.00" /></div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => setSelected(null)}>
                        <CheckCircle className="h-4 w-4 mr-2" /> Complete Procedure
                      </Button>
                      <Button variant="destructive" onClick={() => setSelected(null)}>
                        <XCircle className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                    </div>
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
