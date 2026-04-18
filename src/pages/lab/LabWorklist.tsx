import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, FlaskConical, ListChecks, Search } from "lucide-react";
import { useHospital, type LabOrder } from "@/stores/hospitalStore";

const priorityColor = (priority: LabOrder["priority"]) => {
  if (priority === "Emergency") return "destructive";
  if (priority === "Urgent") return "default";
  return "outline";
};

const stageColor = (stage: LabOrder["stage"]) => {
  if (stage === "Reported") return "default";
  if (stage === "Validated") return "secondary";
  if (stage === "Awaiting Validation") return "default";
  return "outline";
};

export default function LabWorklist() {
  const { labOrders, invoices, updateLabStage, updateLabOrder } = useHospital();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [resultsDraft, setResultsDraft] = useState("");
  const [validatorName, setValidatorName] = useState("Dr. Pathak");

  const selectedOrder = labOrders.find((order) => order.orderId === selectedOrderId) || null;

  const billingByUhid = useMemo(() => {
    const map = new Map<string, {
      paid: number;
      total: number;
      due: number;
      invoiceCount: number;
      latestInvoiceId: string;
    }>();

    invoices.forEach((invoice) => {
      const current = map.get(invoice.uhid) || {
        paid: 0,
        total: 0,
        due: 0,
        invoiceCount: 0,
        latestInvoiceId: invoice.id,
      };

      current.paid += invoice.paid;
      current.total += invoice.total;
      current.due += Math.max(0, invoice.total - invoice.paid);
      current.invoiceCount += 1;
      current.latestInvoiceId = current.latestInvoiceId || invoice.id;
      map.set(invoice.uhid, current);
    });

    return map;
  }, [invoices]);

  const activeOrders = useMemo(
    () => labOrders.filter(order => order.stage !== "Reported"),
    [labOrders],
  );
  const delayedOrders = useMemo(
    () => labOrders.filter(order => order.sampleStatus === "Ordered" || order.sampleStatus === "Collected"),
    [labOrders],
  );

  const filteredOrders = activeOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(search.toLowerCase()) ||
      order.uhid.toLowerCase().includes(search.toLowerCase()) ||
      order.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || order.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const openOrder = (order: LabOrder) => {
    setSelectedOrderId(order.orderId);
    setResultsDraft(order.results || "");
    setValidatorName(order.validatedBy || "Dr. Pathak");
  };

  const markSampleReceived = (order: LabOrder) => {
    updateLabOrder(order.orderId, { sampleStatus: "Received" });
  };

  const startAnalysis = (order: LabOrder) => {
    updateLabOrder(order.orderId, { sampleStatus: "Processing" });
    updateLabStage(order.orderId, "In Analysis");
  };

  const saveResults = () => {
    if (!selectedOrder) return;
    updateLabOrder(selectedOrder.orderId, {
      results: resultsDraft.trim(),
      sampleStatus: "Analysis Complete",
    });
    updateLabStage(selectedOrder.orderId, "Awaiting Validation");
  };

  const validateOrder = () => {
    if (!selectedOrder) return;
    updateLabOrder(selectedOrder.orderId, {
      validatedBy: validatorName.trim() || "Dr. Pathak",
    });
    updateLabStage(selectedOrder.orderId, "Validated");
  };

  const releaseReport = () => {
    if (!selectedOrder) return;
    updateLabStage(selectedOrder.orderId, "Reported");
    setSelectedOrderId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Worklist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {activeOrders.length} active orders · {labOrders.filter(order => order.stage === "Reported").length} reports released
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
              <Input placeholder="Search order, patient, UHID..." value={search} onChange={event => setSearch(event.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hematology">Hematology</SelectItem>
                <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                <SelectItem value="Microbiology">Microbiology</SelectItem>
                <SelectItem value="Serology">Serology</SelectItem>
                <SelectItem value="General">General</SelectItem>
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
                    <TableHead>Billing</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Sample</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No lab orders. Orders appear here when doctors request tests during consultation.</TableCell></TableRow>
                  ) : filteredOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      {(() => {
                        const billing = billingByUhid.get(order.uhid);
                        return (
                          <>
                      <TableCell>
                        <p className="text-sm font-mono text-foreground">{order.orderId}</p>
                        <p className="text-xs text-muted-foreground">{order.orderTime}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{order.patientName}</p>
                        <p className="text-xs text-muted-foreground">{order.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm max-w-[220px] truncate">{order.tests}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{order.category}</Badge></TableCell>
                      <TableCell>
                        {billing ? (
                          <div>
                            <p className="text-xs font-medium text-foreground">Paid ₹{billing.paid.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-muted-foreground">Due ₹{billing.due.toLocaleString("en-IN")}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No invoice</span>
                        )}
                      </TableCell>
                      <TableCell><Badge variant={priorityColor(order.priority)} className="text-xs">{order.priority}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{order.sampleStatus}</Badge></TableCell>
                      <TableCell><Badge variant={stageColor(order.stage)} className="text-xs">{order.stage}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.stage === "Pending Analysis" && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => startAnalysis(order)}>Start Analysis</Button>
                          )}
                          {(order.stage === "In Analysis" || order.stage === "Awaiting Validation" || order.stage === "Validated") && (
                            <Button size="sm" className="text-xs h-7" onClick={() => openOrder(order)}>Open</Button>
                          )}
                        </div>
                      </TableCell>
                          </>
                        );
                      })()}
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
          ) : delayedOrders.map((order) => (
            <Card key={order.orderId} className="border-border border-l-4 border-l-warning">
              <CardContent className="p-4">
                {(() => {
                  const billing = billingByUhid.get(order.uhid);
                  return (
                    <>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{order.orderId}</span>
                    <Badge variant="default" className="text-xs">Sample Pending</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => markSampleReceived(order)}>Mark Received</Button>
                </div>
                <p className="text-sm font-medium text-foreground">{order.patientName} <span className="text-muted-foreground font-normal">· {order.uhid}</span></p>
                <p className="text-xs text-muted-foreground">{order.tests} · {order.category} · {order.doctor}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {billing
                    ? `Billing paid ₹${billing.paid.toLocaleString("en-IN")} · Due ₹${billing.due.toLocaleString("en-IN")}`
                    : "Billing not available"}
                </p>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrderId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" /> Lab Order {selectedOrder.orderId}
                  <Badge variant={stageColor(selectedOrder.stage)} className="text-xs">{selectedOrder.stage}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selectedOrder.patientName}</span></div>
                <div><span className="text-muted-foreground">UHID:</span> {selectedOrder.uhid}</div>
                <div><span className="text-muted-foreground">Doctor:</span> {selectedOrder.doctor}</div>
                <div><span className="text-muted-foreground">Priority:</span> {selectedOrder.priority}</div>
                <div>
                  <span className="text-muted-foreground">Billing Paid:</span>{" "}
                  ₹{(billingByUhid.get(selectedOrder.uhid)?.paid || 0).toLocaleString("en-IN")}
                </div>
                <div>
                  <span className="text-muted-foreground">Billing Due:</span>{" "}
                  ₹{(billingByUhid.get(selectedOrder.uhid)?.due || 0).toLocaleString("en-IN")}
                </div>
                <div className="col-span-2"><span className="text-muted-foreground">Tests:</span> {selectedOrder.tests}</div>
              </div>

              {(selectedOrder.stage === "In Analysis" || selectedOrder.stage === "Awaiting Validation") && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Results Entry</p>
                  <Textarea
                    rows={8}
                    value={resultsDraft}
                    onChange={(event) => setResultsDraft(event.target.value)}
                    placeholder="Enter key observations, values, and interpretation..."
                  />
                  <Button className="w-full" onClick={saveResults}>Save Results for Validation</Button>
                </div>
              )}

              {(selectedOrder.stage === "Validated" || selectedOrder.stage === "Reported") && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Report Summary</p>
                  <div className="rounded-lg border p-4 text-sm whitespace-pre-wrap">
                    {selectedOrder.results || "Results not entered yet."}
                  </div>
                </div>
              )}

              {(selectedOrder.stage === "Awaiting Validation" || selectedOrder.stage === "Validated") && (
                <div className="space-y-3 border-t pt-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Validator</p>
                    <Input value={validatorName} onChange={(event) => setValidatorName(event.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    {selectedOrder.stage === "Awaiting Validation" && (
                      <Button className="flex-1" onClick={validateOrder}>Validate Report</Button>
                    )}
                    <Button variant="outline" className="flex-1" onClick={releaseReport}>Release to Doctor</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
