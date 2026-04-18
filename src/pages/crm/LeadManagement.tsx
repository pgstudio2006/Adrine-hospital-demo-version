import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarCheck2, MessageSquare, PhoneCall, Plus, TrendingUp, Users } from 'lucide-react';

const pipelineStats = [
  { label: 'Open leads', value: '124', icon: Users, detail: '+16 new this week' },
  { label: 'Hot prospects', value: '32', icon: TrendingUp, detail: 'Need action in 48 hours' },
  { label: 'Consults booked', value: '28', icon: CalendarCheck2, detail: '11 scheduled today' },
  { label: 'Pending callbacks', value: '14', icon: PhoneCall, detail: '3 overdue by SLA' },
];

const stageSummary = [
  { stage: 'New Inquiry', count: 42, percent: 100 },
  { stage: 'Counseling', count: 31, percent: 74 },
  { stage: 'Financial Plan', count: 18, percent: 43 },
  { stage: 'Decision Phase', count: 11, percent: 26 },
];

const leads = [
  { name: 'Aditya Varma', specialty: 'Cardiology', packageName: 'TAVI Procedure', owner: 'Sonia Patel', channel: 'Phone', value: 'Rs 4.5L', priority: 'High', status: 'Counseling today' },
  { name: 'Meera Nair', specialty: 'Maternity', packageName: 'Premium Suite Bundle', owner: 'Neha Shah', channel: 'WhatsApp', value: 'Rs 1.8L', priority: 'Medium', status: 'Tour pending' },
  { name: 'Rahul Khanna', specialty: 'Ophthalmology', packageName: 'Robot Lasik', owner: 'Aman Verma', channel: 'Call back', value: 'Rs 85K', priority: 'High', status: 'Insurance review' },
  { name: 'Surbhi Gupta', specialty: 'Bariatric', packageName: 'Gastric Balloon', owner: 'Riya Das', channel: 'Email', value: 'Rs 2.2L', priority: 'Medium', status: 'Treatment plan sent' },
  { name: 'Vikram Seth', specialty: 'Orthopedics', packageName: 'Knee Replacement', owner: 'Parth Mehta', channel: 'Phone', value: 'Rs 3.5L', priority: 'High', status: 'Consult booking' },
];

const priorityStyles: Record<string, string> = {
  High: 'bg-destructive/10 text-destructive border-destructive/20',
  Medium: 'bg-warning/10 text-warning border-warning/20',
  Low: 'bg-muted text-muted-foreground border-border',
};

export default function LeadManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Pipeline</h1>
          <p className="text-sm text-muted-foreground">Track prospects from inquiry to booked care package</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pipelineStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stage Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stageSummary.map((item) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.stage}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <Progress value={item.percent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Priority Leads</CardTitle>
            <Button variant="outline" size="sm">Export List</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.name}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.specialty}</TableCell>
                    <TableCell>{lead.packageName}</TableCell>
                    <TableCell>{lead.owner}</TableCell>
                    <TableCell>{lead.channel}</TableCell>
                    <TableCell>{lead.value}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityStyles[lead.priority]}>
                        {lead.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{lead.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>
            <PhoneCall className="mr-2 h-4 w-4" />
            Start Call Round
          </Button>
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Follow-up Message
          </Button>
          <Button variant="outline">
            <CalendarCheck2 className="mr-2 h-4 w-4" />
            Book Consultation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
