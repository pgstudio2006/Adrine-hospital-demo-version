import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Plus, Search, Users, IndianRupee, Percent, FileText, Mail } from 'lucide-react';
import { useState } from 'react';

const sharingPolicies = [
  { id: 'SP-001', doctor: 'Dr. Rajesh Sharma', department: 'Cardiology', type: 'Percentage', opdShare: '30%', ipdShare: '25%', surgeryShare: '35%', referralShare: '10%', status: 'Active' },
  { id: 'SP-002', doctor: 'Dr. Priya Kumar', department: 'Orthopedics', type: 'Percentage', opdShare: '35%', ipdShare: '30%', surgeryShare: '40%', referralShare: '15%', status: 'Active' },
  { id: 'SP-003', doctor: 'Dr. Amit Patel', department: 'Gen. Medicine', type: 'Fixed', opdShare: '₹300', ipdShare: '₹500', surgeryShare: '—', referralShare: '₹100', status: 'Active' },
  { id: 'SP-004', doctor: 'Dr. Sunita Mishra', department: 'Gynecology', type: 'Percentage', opdShare: '28%', ipdShare: '22%', surgeryShare: '30%', referralShare: '12%', status: 'Under Review' },
  { id: 'SP-005', doctor: 'Dr. Vikram Singh', department: 'ENT', type: 'Mixed', opdShare: '₹250', ipdShare: '20%', surgeryShare: '30%', referralShare: '10%', status: 'Active' },
];

const serviceWiseSharing = [
  { service: 'OPD Consultation', doctor: 'Dr. Sharma', hospitalShare: 70, doctorShare: 30, amount: 45000 },
  { service: 'Echo Cardiogram', doctor: 'Dr. Sharma', hospitalShare: 60, doctorShare: 40, amount: 28000 },
  { service: 'TMT', doctor: 'Dr. Sharma', hospitalShare: 65, doctorShare: 35, amount: 18500 },
  { service: 'IPD Consultation', doctor: 'Dr. Kumar', hospitalShare: 70, doctorShare: 30, amount: 52000 },
  { service: 'Joint Replacement', doctor: 'Dr. Kumar', hospitalShare: 60, doctorShare: 40, amount: 180000 },
  { service: 'Arthroscopy', doctor: 'Dr. Kumar', hospitalShare: 55, doctorShare: 45, amount: 95000 },
];

const referralData = [
  { referrer: 'Dr. Mohan Rao', referred: 'Dr. Sharma', patient: 'Ramesh K.', service: 'Angiography', referralFee: 5000, date: '2026-03-05' },
  { referrer: 'Dr. Geeta Iyer', referred: 'Dr. Kumar', patient: 'Suresh P.', service: 'Knee Replacement', referralFee: 15000, date: '2026-03-04' },
  { referrer: 'Dr. Mohan Rao', referred: 'Dr. Patel', patient: 'Anita M.', service: 'OPD Consultation', referralFee: 100, date: '2026-03-06' },
  { referrer: 'Dr. Kamal Nath', referred: 'Dr. Mishra', patient: 'Lakshmi S.', service: 'C-Section', referralFee: 8000, date: '2026-03-03' },
];

const tdsData = [
  { doctor: 'Dr. Rajesh Sharma', grossSharing: 285000, tdsRate: '10%', tdsAmount: 28500, netPayable: 256500, quarter: 'Q4 FY2025-26' },
  { doctor: 'Dr. Priya Kumar', grossSharing: 342000, tdsRate: '10%', tdsAmount: 34200, netPayable: 307800, quarter: 'Q4 FY2025-26' },
  { doctor: 'Dr. Amit Patel', grossSharing: 156000, tdsRate: '10%', tdsAmount: 15600, netPayable: 140400, quarter: 'Q4 FY2025-26' },
  { doctor: 'Dr. Sunita Mishra', grossSharing: 198000, tdsRate: '10%', tdsAmount: 19800, netPayable: 178200, quarter: 'Q4 FY2025-26' },
  { doctor: 'Dr. Vikram Singh', grossSharing: 124000, tdsRate: '10%', tdsAmount: 12400, netPayable: 111600, quarter: 'Q4 FY2025-26' },
];

const monthlySharing = [
  { month: 'Oct', total: 320000, hospital: 210000, doctors: 110000 },
  { month: 'Nov', total: 345000, hospital: 225000, doctors: 120000 },
  { month: 'Dec', total: 380000, hospital: 248000, doctors: 132000 },
  { month: 'Jan', total: 360000, hospital: 234000, doctors: 126000 },
  { month: 'Feb', total: 395000, hospital: 257000, doctors: 138000 },
  { month: 'Mar', total: 410000, hospital: 266000, doctors: 144000 },
];

export default function AdminDoctorSharing() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Revenue Sharing</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage doctor-wise sharing policies, referral fees, and TDS compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-sm"><Mail className="w-4 h-4" />Email Statements</Button>
          <Button variant="outline" className="gap-2 text-sm"><Download className="w-4 h-4" />Export</Button>
          <Button className="gap-2 text-sm"><Plus className="w-4 h-4" />New Policy</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Doctor Payouts', value: '₹7,70,000', icon: IndianRupee, sub: 'This quarter' },
          { label: 'Active Policies', value: '28', icon: Users, sub: '4 under review' },
          { label: 'Avg Sharing %', value: '31.2%', icon: Percent, sub: 'Across all services' },
          { label: 'TDS Deducted', value: '₹1,10,500', icon: FileText, sub: 'Q4 FY2025-26' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
              </div>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies">Sharing Policies</TabsTrigger>
          <TabsTrigger value="service-wise">Service-Wise</TabsTrigger>
          <TabsTrigger value="referral">Referral Sharing</TabsTrigger>
          <TabsTrigger value="tds">TDS Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search doctors..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>OPD Share</TableHead>
                  <TableHead>IPD Share</TableHead>
                  <TableHead>Surgery Share</TableHead>
                  <TableHead>Referral Share</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharingPolicies.filter(p => p.doctor.toLowerCase().includes(search.toLowerCase())).map(p => (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.doctor}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{p.department}</TableCell>
                    <TableCell>
                      <Badge variant={p.type === 'Percentage' ? 'default' : p.type === 'Fixed' ? 'secondary' : 'outline'} className="text-xs">{p.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{p.opdShare}</TableCell>
                    <TableCell className="font-medium">{p.ipdShare}</TableCell>
                    <TableCell className="font-medium">{p.surgeryShare}</TableCell>
                    <TableCell className="font-medium">{p.referralShare}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'Active' ? 'default' : 'secondary'} className="text-xs">{p.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="service-wise" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Hospital %</TableHead>
                  <TableHead>Doctor %</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Doctor Payout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceWiseSharing.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{s.service}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{s.doctor}</TableCell>
                    <TableCell>{s.hospitalShare}%</TableCell>
                    <TableCell className="font-medium">{s.doctorShare}%</TableCell>
                    <TableCell className="text-right">₹{s.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">₹{Math.round(s.amount * s.doctorShare / 100).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="referral" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referring Doctor</TableHead>
                  <TableHead>Referred To</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Referral Fee</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralData.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.referrer}</TableCell>
                    <TableCell className="text-muted-foreground">{r.referred}</TableCell>
                    <TableCell>{r.patient}</TableCell>
                    <TableCell>{r.service}</TableCell>
                    <TableCell className="text-right font-medium">₹{r.referralFee.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="tds" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">TDS Report — Q4 FY2025-26</h3>
            <Button variant="outline" size="sm" className="gap-1 text-xs"><Download className="w-3 h-3" />Download TDS Certificate</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="text-right">Gross Sharing</TableHead>
                  <TableHead>TDS Rate</TableHead>
                  <TableHead className="text-right">TDS Amount</TableHead>
                  <TableHead className="text-right">Net Payable</TableHead>
                  <TableHead>Quarter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tdsData.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{t.doctor}</TableCell>
                    <TableCell className="text-right">₹{t.grossSharing.toLocaleString()}</TableCell>
                    <TableCell>{t.tdsRate}</TableCell>
                    <TableCell className="text-right text-destructive font-medium">₹{t.tdsAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold">₹{t.netPayable.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{t.quarter}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Revenue Split (Hospital vs Doctor)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySharing}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v/1000)}k`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="hospital" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} name="Hospital" />
                <Bar dataKey="doctors" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Doctors" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
