import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, CreditCard, IndianRupee, Download, Printer, Eye, X, Banknote, Smartphone, Shield, FileText } from 'lucide-react';

interface Invoice {
  id: string;
  uhid: string;
  patientName: string;
  appointmentId: string;
  date: string;
  billingCategory: 'OPD' | 'IPD' | 'Emergency' | 'Lab' | 'Pharmacy' | 'Radiology';
  items: { description: string; serviceType: string; amount: number }[];
  total: number;
  paid: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentMode?: 'cash' | 'card' | 'upi' | 'insurance' | 'mixed';
  insuranceClaim?: number;
}

const invoices: Invoice[] = [
  { id: 'INV-5001', uhid: 'UHID-240001', patientName: 'Rajesh Sharma', appointmentId: 'APT-10001', date: '8 Mar 2026', billingCategory: 'OPD',
    items: [{ description: 'Consultation - Cardiology', serviceType: 'Consultation', amount: 800 }, { description: 'ECG', serviceType: 'Diagnostic', amount: 500 }, { description: 'Blood Tests (CBC, Lipid)', serviceType: 'Lab', amount: 1200 }],
    total: 2500, paid: 2500, status: 'paid', paymentMode: 'upi' },
  { id: 'INV-5002', uhid: 'UHID-240002', patientName: 'Priya Patel', appointmentId: 'APT-10002', date: '8 Mar 2026', billingCategory: 'OPD',
    items: [{ description: 'Consultation - Gynecology', serviceType: 'Consultation', amount: 1000 }, { description: 'Ultrasound', serviceType: 'Radiology', amount: 1500 }],
    total: 2500, paid: 1000, status: 'partial', paymentMode: 'cash' },
  { id: 'INV-5003', uhid: 'UHID-240003', patientName: 'Amit Kumar', appointmentId: 'APT-10003', date: '8 Mar 2026', billingCategory: 'Emergency',
    items: [{ description: 'Emergency Consultation', serviceType: 'Emergency', amount: 1500 }, { description: 'X-Ray Chest', serviceType: 'Radiology', amount: 800 }, { description: 'Medicines', serviceType: 'Pharmacy', amount: 650 }],
    total: 2950, paid: 0, status: 'pending' },
  { id: 'INV-5004', uhid: 'UHID-240004', patientName: 'Sunita Devi', appointmentId: 'APT-10006', date: '7 Mar 2026', billingCategory: 'OPD',
    items: [{ description: 'Consultation - Orthopedics', serviceType: 'Consultation', amount: 1000 }],
    total: 1000, paid: 0, status: 'overdue' },
  { id: 'INV-5005', uhid: 'UHID-240005', patientName: 'Vikram Singh', appointmentId: 'APT-10005', date: '8 Mar 2026', billingCategory: 'OPD',
    items: [{ description: 'Consultation - ENT', serviceType: 'Consultation', amount: 700 }, { description: 'Audiometry', serviceType: 'Diagnostic', amount: 600 }],
    total: 1300, paid: 1300, status: 'paid', paymentMode: 'card' },
  { id: 'INV-5006', uhid: 'UHID-240006', patientName: 'Neha Gupta', appointmentId: 'APT-10004', date: '8 Mar 2026', billingCategory: 'OPD',
    items: [{ description: 'Consultation - Dermatology', serviceType: 'Consultation', amount: 900 }, { description: 'Skin Biopsy', serviceType: 'Procedure', amount: 2000 }],
    total: 2900, paid: 2900, status: 'paid', paymentMode: 'insurance', insuranceClaim: 2900 },
  { id: 'INV-5007', uhid: 'UHID-240007', patientName: 'Arjun Reddy', appointmentId: 'APT-10007', date: '8 Mar 2026', billingCategory: 'IPD',
    items: [{ description: 'Room Charges (3 days)', serviceType: 'IPD', amount: 6000 }, { description: 'Knee Replacement Surgery', serviceType: 'Procedure', amount: 85000 }, { description: 'Anaesthesia', serviceType: 'Procedure', amount: 8000 }, { description: 'Medicines', serviceType: 'Pharmacy', amount: 4500 }],
    total: 103500, paid: 50000, status: 'partial', paymentMode: 'mixed', insuranceClaim: 50000 },
];

const statusStyles: Record<string, string> = {
  paid: 'bg-success/10 text-success',
  partial: 'bg-warning/10 text-warning',
  pending: 'bg-info/10 text-info',
  overdue: 'bg-destructive/10 text-destructive',
};

const paymentModeIcons: Record<string, { icon: typeof CreditCard; label: string }> = {
  cash: { icon: Banknote, label: 'Cash' },
  card: { icon: CreditCard, label: 'Card' },
  upi: { icon: Smartphone, label: 'UPI' },
  insurance: { icon: Shield, label: 'Insurance' },
  mixed: { icon: CreditCard, label: 'Mixed' },
};

export default function ReceptionBilling() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [paymentModal, setPaymentModal] = useState<Invoice | null>(null);
  const [paymentMode, setPaymentMode] = useState<string>('cash');

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);
  const totalPending = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const insuranceClaims = invoices.reduce((s, i) => s + (i.insuranceClaim || 0), 0);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.patientName.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()) || inv.uhid.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || inv.status === filter;
    const matchCategory = categoryFilter === 'all' || inv.billingCategory === categoryFilter;
    return matchSearch && matchFilter && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate invoices and collect payments</p>
        </div>
        <button onClick={() => setShowNewInvoice(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Today's Collection</p>
          <p className="text-xl font-bold flex items-center"><IndianRupee className="w-4 h-4" />{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Pending Amount</p>
          <p className="text-xl font-bold flex items-center text-warning"><IndianRupee className="w-4 h-4" />{totalPending.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Insurance Claims</p>
          <p className="text-xl font-bold flex items-center text-info"><IndianRupee className="w-4 h-4" />{insuranceClaims.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Invoices Today</p>
          <p className="text-xl font-bold">{invoices.length}</p>
          <p className="text-xs text-success">{invoices.filter(i => i.status === 'paid').length} paid</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
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

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto">
        {['all', 'OPD', 'IPD', 'Emergency', 'Lab', 'Pharmacy', 'Radiology'].map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${categoryFilter === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Mode</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(inv => {
                const modeInfo = inv.paymentMode ? paymentModeIcons[inv.paymentMode] : null;
                return (
                  <tr key={inv.id} onClick={() => setSelected(inv)} className={`hover:bg-accent/50 transition-colors cursor-pointer ${selected?.id === inv.id ? 'bg-accent/50' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{inv.id}</p>
                      <p className="text-xs text-muted-foreground">{inv.date}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-sm">{inv.patientName}</p>
                      <p className="text-xs text-muted-foreground">{inv.uhid}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        inv.billingCategory === 'Emergency' ? 'bg-destructive/10 text-destructive' :
                        inv.billingCategory === 'IPD' ? 'bg-info/10 text-info' :
                        'bg-muted text-muted-foreground'
                      }`}>{inv.billingCategory}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-semibold">₹{inv.total.toLocaleString('en-IN')}</p>
                      {inv.status === 'partial' && <p className="text-xs text-muted-foreground">Paid ₹{inv.paid.toLocaleString('en-IN')}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[inv.status]}`}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {modeInfo && <span className="text-xs text-muted-foreground">{modeInfo.label}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded hover:bg-accent"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </td>
                  </tr>
                );
              })}
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
                <p><span className="text-muted-foreground">Patient:</span> {selected.patientName} ({selected.uhid})</p>
                <p><span className="text-muted-foreground">Date:</span> {selected.date}</p>
                <p><span className="text-muted-foreground">Category:</span> {selected.billingCategory}</p>
                <p><span className="text-muted-foreground">Appointment:</span> {selected.appointmentId}</p>
                <p><span className="text-muted-foreground">Status:</span> <span className={`px-1.5 py-0.5 rounded-full text-xs ${statusStyles[selected.status]}`}>{selected.status}</span></p>
                {selected.paymentMode && <p><span className="text-muted-foreground">Payment:</span> {paymentModeIcons[selected.paymentMode]?.label}</p>}
              </div>
              <div className="border-t pt-3 space-y-2">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <span>{item.description}</span>
                      <span className="text-xs text-muted-foreground ml-1">({item.serviceType})</span>
                    </div>
                    <span className="font-medium">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{selected.total.toLocaleString('en-IN')}</span>
                </div>
                {selected.insuranceClaim && selected.insuranceClaim > 0 && (
                  <div className="flex justify-between text-sm text-info">
                    <span>Insurance Claim</span>
                    <span>₹{selected.insuranceClaim.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selected.paid > 0 && selected.paid < selected.total && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Paid</span>
                    <span>₹{selected.paid.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selected.total - selected.paid > 0 && (
                  <div className="flex justify-between text-sm text-warning font-medium">
                    <span>Balance Due</span>
                    <span>₹{(selected.total - selected.paid).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
              {selected.status !== 'paid' && (
                <button onClick={() => setPaymentModal(selected)}
                  className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
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

      {/* Payment Collection Modal */}
      <AnimatePresence>
        {paymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPaymentModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border rounded-xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Collect Payment</h2>
                <button onClick={() => setPaymentModal(null)} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Invoice:</span> {paymentModal.id}</p>
                <p><span className="text-muted-foreground">Patient:</span> {paymentModal.patientName}</p>
                <p className="text-lg font-bold">Due: ₹{(paymentModal.total - paymentModal.paid).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'cash', label: 'Cash', icon: Banknote },
                    { key: 'card', label: 'Card', icon: CreditCard },
                    { key: 'upi', label: 'UPI', icon: Smartphone },
                    { key: 'insurance', label: 'Insurance', icon: Shield },
                  ].map(m => (
                    <button key={m.key} onClick={() => setPaymentMode(m.key)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${paymentMode === m.key ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}>
                      <m.icon className="w-4 h-4" /> {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Amount (₹)</label>
                <input type="number" defaultValue={paymentModal.total - paymentModal.paid}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
              </div>
              {paymentMode === 'insurance' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">TPA / Insurance Reference</label>
                  <input className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Claim reference number" />
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setPaymentModal(null)} className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent">Cancel</button>
                <button onClick={() => setPaymentModal(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
                  <IndianRupee className="w-4 h-4" /> Confirm Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
