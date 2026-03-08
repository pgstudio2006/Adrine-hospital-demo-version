import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const REPORT_CATEGORIES = [
  {
    category: 'Operational Reports',
    reports: [
      { name: 'Daily OPD Summary', description: 'Patient footfall, consultations, procedures', lastGenerated: '2025-03-08', frequency: 'Daily' },
      { name: 'IPD Census', description: 'Current admissions, discharges, bed occupancy', lastGenerated: '2025-03-08', frequency: 'Daily' },
      { name: 'Emergency Report', description: 'Emergency cases, response times, outcomes', lastGenerated: '2025-03-08', frequency: 'Daily' },
      { name: 'OT Utilization', description: 'Surgery schedule, utilization rate, delays', lastGenerated: '2025-03-07', frequency: 'Weekly' },
    ],
  },
  {
    category: 'Financial Reports',
    reports: [
      { name: 'Daily Revenue Collection', description: 'Cash, card, UPI, insurance collections', lastGenerated: '2025-03-08', frequency: 'Daily' },
      { name: 'Department Revenue', description: 'Revenue breakdown by department', lastGenerated: '2025-03-07', frequency: 'Weekly' },
      { name: 'Outstanding Receivables', description: 'Pending payments, aging analysis', lastGenerated: '2025-03-07', frequency: 'Weekly' },
      { name: 'Insurance Claims Status', description: 'Claim submissions, approvals, settlements', lastGenerated: '2025-03-05', frequency: 'Monthly' },
      { name: 'Profit & Loss Summary', description: 'Revenue vs expenses, net profit', lastGenerated: '2025-03-01', frequency: 'Monthly' },
    ],
  },
  {
    category: 'Clinical Reports',
    reports: [
      { name: 'Doctor Productivity', description: 'Consultations, procedures, revenue per doctor', lastGenerated: '2025-03-07', frequency: 'Weekly' },
      { name: 'Lab TAT Report', description: 'Test turnaround times, pending reports', lastGenerated: '2025-03-08', frequency: 'Daily' },
      { name: 'Radiology TAT Report', description: 'Imaging turnaround times, equipment utilization', lastGenerated: '2025-03-08', frequency: 'Daily' },
      { name: 'Pharmacy Dispensing', description: 'Prescriptions filled, stock movement', lastGenerated: '2025-03-08', frequency: 'Daily' },
    ],
  },
  {
    category: 'Compliance Reports',
    reports: [
      { name: 'Audit Trail Report', description: 'System-wide action log', lastGenerated: '2025-03-08', frequency: 'Daily' },
      { name: 'User Access Report', description: 'Login patterns, access violations', lastGenerated: '2025-03-07', frequency: 'Weekly' },
      { name: 'Data Privacy Report', description: 'Patient data access patterns', lastGenerated: '2025-03-05', frequency: 'Monthly' },
    ],
  },
];

export default function AdminMIS() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCategories = selectedCategory === 'all'
    ? REPORT_CATEGORIES
    : REPORT_CATEGORIES.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MIS Reports</h1>
          <p className="text-sm text-muted-foreground">Management Information System — hospital-wide analytics</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export All</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div><p className="text-2xl font-bold">{REPORT_CATEGORIES.reduce((s, c) => s + c.reports.length, 0)}</p><p className="text-xs text-muted-foreground">Total Reports</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <div><p className="text-2xl font-bold">4</p><p className="text-xs text-muted-foreground">Categories</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <div><p className="text-2xl font-bold">8</p><p className="text-xs text-muted-foreground">Daily Reports</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <FileText className="h-5 w-5 text-amber-500" />
          <div><p className="text-2xl font-bold">5</p><p className="text-xs text-muted-foreground">Weekly Reports</p></div>
        </CardContent></Card>
      </div>

      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {REPORT_CATEGORIES.map(c => <SelectItem key={c.category} value={c.category}>{c.category}</SelectItem>)}
        </SelectContent>
      </Select>

      {filteredCategories.map(cat => (
        <Card key={cat.category}>
          <CardHeader><CardTitle className="text-base">{cat.category}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cat.reports.map(r => (
                <div key={r.name} className="flex items-center justify-between border-b last:border-0 pb-3">
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{r.frequency}</Badge>
                    <span className="text-xs text-muted-foreground">{r.lastGenerated}</span>
                    <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> Generate</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
