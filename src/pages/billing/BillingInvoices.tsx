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
import { Search, Eye, Plus, Printer, Send, FileText } from "lucide-react";

interface InvoiceItem {
  service: string;
  dept: string;
  qty: number;
  rate: number;
  tax: number;
  amount: number;
}

interface Invoice {
  id: string;
  billId: string;
  uhid: string;
  patient: string;
  category: "OPD" | "IPD" | "Emergency" | "Pharmacy" | "Lab" | "Radiology" | "Package";
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discount: number;
  netAmount: number;
  status: "Draft" | "Finalized" | "Sent" | "Paid" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Partial" | "Refunded";
}

const invoices: Invoice[] = [
  {
    id: "INV-7001", billId: "BIL-9001", uhid: "UH-10042", patient: "Ravi Sharma", category: "OPD", date: "2026-03-08",
    items: [
      { service: "Consultation — General Medicine", dept: "Medicine", qty: 1, rate: 800, tax: 0, amount: 800 },
      { service: "Blood Test — CBC", dept: "Laboratory", qty: 1, rate: 350, tax: 18, amount: 413 },
      { service: "X-ray Chest PA", dept: "Radiology", qty: 1, rate: 350, tax: 18, amount: 413 },
    ],
    subtotal: 1500, taxTotal: 126, discount: 0, netAmount: 1626, status: "Finalized", paymentStatus: "Paid",
  },
  {
    id: "INV-7002", billId: "BIL-9002", uhid: "UH-10035", patient: "Suresh Kumar", category: "IPD", date: "2026-03-08",
    items: [
      { service: "General Ward — 3 days", dept: "IPD", qty: 3, rate: 2500, tax: 0, amount: 7500 },
      { service: "Surgery — Appendectomy", dept: "Surgery", qty: 1, rate: 25000, tax: 5, amount: 26250 },
      { service: "Anesthesia", dept: "OT", qty: 1, rate: 5000, tax: 5, amount: 5250 },
      { service: "Post-op medications", dept: "Pharmacy", qty: 1, rate: 3200, tax: 12, amount: 3584 },
      { service: "Lab investigations", dept: "Laboratory", qty: 1, rate: 2800, tax: 18, amount: 3304 },
    ],
    subtotal: 38500, taxTotal: 7388, discount: 3850, netAmount: 42038, status: "Finalized", paymentStatus: "Partial",
  },
  {
    id: "INV-7003", billId: "BIL-9003", uhid: "UH-10038", patient: "Anita Desai", category: "OPD", date: "2026-03-08",
    items: [
      { service: "Consultation — Cardiology", dept: "Cardiology", qty: 1, rate: 1200, tax: 0, amount: 1200 },
      { service: "ECG", dept: "Cardiology", qty: 1, rate: 500, tax: 18, amount: 590 },
      { service: "Lipid Profile", dept: "Laboratory", qty: 1, rate: 600, tax: 18, amount: 708 },
    ],
    subtotal: 2300, taxTotal: 198, discount: 0, netAmount: 2498, status: "Sent", paymentStatus: "Pending",
  },
  {
    id: "INV-7004", billId: "BIL-9004", uhid: "UH-10021", patient: "Vikram Singh", category: "Emergency", date: "2026-03-07",
    items: [
      { service: "Emergency consultation", dept: "Emergency", qty: 1, rate: 2000, tax: 0, amount: 2000 },
      { service: "IV fluids + medication", dept: "Pharmacy", qty: 1, rate: 1500, tax: 12, amount: 1680 },
      { service: "CT Head", dept: "Radiology", qty: 1, rate: 2500, tax: 18, amount: 2950 },
      { service: "Observation — 6 hrs", dept: "Emergency", qty: 1, rate: 1500, tax: 0, amount: 1500 },
    ],
    subtotal: 7500, taxTotal: 630, discount: 0, netAmount: 8130, status: "Draft", paymentStatus: "Pending",
  },
  {
    id: "INV-7005", billId: "BIL-9005", uhid: "UH-10029", patient: "Meena Joshi", category: "Package", date: "2026-03-07",
    items: [
      { service: "Health Checkup — Premium Package", dept: "Preventive", qty: 1, rate: 5999, tax: 18, amount: 7079 },
    ],
    subtotal: 5999, taxTotal: 1080, discount: 600, netAmount: 6479, status: "Finalized", paymentStatus: "Paid",
  },
];

const statusColor: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Finalized: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Sent: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const payColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Partial: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Refunded: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function BillingInvoices() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.patient.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || inv.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground text-sm">Generate, manage, and track patient invoices</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Invoice</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patient or invoice ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="OPD">OPD</SelectItem>
            <SelectItem value="IPD">IPD</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
            <SelectItem value="Pharmacy">Pharmacy</SelectItem>
            <SelectItem value="Lab">Laboratory</SelectItem>
            <SelectItem value="Radiology">Radiology</SelectItem>
            <SelectItem value="Package">Package</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                  <TableCell>
                    <div><span className="font-medium">{inv.patient}</span><br /><span className="text-xs text-muted-foreground">{inv.uhid}</span></div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{inv.category}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>{inv.items.length}</TableCell>
                  <TableCell className="font-medium">₹{inv.netAmount.toLocaleString()}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[inv.status]}`}>{inv.status}</span></TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${payColor[inv.paymentStatus]}`}>{inv.paymentStatus}</span></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelected(inv)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Printer className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Invoice {selected.id}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{selected.status}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{selected.patient}</span></div>
                  <div><span className="text-muted-foreground">UHID:</span> {selected.uhid}</div>
                  <div><span className="text-muted-foreground">Bill ID:</span> {selected.billId}</div>
                  <div><span className="text-muted-foreground">Date:</span> {selected.date}</div>
                  <div><span className="text-muted-foreground">Category:</span> <Badge variant="outline" className="text-xs">{selected.category}</Badge></div>
                  <div><span className="text-muted-foreground">Payment:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${payColor[selected.paymentStatus]}`}>{selected.paymentStatus}</span></div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Dept</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Tax %</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{item.service}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.dept}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>₹{item.rate.toLocaleString()}</TableCell>
                        <TableCell>{item.tax > 0 ? `${item.tax}%` : "—"}</TableCell>
                        <TableCell className="font-medium">₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="border border-border rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal:</span><span>₹{selected.subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax:</span><span>₹{selected.taxTotal.toLocaleString()}</span></div>
                  {selected.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount:</span><span className="text-green-600">-₹{selected.discount.toLocaleString()}</span></div>}
                  <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>Net Payable:</span><span>₹{selected.netAmount.toLocaleString()}</span></div>
                </div>

                <div className="flex gap-2">
                  {selected.status === "Draft" && <Button className="flex-1" onClick={() => setSelected(null)}>Finalize Invoice</Button>}
                  {selected.status === "Finalized" && <Button className="flex-1" onClick={() => setSelected(null)}><Send className="h-4 w-4 mr-2" /> Send to Patient</Button>}
                  <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Print</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
