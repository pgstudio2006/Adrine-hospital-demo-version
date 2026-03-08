import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Building2, Eye, Star } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  categories: string[];
  totalOrders: number;
  rating: number;
  status: "Active" | "Inactive";
}

const suppliers: Supplier[] = [
  { id: "SUP-001", name: "MedPharma Ltd", contact: "Rajesh Gupta", phone: "+91 98765 43210", email: "rajesh@medpharma.com", address: "Plot 12, Industrial Area, Ahmedabad", categories: ["Antibiotics", "GI Drugs"], totalOrders: 145, rating: 4.5, status: "Active" },
  { id: "SUP-002", name: "LifeCare Pharma", contact: "Priya Sharma", phone: "+91 87654 32109", email: "priya@lifecare.com", address: "Sector 8, Pharma Hub, Mumbai", categories: ["Analgesics", "Antipyretics"], totalOrders: 210, rating: 4.8, status: "Active" },
  { id: "SUP-003", name: "DiaCare Inc", contact: "Amit Patel", phone: "+91 76543 21098", email: "amit@diacare.com", address: "Phase 3, MedCity, Hyderabad", categories: ["Diabetes"], totalOrders: 78, rating: 4.2, status: "Active" },
  { id: "SUP-004", name: "HeartMed Corp", contact: "Sana Khan", phone: "+91 65432 10987", email: "sana@heartmed.com", address: "Block B, Health Park, Delhi", categories: ["Cardiovascular"], totalOrders: 92, rating: 4.0, status: "Active" },
  { id: "SUP-005", name: "NarcoMed Ltd", contact: "Dr. Verma", phone: "+91 54321 09876", email: "verma@narcomed.com", address: "Controlled Zone, Pharma District, Pune", categories: ["Controlled"], totalOrders: 34, rating: 4.7, status: "Active" },
  { id: "SUP-006", name: "AllerFree Pharma", contact: "Neha Singh", phone: "+91 43210 98765", email: "neha@allerfree.com", address: "Unit 5, Pharma Complex, Jaipur", categories: ["Antihistamines"], totalOrders: 56, rating: 3.8, status: "Inactive" },
];

export default function PharmacySuppliers() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground text-sm">Manage drug suppliers and track purchase history</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" /> Add Supplier</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="h-4 w-4 text-primary" /></div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{s.contact}</TableCell>
                  <TableCell className="text-muted-foreground">{s.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">{s.categories.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                  </TableCell>
                  <TableCell>{s.totalOrders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /><span className="text-sm">{s.rating}</span></div>
                  </TableCell>
                  <TableCell><Badge variant={s.status === "Active" ? "default" : "secondary"} className="text-xs">{s.status}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => setSelected(s)}><Eye className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Supplier Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader><DialogTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> {selected.name}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Contact:</span> {selected.contact}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {selected.phone}</div>
                  <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                  <div><span className="text-muted-foreground">Total Orders:</span> {selected.totalOrders}</div>
                </div>
                <div><span className="text-muted-foreground">Address:</span> {selected.address}</div>
                <div>
                  <span className="text-muted-foreground">Drug Categories:</span>
                  <div className="flex flex-wrap gap-1 mt-1">{selected.categories.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Supplier */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Supplier Name</Label><Input placeholder="Company name" /></div>
              <div><Label>Contact Person</Label><Input placeholder="Name" /></div>
              <div><Label>Phone</Label><Input placeholder="+91..." /></div>
              <div><Label>Email</Label><Input type="email" placeholder="email@company.com" /></div>
            </div>
            <div><Label>Address</Label><Textarea placeholder="Full address" rows={2} /></div>
            <div><Label>Drug Categories Supplied</Label><Input placeholder="Comma-separated categories" /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={() => { setShowAdd(false); toast.success("Supplier saved successfully"); }}>Save Supplier</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
