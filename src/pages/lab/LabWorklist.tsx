import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, FlaskConical, ListChecks, Search } from "lucide-react";
import { useHospital } from "@/stores/hospitalStore";

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
  const { labOrders, updateLabStage } = useHospital();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const activeOrders = labOrders.filter(o => o.stage !== 'Validated' && o.stage !== 'Reported');
  const delayedOrders = labOrders.filter(o => o.stage === 'Pending Analysis' && o.sampleStatus === 'Ordered');

  const filtered = activeOrders.filter(w => {
    const matchSearch = w.patientName.toLowerCase().includes(search.toLowerCase()) || w.uhid.includes(search) || w.orderId.includes(search);
    const matchCat = categoryFilter === "all" || w.category === categoryFilter;
    const matchPri = priorityFilter === "all" || w.priority === priorityFilter;
    return matchSearch && matchCat && matchPri;
  });

  const handleAdvanceStage = (orderId: string, currentStage: string) => {
    const stageFlow: Record<string, string> = {
      'Pending Analysis': 'In Analysis',
      'In Analysis': 'Awaiting Validation',
      'Awaiting Validation': 'Validated',
    };
    const nextStage = stageFlow[currentStage];
    if (nextStage) updateLabStage(orderId, nextStage as any);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Worklist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {activeOrders.length} active orders · {labOrders.filter(o => o.stage === 'Validated').length} validated today
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active"><ListChecks className="h-3.5 w-3.5 mr-1" /> Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="pending-samples"><Clock className="h-3.5 w-3.5 mr-1" /> Pending Samples ({delayedOrders.length})</TabsTrigger>
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
                    <TableHead>Sample</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No lab orders. Orders will appear here when doctors create them during consultation.</TableCell></TableRow>
                  ) : filtered.map(w => (
                    <TableRow key={w.orderId}>
                      <TableCell>
                        <p className="text-sm font-mono text-foreground">{w.orderId}</p>
                        <p className="text-xs text-muted-foreground">{w.orderTime}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{w.patientName}</p>
                        <p className="text-xs text-muted-foreground">{w.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">{w.tests}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{w.category}</Badge></TableCell>
                      <TableCell><Badge variant={priorityColor(w.priority)} className="text-xs">{w.priority}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{w.sampleStatus}</Badge></TableCell>
                      <TableCell><Badge variant={stageColor(w.stage)} className="text-xs">{w.stage}</Badge></TableCell>
                      <TableCell>
                        {w.stage === "Pending Analysis" && (
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleAdvanceStage(w.orderId, w.stage)}>Start Analysis</Button>
                        )}
                        {w.stage === "In Analysis" && (
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleAdvanceStage(w.orderId, w.stage)}>Enter Results</Button>
                        )}
                        {w.stage === "Awaiting Validation" && (
                          <Button size="sm" className="text-xs h-7" onClick={() => handleAdvanceStage(w.orderId, w.stage)}>Validate</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-samples" className="mt-4 space-y-4">
          {delayedOrders.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No pending sample collections</div>
          ) : delayedOrders.map(d => (
            <Card key={d.orderId} className="border-border border-l-4 border-l-warning">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{d.orderId}</span>
                    <Badge variant="default" className="text-xs">Sample Pending</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7">Mark Collected</Button>
                </div>
                <p className="text-sm font-medium text-foreground">{d.patientName} <span className="text-muted-foreground font-normal">· {d.uhid}</span></p>
                <p className="text-xs text-muted-foreground">{d.tests} · {d.category} · {d.doctor}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
