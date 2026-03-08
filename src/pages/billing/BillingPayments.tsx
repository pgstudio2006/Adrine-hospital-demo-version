import { useState } from "react";
import { toast } from "sonner";
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
import { Search, Plus, Eye, IndianRupee, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface Payment {
  id: string;
  billId: string;
  uhid: string;
  patient: string;
  date: string;
  amount: number;
  method: "Cash" | "Card" | "UPI" | "Bank Transfer" | "Insurance";
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  type: "Payment" | "Advance" | "Refund";
  reference?: string;
}

const payments: Payment[] = [
  { id: "PAY-6001", billId: "BIL-9001", uhid: "UH-10042", patient: "Ravi Sharma", date: "2026-03-08", amount: 1626, method: "UPI", status: "Completed", type: "Payment", reference: "UPI-REF-44821" },
  { id: "PAY-6002", billId: "BIL-9002", uhid: "UH-10035", patient: "Suresh Kumar", date: "2026-03-08", amount: 25000, method: "Card", status: "Completed", type: "Advance", reference: "CARD-****4521" },
  { id: "PAY-6003", billId: "BIL-9002", uhid: "UH-10035", patient: "Suresh Kumar", date: "2026-03-08", amount: 10000, method: "Cash", status: "Completed", type: "Payment" },
  { id: "PAY-6004", billId: "BIL-9005", uhid: "UH-10029", patient: "Meena Joshi", date: "2026-03-07", amount: 6479, method: "Card", status: "Completed", type: "Payment", reference: "CARD-****8833" },
  { id: "PAY-6005", billId: "BIL-9003", uhid: "UH-10038", patient: "Anita Desai", date: "2026-03-08", amount: 2498, method: "Insurance", status: "Pending", type: "Payment" },
  { id: "PAY-6006", billId: "BIL-9006", uhid: "UH-10015", patient: "Arun Pillai", date: "2026-03-07", amount: 1500, method: "Cash", status: "Refunded", type: "Refund" },
];

const statusColor: Record<string, string> = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Refunded: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  Payment: ArrowDownLeft,
  Advance: ArrowDownLeft,
  Refund: ArrowUpRight,
};

export default function BillingPayments() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [tab, setTab] = useState("all");
  const [showRecord, setShowRecord] = useState(false);
  const [selected, setSelected] = useState<Payment | null>(null);

  const filtered = payments.filter(p => {
    const matchSearch = p.patient.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === "all" || p.method === methodFilter;
    const matchTab = tab === "all" || p.type === tab;
    return matchSearch && matchMethod && matchTab;
  });

  const totalCollected = payments.filter(p => p.status === "Completed" && p.type !== "Refund").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const totalRefunds = payments.filter(p => p.type === "Refund").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground text-sm">Record and track all payment transactions</p>
        </div>
        <Button onClick={() => setShowRecord(true)}><Plus className="h-4 w-4 mr-2" /> Record Payment</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-3"><IndianRupee className="h-8 w-8 text-green-600" /><div><p className="text-2xl font-bold">₹{totalCollected.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Collected</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><IndianRupee className="h-8 w-8 text-yellow-600" /><div><p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p><p className="text-xs text-muted-foreground">Pending</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><ArrowUpRight className="h-8 w-8 text-purple-600" /><div><p className="text-2xl font-bold">₹{totalRefunds.toLocaleString()}</p><p className="text-xs text-muted-foreground">Refunds</p></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient or payment ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="Insurance">Insurance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Payment">Payments</TabsTrigger>
          <TabsTrigger value="Advance">Advances</TabsTrigger>
          <TabsTrigger value="Refund">Refunds</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Bill ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => {
                const Icon = typeIcon[p.type];
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.id}</TableCell>
                    <TableCell>
                      <div><span className="font-medium">{p.patient}</span><br /><span className="text-xs text-muted-foreground">{p.uhid}</span></div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">{p.billId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Icon className={`h-3.5 w-3.5 ${p.type === "Refund" ? "text-purple-600" : "text-green-600"}`} />
                        <span className="text-sm">{p.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium ${p.type === "Refund" ? "text-purple-600" : ""}`}>
                      {p.type === "Refund" ? "-" : ""}₹{p.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{p.reference || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.date}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span></TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => setSelected(p)}><Eye className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader><DialogTitle>Payment {selected.id}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient}</span></div>
                  <div><span className="text-muted-foreground">UHID:</span> {selected.uhid}</div>
                  <div><span className="text-muted-foreground">Bill ID:</span> {selected.billId}</div>
                  <div><span className="text-muted-foreground">Date:</span> {selected.date}</div>
                  <div><span className="text-muted-foreground">Method:</span> {selected.method}</div>
                  <div><span className="text-muted-foreground">Reference:</span> {selected.reference || "N/A"}</div>
                </div>
                <div className="border border-border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{selected.type} Amount</p>
                    <p className="text-2xl font-bold">{selected.type === "Refund" ? "-" : ""}₹{selected.amount.toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Record Payment */}
      <Dialog open={showRecord} onOpenChange={setShowRecord}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Bill ID</Label><Input placeholder="BIL-XXXX" /></div>
              <div><Label>UHID</Label><Input placeholder="UH-XXXXX" /></div>
              <div><Label>Amount (₹)</Label><Input type="number" placeholder="0" /></div>
              <div><Label>Payment Method</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="advance">Advance Deposit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Reference No.</Label><Input placeholder="Optional" /></div>
            </div>
            <div><Label>Notes</Label><Textarea placeholder="Payment notes..." rows={2} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button>
              <Button onClick={() => setShowRecord(false)}>Record Payment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
