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
import { Search, Plus, Package, AlertTriangle, Clock, Archive } from "lucide-react";

interface InventoryItem {
  id: string;
  drug: string;
  generic: string;
  category: string;
  batch: string;
  expiry: string;
  qty: number;
  reorder: number;
  location: string;
  supplier: string;
  price: number;
}

const inventory: InventoryItem[] = [
  { id: "INV-001", drug: "Amoxicillin 500mg", generic: "Amoxicillin", category: "Antibiotics", batch: "B-4401", expiry: "2027-06-15", qty: 24, reorder: 100, location: "Rack A-3", supplier: "MedPharma Ltd", price: 8.50 },
  { id: "INV-002", drug: "Paracetamol 650mg", generic: "Paracetamol", category: "Analgesics", batch: "B-4402", expiry: "2027-09-20", qty: 540, reorder: 200, location: "Rack A-1", supplier: "LifeCare Pharma", price: 2.00 },
  { id: "INV-003", drug: "Metformin 850mg", generic: "Metformin", category: "Diabetes", batch: "B-4421", expiry: "2026-03-20", qty: 180, reorder: 100, location: "Rack B-2", supplier: "DiaCare Inc", price: 5.00 },
  { id: "INV-004", drug: "Atorvastatin 20mg", generic: "Atorvastatin", category: "Cardiovascular", batch: "B-4430", expiry: "2027-12-01", qty: 320, reorder: 150, location: "Rack B-4", supplier: "HeartMed Corp", price: 12.00 },
  { id: "INV-005", drug: "Morphine 10mg Inj", generic: "Morphine Sulphate", category: "Controlled", batch: "C-1101", expiry: "2026-08-30", qty: 15, reorder: 20, location: "Safe-1", supplier: "NarcoMed Ltd", price: 95.00 },
  { id: "INV-006", drug: "Cetirizine 10mg", generic: "Cetirizine", category: "Antihistamines", batch: "B-4440", expiry: "2027-11-10", qty: 400, reorder: 200, location: "Rack A-2", supplier: "AllerFree Pharma", price: 3.00 },
  { id: "INV-007", drug: "Omeprazole 20mg", generic: "Omeprazole", category: "GI Drugs", batch: "B-4450", expiry: "2026-04-05", qty: 60, reorder: 100, location: "Rack C-1", supplier: "GastroMed Inc", price: 6.50 },
  { id: "INV-008", drug: "Azithromycin 500mg", generic: "Azithromycin", category: "Antibiotics", batch: "B-4460", expiry: "2027-07-22", qty: 110, reorder: 100, location: "Rack A-3", supplier: "MedPharma Ltd", price: 22.00 },
];

function getStockStatus(item: InventoryItem) {
  if (item.qty === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
  if (item.qty < item.reorder) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
  return { label: "In Stock", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
}

function getExpiryStatus(expiry: string) {
  const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  if (days <= 0) return { label: "Expired", color: "text-destructive" };
  if (days <= 30) return { label: `${days}d left`, color: "text-yellow-600 dark:text-yellow-400" };
  return { label: expiry, color: "text-muted-foreground" };
}

export default function PharmacyInventory() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const categories = [...new Set(inventory.map(i => i.category))];

  const filtered = inventory.filter(item => {
    const matchSearch = item.drug.toLowerCase().includes(search.toLowerCase()) || item.generic.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || item.category === catFilter;
    return matchSearch && matchCat;
  });

  const lowStock = inventory.filter(i => i.qty < i.reorder).length;
  const nearExpiry = inventory.filter(i => { const d = Math.ceil((new Date(i.expiry).getTime() - Date.now()) / 86400000); return d <= 30 && d > 0; }).length;
  const expired = inventory.filter(i => new Date(i.expiry) <= new Date()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground text-sm">Track stock levels, batches, and expiry dates</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" /> Add Stock</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Package className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold">{inventory.length}</p><p className="text-xs text-muted-foreground">Total Items</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-yellow-600" /><div><p className="text-2xl font-bold">{lowStock}</p><p className="text-xs text-muted-foreground">Low Stock</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><Clock className="h-8 w-8 text-orange-600" /><div><p className="text-2xl font-bold">{nearExpiry}</p><p className="text-xs text-muted-foreground">Near Expiry</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><Archive className="h-8 w-8 text-destructive" /><div><p className="text-2xl font-bold">{expired}</p><p className="text-xs text-muted-foreground">Expired</p></div></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search drug name or generic..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Generic</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const stock = getStockStatus(item);
                const exp = getExpiryStatus(item.expiry);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.drug}</TableCell>
                    <TableCell className="text-muted-foreground">{item.generic}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{item.category}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{item.batch}</TableCell>
                    <TableCell className={`text-xs ${exp.color}`}>{exp.label}</TableCell>
                    <TableCell className="font-medium">{item.qty}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${stock.color}`}>{stock.label}</span></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{item.location}</TableCell>
                    <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Stock Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Inventory Stock</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Drug Name</Label><Input placeholder="e.g. Amoxicillin 500mg" /></div>
              <div><Label>Generic Name</Label><Input placeholder="e.g. Amoxicillin" /></div>
              <div><Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Batch Number</Label><Input placeholder="e.g. B-4500" /></div>
              <div><Label>Expiry Date</Label><Input type="date" /></div>
              <div><Label>Quantity</Label><Input type="number" placeholder="0" /></div>
              <div><Label>Storage Location</Label><Input placeholder="e.g. Rack A-1" /></div>
              <div><Label>Price per Unit (₹)</Label><Input type="number" step="0.01" placeholder="0.00" /></div>
            </div>
            <div><Label>Supplier</Label><Input placeholder="Supplier name" /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={() => setShowAdd(false)}>Add to Inventory</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
