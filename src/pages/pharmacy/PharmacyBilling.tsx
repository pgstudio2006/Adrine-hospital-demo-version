import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Receipt, IndianRupee, CreditCard, Banknote } from "lucide-react";

interface PharmacyInvoice {
  id: string;
  rxId: string;
  uhid: string;
  patient: string;
  date: string;
  items: number;
  total: number;
  discount: number;
  net: number;
  payMethod: string;
  payStatus: "Paid" | "Pending" | "Insurance" | "Partial";
}

const invoices: PharmacyInvoice[] = [
  { id: "PB-5001", rxId: "RX-2399", uhid: "UH-10035", patient: "Suresh Kumar", date: "2026-03-08", items: 2, total: 650, discount: 0, net: 650, payMethod: "Cash", payStatus: "Paid" },
  { id: "PB-5002", rxId: "RX-2397", uhid: "UH-10021", patient: "Vikram Singh", date: "2026-03-08", items: 1, total: 95, discount: 0, net: 95, payMethod: "Cash", payStatus: "Paid" },
  { id: "PB-5003", rxId: "RX-2400", uhid: "UH-10038", patient: "Anita Desai", date: "2026-03-08", items: 2, total: 1260, discount: 126, net: 1134, payMethod: "Insurance", payStatus: "Insurance" },
  { id: "PB-5004", rxId: "RX-2401", uhid: "UH-10042", patient: "Ravi Sharma", date: "2026-03-08", items: 4, total: 410, discount: 0, net: 410, payMethod: "UPI", payStatus: "Pending" },
  { id: "PB-5005", rxId: "RX-2398", uhid: "UH-10029", patient: "Meena Joshi", date: "2026-03-07", items: 3, total: 820, discount: 82, net: 738, payMethod: "Card", payStatus: "Partial" },
];

const payStatusColor: Record<string, string> = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Insurance: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Partial: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function PharmacyBilling() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<PharmacyInvoice | null>(null);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.patient.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.payStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const todayTotal = invoices.filter(i => i.date === "2026-03-08").reduce((sum, i) => sum + i.net, 0);
  const pendingTotal = invoices.filter(i => i.payStatus === "Pending" || i.payStatus === "Partial").reduce((sum, i) => sum + i.net, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pharmacy Billing</h1>
        <p className="text-muted-foreground text-sm">Medication invoices, payments, and insurance billing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Receipt className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{invoices.length}</p><p className="text-xs text-muted-foreground">Total Invoices</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><IndianRupee className="h-8 w-8 text-green-600" /><div><p className="text-2xl font-bold">₹{todayTotal.toLocaleString()}</p><p className="text-xs text-muted-foreground">Today's Revenue</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><Banknote className="h-8 w-8 text-yellow-600" /><div><p className="text-2xl font-bold">₹{pendingTotal.toLocaleString()}</p><p className="text-xs text-muted-foreground">Pending Payments</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><CreditCard className="h-8 w-8 text-blue-600" /><div><p className="text-2xl font-bold">{invoices.filter(i => i.payStatus === "Insurance").length}</p><p className="text-xs text-muted-foreground">Insurance Claims</p></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient or invoice ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Payment status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Insurance">Insurance</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Rx ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>UHID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Net (₹)</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{inv.rxId}</TableCell>
                  <TableCell className="font-medium">{inv.patient}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.uhid}</TableCell>
                  <TableCell>{inv.items}</TableCell>
                  <TableCell>₹{inv.total.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.discount > 0 ? `₹${inv.discount}` : "—"}</TableCell>
                  <TableCell className="font-medium">₹{inv.net.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{inv.payMethod}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${payStatusColor[inv.payStatus]}`}>{inv.payStatus}</span></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => setSelected(inv)}><Eye className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader><DialogTitle>Invoice {selected.id}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient}</span></div>
                  <div><span className="text-muted-foreground">UHID:</span> {selected.uhid}</div>
                  <div><span className="text-muted-foreground">Prescription:</span> {selected.rxId}</div>
                  <div><span className="text-muted-foreground">Date:</span> {selected.date}</div>
                </div>
                <div className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal:</span><span>₹{selected.total.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Discount:</span><span>-₹{selected.discount}</span></div>
                  <div className="flex justify-between font-bold border-t border-border pt-2"><span>Net Amount:</span><span>₹{selected.net.toLocaleString()}</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment: {selected.payMethod}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${payStatusColor[selected.payStatus]}`}>{selected.payStatus}</span>
                </div>
                {(selected.payStatus === "Pending" || selected.payStatus === "Partial") && (
                  <Button className="w-full" onClick={() => setSelected(null)}>Record Payment</Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
