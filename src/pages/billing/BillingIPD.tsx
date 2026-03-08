import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, Plus, IndianRupee, Bed, Clock, FileText, Lock, AlertTriangle } from "lucide-react";

interface IPDCharge {
  date: string;
  service: string;
  dept: string;
  qty: number;
  rate: number;
  amount: number;
}

interface IPDBill {
  id: string;
  uhid: string;
  patient: string;
  admissionDate: string;
  ward: string;
  bed: string;
  doctor: string;
  status: "Running" | "Interim" | "Discharge" | "Locked";
  totalCharges: number;
  deposits: number;
  balance: number;
  estimatedCost: number;
  dailyCharges: IPDCharge[];
  deposits_list: { date: string; amount: number; method: string; ref: string }[];
}

const ipdBills: IPDBill[] = [
  {
    id: "IPD-BIL-301", uhid: "UH-10035", patient: "Suresh Kumar", admissionDate: "2026-03-05", ward: "General Ward", bed: "GW-12", doctor: "Dr. Rao",
    status: "Running", totalCharges: 45888, deposits: 25000, balance: 20888, estimatedCost: 55000,
    dailyCharges: [
      { date: "2026-03-05", service: "General Ward Room", dept: "IPD", qty: 1, rate: 2500, amount: 2500 },
      { date: "2026-03-05", service: "Admission charges", dept: "IPD", qty: 1, rate: 500, amount: 500 },
      { date: "2026-03-06", service: "General Ward Room", dept: "IPD", qty: 1, rate: 2500, amount: 2500 },
      { date: "2026-03-06", service: "Surgery — Appendectomy", dept: "Surgery", qty: 1, rate: 25000, amount: 25000 },
      { date: "2026-03-06", service: "Anesthesia — General", dept: "OT", qty: 1, rate: 5000, amount: 5000 },
      { date: "2026-03-07", service: "General Ward Room", dept: "IPD", qty: 1, rate: 2500, amount: 2500 },
      { date: "2026-03-07", service: "Post-op medications", dept: "Pharmacy", qty: 1, rate: 3200, amount: 3200 },
      { date: "2026-03-07", service: "CBC + KFT", dept: "Laboratory", qty: 1, rate: 1200, amount: 1200 },
      { date: "2026-03-08", service: "General Ward Room", dept: "IPD", qty: 1, rate: 2500, amount: 2500 },
      { date: "2026-03-08", service: "Dressing change", dept: "Nursing", qty: 1, rate: 200, amount: 200 },
      { date: "2026-03-08", service: "Medications", dept: "Pharmacy", qty: 1, rate: 788, amount: 788 },
    ],
    deposits_list: [
      { date: "2026-03-05", amount: 15000, method: "Card", ref: "CARD-****4521" },
      { date: "2026-03-06", amount: 10000, method: "Cash", ref: "RCP-8801" },
    ],
  },
  {
    id: "IPD-BIL-300", uhid: "UH-10012", patient: "Kavita Reddy", admissionDate: "2026-03-04", ward: "Maternity Ward", bed: "MW-03", doctor: "Dr. Iyer",
    status: "Discharge", totalCharges: 32500, deposits: 20000, balance: 12500, estimatedCost: 35000,
    dailyCharges: [
      { date: "2026-03-04", service: "Maternity Ward Room", dept: "IPD", qty: 1, rate: 3500, amount: 3500 },
      { date: "2026-03-05", service: "Maternity Ward Room", dept: "IPD", qty: 1, rate: 3500, amount: 3500 },
      { date: "2026-03-05", service: "Normal Delivery", dept: "OB-GYN", qty: 1, rate: 15000, amount: 15000 },
      { date: "2026-03-06", service: "Maternity Ward Room", dept: "IPD", qty: 1, rate: 3500, amount: 3500 },
      { date: "2026-03-06", service: "Medications", dept: "Pharmacy", qty: 1, rate: 2800, amount: 2800 },
      { date: "2026-03-07", service: "Maternity Ward Room", dept: "IPD", qty: 1, rate: 3500, amount: 3500 },
      { date: "2026-03-07", service: "Lab investigations", dept: "Laboratory", qty: 1, rate: 700, amount: 700 },
    ],
    deposits_list: [
      { date: "2026-03-04", amount: 20000, method: "UPI", ref: "UPI-REF-55123" },
    ],
  },
  {
    id: "IPD-BIL-299", uhid: "UH-10006", patient: "Priya Menon", admissionDate: "2026-03-01", ward: "Semi-Private", bed: "SP-05", doctor: "Dr. Rao",
    status: "Locked", totalCharges: 68200, deposits: 68200, balance: 0, estimatedCost: 65000,
    dailyCharges: [],
    deposits_list: [],
  },
];

const statusColor: Record<string, string> = {
  Running: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Interim: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Discharge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Locked: "bg-muted text-muted-foreground",
};

export default function BillingIPD() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IPDBill | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);

  const filtered = ipdBills.filter(b =>
    b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">IPD Running Billing</h1>
        <p className="text-muted-foreground text-sm">Daily charge accumulation, deposits, interim & discharge bills</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Bed className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{ipdBills.filter(b => b.status === "Running").length}</p><p className="text-xs text-muted-foreground">Active IPD Bills</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><IndianRupee className="h-8 w-8 text-green-600" /><div><p className="text-2xl font-bold">₹{ipdBills.reduce((s, b) => s + b.deposits, 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Deposits</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-yellow-600" /><div><p className="text-2xl font-bold">₹{ipdBills.filter(b => b.status !== "Locked").reduce((s, b) => s + b.balance, 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Outstanding Balance</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><Clock className="h-8 w-8 text-orange-600" /><div><p className="text-2xl font-bold">{ipdBills.filter(b => b.status === "Discharge").length}</p><p className="text-xs text-muted-foreground">Pending Discharge Bills</p></div></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search patient or IPD bill ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Admission</TableHead>
                <TableHead>Ward / Bed</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Estimated</TableHead>
                <TableHead>Charges</TableHead>
                <TableHead>Deposits</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-sm">{b.id}</TableCell>
                  <TableCell><div><span className="font-medium">{b.patient}</span><br /><span className="text-xs text-muted-foreground">{b.uhid}</span></div></TableCell>
                  <TableCell className="text-muted-foreground">{b.admissionDate}</TableCell>
                  <TableCell className="text-sm">{b.ward} / {b.bed}</TableCell>
                  <TableCell className="text-sm">{b.doctor}</TableCell>
                  <TableCell className="text-muted-foreground">₹{b.estimatedCost.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{b.totalCharges.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">₹{b.deposits.toLocaleString()}</TableCell>
                  <TableCell className={`font-medium ${b.balance > 0 ? "text-destructive" : "text-green-600"}`}>₹{b.balance.toLocaleString()}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => setSelected(b)}><Eye className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* IPD Bill Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.id} — {selected.patient}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
                  {selected.status === "Locked" && <Lock className="h-4 w-4 text-muted-foreground" />}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><span className="text-muted-foreground">UHID:</span> {selected.uhid}</div>
                <div><span className="text-muted-foreground">Admission:</span> {selected.admissionDate}</div>
                <div><span className="text-muted-foreground">Doctor:</span> {selected.doctor}</div>
                <div><span className="text-muted-foreground">Ward:</span> {selected.ward}</div>
                <div><span className="text-muted-foreground">Bed:</span> {selected.bed}</div>
                <div><span className="text-muted-foreground">Estimated:</span> ₹{selected.estimatedCost.toLocaleString()}</div>
              </div>

              {/* Estimate vs Actual bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Charges: ₹{selected.totalCharges.toLocaleString()}</span>
                  <span>Estimate: ₹{selected.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${selected.totalCharges > selected.estimatedCost ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min((selected.totalCharges / selected.estimatedCost) * 100, 100)}%` }} />
                </div>
                {selected.totalCharges > selected.estimatedCost && <p className="text-xs text-destructive">⚠ Charges exceed estimate by ₹{(selected.totalCharges - selected.estimatedCost).toLocaleString()}</p>}
              </div>

              <Tabs defaultValue="charges">
                <TabsList>
                  <TabsTrigger value="charges">Daily Charges ({selected.dailyCharges.length})</TabsTrigger>
                  <TabsTrigger value="deposits">Deposits ({selected.deposits_list.length})</TabsTrigger>
                  <TabsTrigger value="summary">Bill Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="charges" className="mt-3">
                  {selected.dailyCharges.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Bill is locked — detailed charges archived.</p>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Service</TableHead><TableHead>Dept</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {selected.dailyCharges.map((c, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-muted-foreground text-sm">{c.date}</TableCell>
                            <TableCell className="font-medium text-sm">{c.service}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{c.dept}</TableCell>
                            <TableCell>{c.qty}</TableCell>
                            <TableCell>₹{c.rate.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">₹{c.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="deposits" className="mt-3 space-y-3">
                  {selected.deposits_list.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No deposit records available.</p>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Reference</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {selected.deposits_list.map((d, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-muted-foreground">{d.date}</TableCell>
                            <TableCell className="font-medium text-green-600">₹{d.amount.toLocaleString()}</TableCell>
                            <TableCell>{d.method}</TableCell>
                            <TableCell className="font-mono text-xs">{d.ref}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {selected.status === "Running" && (
                    <Button variant="outline" onClick={() => setShowDeposit(true)}><Plus className="h-4 w-4 mr-2" /> Add Deposit</Button>
                  )}
                </TabsContent>

                <TabsContent value="summary" className="mt-3">
                  <div className="border border-border rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Charges:</span><span className="font-medium">₹{selected.totalCharges.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Deposits:</span><span className="text-green-600">-₹{selected.deposits.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                      <span>{selected.balance > 0 ? "Balance Due:" : "Overpaid:"}</span>
                      <span className={selected.balance > 0 ? "text-destructive" : "text-green-600"}>₹{Math.abs(selected.balance).toLocaleString()}</span>
                    </div>
                  </div>
                  {selected.status === "Running" && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" className="flex-1"><FileText className="h-4 w-4 mr-2" /> Generate Interim Bill</Button>
                      <Button className="flex-1">Generate Discharge Bill</Button>
                    </div>
                  )}
                  {selected.status === "Discharge" && (
                    <div className="flex gap-2 mt-3">
                      <Button className="flex-1"><Lock className="h-4 w-4 mr-2" /> Finalize & Lock Bill</Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Deposit */}
      <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Deposit</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            <div><Label>Reference</Label><Input placeholder="Transaction reference" /></div>
            <div><Label>Notes</Label><Textarea placeholder="Optional notes..." rows={2} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeposit(false)}>Cancel</Button>
              <Button onClick={() => setShowDeposit(false)}>Record Deposit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
