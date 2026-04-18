import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, BarChart3, PlayCircle, Users, Zap } from 'lucide-react';

const stats = [
  { label: 'Active participants', value: '1,284', icon: Users, detail: '+12% this month' },
  { label: 'Engagement rate', value: '84.2%', icon: Activity, detail: 'Across all journeys' },
  { label: 'Retention lift', value: '28%', icon: BarChart3, detail: 'Compared with baseline' },
];

const journeys = [
  { name: 'Post-NICU Support', segment: 'Maternity Patients', reach: 182, channel: 'WhatsApp + Call', engagement: 92, status: 'Active' },
  { name: 'Diabetes Wellness Hub', segment: 'Chronic Care', reach: 246, channel: 'SMS + App', engagement: 74, status: 'Active' },
  { name: 'Cardiac Rehab Follow-up', segment: 'Post-op Patients', reach: 138, channel: 'Call + Email', engagement: 88, status: 'Review' },
  { name: 'Preventive Screening Recall', segment: 'Wellness Members', reach: 204, channel: 'WhatsApp + SMS', engagement: 69, status: 'Active' },
];

const templates = [
  { name: 'Orthopedic rehab', detail: 'Discharge to physiotherapy completion', usage: '32 launches' },
  { name: 'Maternity concierge', detail: 'ANC to postpartum experience', usage: '24 launches' },
  { name: 'Executive health renewal', detail: 'Annual package reactivation', usage: '18 launches' },
];

const statusStyles: Record<string, string> = {
  Active: 'bg-success/10 text-success border-success/20',
  Review: 'bg-warning/10 text-warning border-warning/20',
};

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Care Journeys</h1>
          <p className="text-sm text-muted-foreground">Manage automated patient retention and follow-up programs</p>
        </div>
        <Button>
          <Zap className="mr-2 h-4 w-4" />
          Deploy Journey
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
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
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Journey Performance</CardTitle>
            <Button variant="outline" size="sm">View Reports</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Journey</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Reach</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journeys.map((journey) => (
                  <TableRow key={journey.name}>
                    <TableCell className="font-medium">{journey.name}</TableCell>
                    <TableCell>{journey.segment}</TableCell>
                    <TableCell>{journey.reach}</TableCell>
                    <TableCell>{journey.channel}</TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="space-y-2">
                        <div className="text-sm">{journey.engagement}%</div>
                        <Progress value={journey.engagement} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[journey.status]}>
                        {journey.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map((template) => (
              <div key={template.name} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{template.detail}</p>
                  </div>
                  <PlayCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{template.usage}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
