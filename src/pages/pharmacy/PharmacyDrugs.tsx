import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Pill, Edit, ShieldAlert } from "lucide-react";

interface Drug {
  id: string;
  name: string;
  generic: string;
  brand: string;
  category: string;
  manufacturer: string;
  form: string;
  strength: string;
  price: number;
  controlled: boolean;
  active: boolean;
  interactions: string[];
}

const drugs: Drug[] = [
  { id: "DRG-001", name: "Amoxicillin 500mg Cap", generic: "Amoxicillin", brand: "Amoxil", category: "Antibiotics", manufacturer: "MedPharma Ltd", form: "Capsule", strength: "500mg", price: 8.50, controlled: false, active: true, interactions: ["Methotrexate", "Warfarin"] },
  { id: "DRG-002", name: "Paracetamol 650mg Tab", generic: "Paracetamol", brand: "Calpol", category: "Analgesics", manufacturer: "LifeCare Pharma", form: "Tablet", strength: "650mg", price: 2.00, controlled: false, active: true, interactions: ["Warfarin"] },
  { id: "DRG-003", name: "Metformin 850mg Tab", generic: "Metformin HCl", brand: "Glycomet", category: "Diabetes", manufacturer: "DiaCare Inc", form: "Tablet", strength: "850mg", price: 5.00, controlled: false, active: true, interactions: ["Contrast dye", "Alcohol"] },
  { id: "DRG-004", name: "Atorvastatin 20mg Tab", generic: "Atorvastatin Calcium", brand: "Lipitor", category: "Cardiovascular", manufacturer: "HeartMed Corp", form: "Tablet", strength: "20mg", price: 12.00, controlled: false, active: true, interactions: ["Clarithromycin", "Grapefruit"] },
  { id: "DRG-005", name: "Morphine 10mg Inj", generic: "Morphine Sulphate", brand: "MS Contin", category: "Controlled", manufacturer: "NarcoMed Ltd", form: "Injection", strength: "10mg/ml", price: 95.00, controlled: true, active: true, interactions: ["Benzodiazepines", "MAO inhibitors", "Alcohol"] },
  { id: "DRG-006", name: "Cetirizine 10mg Tab", generic: "Cetirizine HCl", brand: "Zyrtec", category: "Antihistamines", manufacturer: "AllerFree Pharma", form: "Tablet", strength: "10mg", price: 3.00, controlled: false, active: true, interactions: ["CNS depressants"] },
  { id: "DRG-007", name: "Omeprazole 20mg Cap", generic: "Omeprazole", brand: "Prilosec", category: "GI Drugs", manufacturer: "GastroMed Inc", form: "Capsule", strength: "20mg", price: 6.50, controlled: false, active: true, interactions: ["Clopidogrel", "Methotrexate"] },
  { id: "DRG-008", name: "Diazepam 5mg Tab", generic: "Diazepam", brand: "Valium", category: "Controlled", manufacturer: "NarcoMed Ltd", form: "Tablet", strength: "5mg", price: 15.00, controlled: true, active: false, interactions: ["Opioids", "Alcohol", "CNS depressants"] },
];

const categories = [...new Set(drugs.map(d => d.category))];
const forms = ["Tablet", "Capsule", "Injection", "Syrup", "Cream", "Drops", "Inhaler", "Nasal Spray"];

export default function PharmacyDrugs() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Drug | null>(null);

  const filtered = drugs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.generic.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || d.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Drug Catalog</h1>
          <p className="text-muted-foreground text-sm">Manage medication database, categories, and interactions</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" /> Add Drug</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search drug or generic name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id} className={!d.active ? "opacity-50" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      {d.name}
                      {d.controlled && <ShieldAlert className="h-3.5 w-3.5 text-destructive" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.generic}</TableCell>
                  <TableCell>{d.brand}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{d.category}</Badge></TableCell>
                  <TableCell>{d.form}</TableCell>
                  <TableCell>{d.strength}</TableCell>
                  <TableCell>₹{d.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={d.active ? "default" : "secondary"} className="text-xs">{d.active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelected(d)}><Edit className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drug Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" /> {selected.name}
                  {selected.controlled && <Badge variant="destructive" className="text-xs">Controlled</Badge>}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Generic:</span> {selected.generic}</div>
                  <div><span className="text-muted-foreground">Brand:</span> {selected.brand}</div>
                  <div><span className="text-muted-foreground">Category:</span> {selected.category}</div>
                  <div><span className="text-muted-foreground">Form:</span> {selected.form}</div>
                  <div><span className="text-muted-foreground">Strength:</span> {selected.strength}</div>
                  <div><span className="text-muted-foreground">Manufacturer:</span> {selected.manufacturer}</div>
                  <div><span className="text-muted-foreground">Price:</span> ₹{selected.price.toFixed(2)}</div>
                  <div className="flex items-center gap-2"><span className="text-muted-foreground">Active:</span> <Switch checked={selected.active} /></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Known Drug Interactions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.interactions.map(int => (
                      <Badge key={int} variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20">{int}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Drug Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Drug</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Drug Name</Label><Input placeholder="Full name with strength" /></div>
              <div><Label>Generic Name</Label><Input placeholder="Generic compound" /></div>
              <div><Label>Brand Name</Label><Input placeholder="Brand" /></div>
              <div><Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Dosage Form</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{forms.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Strength</Label><Input placeholder="e.g. 500mg" /></div>
              <div><Label>Manufacturer</Label><Input placeholder="Company name" /></div>
              <div><Label>Price (₹)</Label><Input type="number" step="0.01" placeholder="0.00" /></div>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="controlled" />
              <Label htmlFor="controlled">Controlled Substance</Label>
            </div>
            <div><Label>Known Interactions</Label><Textarea placeholder="Comma-separated drug names..." rows={2} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={() => setShowAdd(false)}>Save Drug</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
