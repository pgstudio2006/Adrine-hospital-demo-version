import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, FileText, TrendingUp, Clock, Users } from 'lucide-react';

const volumeData = [
  { day: 'Mon', cases: 42, critical: 8, urgent: 14 },
  { day: 'Tue', cases: 38, critical: 5, urgent: 12 },
  { day: 'Wed', cases: 45, critical: 10, urgent: 15 },
  { day: 'Thu', cases: 50, critical: 12, urgent: 18 },
  { day: 'Fri', cases: 55, critical: 9, urgent: 20 },
  { day: 'Sat', cases: 60, critical: 14, urgent: 22 },
  { day: 'Sun', cases: 48, critical: 11, urgent: 16 },
];

const waitTimeData = [
  { hour: '6AM', avg: 5 }, { hour: '8AM', avg: 8 }, { hour: '10AM', avg: 12 },
  { hour: '12PM', avg: 15 }, { hour: '2PM', avg: 18 }, { hour: '4PM', avg: 14 },
  { hour: '6PM', avg: 20 }, { hour: '8PM', avg: 16 }, { hour: '10PM', avg: 10 },
];

const triageDistribution = [
  { name: 'Critical', value: 15, color: 'hsl(var(--destructive))' },
  { name: 'Urgent', value: 30, color: 'hsl(var(--warning))' },
  { name: 'Semi-Urgent', value: 35, color: 'hsl(var(--info))' },
  { name: 'Non-Urgent', value: 20, color: 'hsl(var(--success))' },
];

const dispositionData = [
  { name: 'Discharged', value: 55, color: 'hsl(var(--success))' },
  { name: 'Admitted (IPD)', value: 25, color: 'hsl(var(--info))' },
  { name: 'ICU Transfer', value: 10, color: 'hsl(var(--warning))' },
  { name: 'Referred', value: 7, color: 'hsl(var(--muted-foreground))' },
  { name: 'LAMA/Deceased', value: 3, color: 'hsl(var(--destructive))' },
];

const reportTypes = [
  { title: 'Daily ER Volume Report', desc: 'Patient count by triage category', icon: Users },
  { title: 'Average Wait Time Report', desc: 'Triage-to-treatment duration analysis', icon: Clock },
  { title: 'Critical Case Audit', desc: 'All critical/emergency cases with outcomes', icon: FileText },
  { title: 'MLC Summary Report', desc: 'Medico-legal case documentation', icon: FileText },
  { title: 'Disposition Analysis', desc: 'Patient outcomes and discharge patterns', icon: TrendingUp },
  { title: 'Ambulance Response Report', desc: 'Response times and arrival patterns', icon: FileText },
];

export default function EmergencyReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">ER Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Emergency department performance metrics and documentation</p>
        </div>
        <Button variant="outline" className="gap-2 text-sm"><Download className="w-4 h-4" />Export</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cases This Week', value: '338', change: '+12% vs last week' },
          { label: 'Avg Wait Time', value: '12 min', change: '↓ 3 min improvement' },
          { label: 'Critical Resolution', value: '94%', change: 'Within golden hour' },
          { label: 'MLC Cases', value: '8', change: 'This month' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.change}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Report Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-4 space-y-6">
          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Case Volume</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="cases" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="critical" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Avg Wait Time (Today)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} unit=" min" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Triage Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={triageDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {triageDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Patient Disposition</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dispositionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {dispositionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((r) => (
              <Card key={r.title} className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <r.icon className="w-5 h-5 text-muted-foreground mb-3" />
                <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                <Button variant="outline" size="sm" className="text-xs mt-3 gap-1"><Download className="w-3 h-3" />Generate</Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}