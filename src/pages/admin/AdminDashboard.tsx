import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Building2, Activity, Shield, AlertTriangle, TrendingUp, Globe, MapPin } from 'lucide-react';
import { useState } from 'react';

const STATS = [
  { label: 'Total Users', value: '247', change: '+12', icon: Users, color: 'text-primary' },
  { label: 'Active Now', value: '84', change: '+5', icon: Activity, color: 'text-emerald-500' },
  { label: 'Departments', value: '14', change: '0', icon: Building2, color: 'text-blue-500' },
  { label: 'Security Alerts', value: '3', change: '-2', icon: Shield, color: 'text-destructive' },
];

const SYSTEM_HEALTH = [
  { service: 'Database', status: 'healthy', uptime: '99.97%' },
  { service: 'Authentication', status: 'healthy', uptime: '100%' },
  { service: 'File Storage', status: 'healthy', uptime: '99.95%' },
  { service: 'API Gateway', status: 'warning', uptime: '99.80%' },
  { service: 'Backup Service', status: 'healthy', uptime: '100%' },
];

const RECENT_ACTIVITY = [
  { user: 'Dr. Mehta', action: 'Login', module: 'Doctor', time: '2 min ago' },
  { user: 'Nurse Priya', action: 'Patient vitals updated', module: 'Nurse', time: '5 min ago' },
  { user: 'Reception', action: 'New registration', module: 'Reception', time: '8 min ago' },
  { user: 'Lab Tech', action: 'Report validated', module: 'Lab', time: '12 min ago' },
  { user: 'Billing', action: 'Invoice generated', module: 'Billing', time: '15 min ago' },
];

const GEO_ZONES = [
  { zone: '0–3 km (Core)', patients: 1245, growth: '+22%', revenue: '₹48,50,000', density: 'High' },
  { zone: '3–7 km (Primary)', patients: 876, growth: '+15%', revenue: '₹32,10,000', density: 'High' },
  { zone: '7–15 km (Extended)', patients: 432, growth: '+8%', revenue: '₹15,80,000', density: 'Medium' },
  { zone: '15+ km (Remote)', patients: 189, growth: '+31%', revenue: '₹8,20,000', density: 'Growing' },
];

const TOP_AREAS = [
  { area: 'Satellite', patients: 342, growth: '+18%', topService: 'OPD Consultation', revenue: '₹2,90,700', penetration: '0.22%' },
  { area: 'Vastrapur', patients: 287, growth: '+12%', topService: 'Cardiology', revenue: '₹3,45,000', penetration: '0.19%' },
  { area: 'Navrangpura', patients: 264, growth: '+25%', topService: 'Diagnostics', revenue: '₹2,10,500', penetration: '0.31%' },
  { area: 'Thaltej', patients: 198, growth: '+9%', topService: 'Orthopedics', revenue: '₹2,78,000', penetration: '0.14%' },
  { area: 'Bopal', patients: 156, growth: '+45%', topService: 'Pediatrics', revenue: '₹1,42,000', penetration: '0.08%' },
  { area: 'Maninagar', patients: 134, growth: '+6%', topService: 'General Surgery', revenue: '₹1,85,000', penetration: '0.11%' },
];

const MARKETING_SOURCES = [
  { source: 'Google Ads', patients: 120, cost: '₹85,000', cpa: '₹708' },
  { source: 'Local Clinic Referrals', patients: 85, cost: '₹0', cpa: '₹0' },
  { source: 'Health Camp – Satellite', patients: 60, cost: '₹25,000', cpa: '₹417' },
  { source: 'Social Media', patients: 45, cost: '₹32,000', cpa: '₹711' },
];

export default function AdminDashboard() {
  const [geoTab, setGeoTab] = useState<'zones' | 'areas' | 'marketing'>('zones');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">System overview & operational monitoring</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              {s.change !== '0' && (
                <Badge variant={s.change.startsWith('+') ? 'default' : 'destructive'} className="ml-auto text-xs">
                  {s.change}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader><CardTitle className="text-base">System Health</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {SYSTEM_HEALTH.map(s => (
              <div key={s.service} className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.service}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{s.uptime}</span>
                  <Badge variant={s.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                    {s.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{a.user}</span>
                  <span className="text-muted-foreground ml-1">— {a.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{a.module}</Badge>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* GeoHealth Intelligence */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Adrine GeoHealth Intelligence</CardTitle>
            </div>
            <div className="flex gap-1">
              {(['zones', 'areas', 'marketing'] as const).map(tab => (
                <Button key={tab} size="sm" variant={geoTab === tab ? 'default' : 'ghost'} onClick={() => setGeoTab(tab)}>
                  {tab === 'zones' ? 'Catchment Zones' : tab === 'areas' ? 'Area Analytics' : 'Marketing'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {geoTab === 'zones' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {GEO_ZONES.map(z => (
                  <div key={z.zone} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      <p className="text-xs font-medium">{z.zone}</p>
                    </div>
                    <p className="text-xl font-bold">{z.patients.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span>{z.growth}</span>
                      <span>•</span>
                      <span>{z.revenue}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{z.density}</Badge>
                  </div>
                ))}
              </div>
              {/* Heatmap placeholder */}
              <div className="border rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/30">
                <Globe className="h-12 w-12 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Geographic Heatmap</p>
                <p className="text-xs text-muted-foreground">Patient density visualization will render here</p>
              </div>
            </div>
          )}

          {geoTab === 'areas' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Area</th>
                    <th className="pb-2 font-medium">Patients</th>
                    <th className="pb-2 font-medium">Growth</th>
                    <th className="pb-2 font-medium">Top Service</th>
                    <th className="pb-2 font-medium">Revenue</th>
                    <th className="pb-2 font-medium">Penetration</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_AREAS.map(a => (
                    <tr key={a.area} className="border-b last:border-0">
                      <td className="py-2 font-medium">{a.area}</td>
                      <td className="py-2">{a.patients}</td>
                      <td className="py-2">
                        <Badge variant="outline" className="text-xs">{a.growth}</Badge>
                      </td>
                      <td className="py-2 text-muted-foreground">{a.topService}</td>
                      <td className="py-2">{a.revenue}</td>
                      <td className="py-2 text-muted-foreground">{a.penetration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {geoTab === 'marketing' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Source</th>
                      <th className="pb-2 font-medium">Patients Acquired</th>
                      <th className="pb-2 font-medium">Spend</th>
                      <th className="pb-2 font-medium">Cost per Acquisition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MARKETING_SOURCES.map(m => (
                      <tr key={m.source} className="border-b last:border-0">
                        <td className="py-2 font-medium">{m.source}</td>
                        <td className="py-2">{m.patients}</td>
                        <td className="py-2">{m.cost}</td>
                        <td className="py-2">{m.cpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
