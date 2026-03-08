import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, CreditCard, IndianRupee, Download, Printer, Eye, Filter } from 'lucide-react';

interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: { description: string; amount: number }[];
  total: number;
  paid: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentMode?: string;
}

const invoices: Invoice[] = [
  { id: 'INV-5001', patientId: 'P-2401', patientName: 'Rajesh Sharma', date: '8 Mar 2026', items: [{ description: 'Consultation - Cardiology', amount: 800 }, { description: 'ECG', amount: 500 }, { description: 'Blood Tests', amount: 1200 }], total: 2500, paid: 2500, status: 'paid', paymentMode: 'UPI' },
  { id: 'INV-5002', patientId: 'P-2402', patientName: 'Priya Patel', date: '8 Mar 2026', items: [{ description: 'Consultation - Gynecology', amount: 1000 }, { description: 'Ultrasound', amount: 1500 }], total: 2500, paid: 1000, status: 'partial', paymentMode: 'Cash' },
  { id: 'INV-5003', patientId: 'P-2403', patientName: 'Amit Kumar', date: '8 Mar 2026', items: [{ description: 'Emergency Consultation', amount: 1500 }, { description: 'X-Ray', amount: 800 }, { description: 'Medicines', amount: 650 }], total: 2950, paid: 0, status: 'pending' },
  { id: 'INV-5004', patientId: 'P-2404', patientName: 'Sunita Devi', date: '7 Mar 2026', items: [{ description: 'Consultation - Orthopedics', amount: 1000 }], total: 1000, paid: 0, status: 'overdue' },
  { id: 'INV-5005', patientId: 'P-2405', patientName: 'Vikram Singh', date: '8 Mar 2026', items: [{ description: 'Consultation - ENT', amount: 700 }, { description: 'Audiometry', amount: 600 }], total: 1300, paid: 1300, status: 'paid', paymentMode: 'Card' },
];

const statusStyles: Record<string, string> = {
  paid: 'bg-success/10 text-success',
  partial: 'bg-warning/10 text-warning',
  pending: 'bg-info/10 text-info',
  overdue: 'bg-destructive/10 text-destructive',
};

export default function ReceptionBilling() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Invoice | null>(null);

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);
  const totalPending = invoices.reduce((s, i) => s + (i.total - i.paid), 0);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.patientName.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || inv.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate invoices and collect payments</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Today's Collection</p>
          <p className="text-xl font-bold flex items-center"><IndianRupee className="w-4 h-4" />{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Pending Amount</p>
          <p className="text-xl font-bold flex items-center text-warning"><IndianRupee className="w-4 h-4" />{totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Invoices Today</p>
          <p className="text-xl font-bold">{invoices.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Paid</p>
          <p className="text-xl font-bold text-success">{invoices.filter(i => i.status === 'paid').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card text-sm" placeholder="Search invoices..." />
        </div>
        <div className="flex gap-1.5">
          {['all', 'paid', 'partial', 'pending', 'overdue'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Patient</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(inv => (
                <tr key={inv.id} onClick={() => setSelected(inv)} className={`hover:bg-accent/50 transition-colors cursor-pointer ${selected?.id === inv.id ? 'bg-accent/50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </td>
                  <td className="px-4 py-3 text-sm hidden sm:table-cell">{inv.patientName}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-semibold">₹{inv.total.toLocaleString()}</p>
                    {inv.status === 'partial' && <p className="text-xs text-muted-foreground">Paid ₹{inv.paid.toLocaleString()}</p>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded hover:bg-accent"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Preview */}
        <div className="rounded-xl border bg-card p-5">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selected.id}</h3>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded hover:bg-accent"><Printer className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1.5 rounded hover:bg-accent"><Download className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Patient:</span> {selected.patientName}</p>
                <p><span className="text-muted-foreground">Date:</span> {selected.date}</p>
                <p><span className="text-muted-foreground">Status:</span> <span className={`px-1.5 py-0.5 rounded-full text-xs ${statusStyles[selected.status]}`}>{selected.status}</span></p>
              </div>
              <div className="border-t pt-3 space-y-2">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.description}</span>
                    <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{selected.total.toLocaleString()}</span>
                </div>
                {selected.paid > 0 && selected.paid < selected.total && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Paid</span>
                    <span>₹{selected.paid.toLocaleString()}</span>
                  </div>
                )}
                {selected.total - selected.paid > 0 && (
                  <div className="flex justify-between text-sm text-warning font-medium">
                    <span>Balance Due</span>
                    <span>₹{(selected.total - selected.paid).toLocaleString()}</span>
                  </div>
                )}
              </div>
              {selected.status !== 'paid' && (
                <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Collect Payment
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <FileText className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Select an invoice to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
