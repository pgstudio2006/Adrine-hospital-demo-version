import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Building2, Bell, Shield, Database, Globe } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettings() {
  const [tab, setTab] = useState<'hospital' | 'notifications' | 'security' | 'backup' | 'integrations'>('hospital');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground">Hospital configuration & system preferences</p>
      </div>

      <div className="flex gap-1 border-b pb-1 overflow-x-auto">
        {([
          { key: 'hospital', label: 'Hospital Info', icon: Building2 },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'security', label: 'Security', icon: Shield },
          { key: 'backup', label: 'Backup & Data', icon: Database },
          { key: 'integrations', label: 'Integrations', icon: Globe },
        ] as const).map(t => (
          <Button key={t.key} size="sm" variant={tab === t.key ? 'default' : 'ghost'} onClick={() => setTab(t.key)}>
            <t.icon className="h-4 w-4 mr-1" /> {t.label}
          </Button>
        ))}
      </div>

      {tab === 'hospital' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Hospital Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Hospital Name</Label><Input defaultValue="Adrine Multi-Specialty Hospital" /></div>
              <div><Label>Registration Number</Label><Input defaultValue="REG-GJ-2024-001" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Phone</Label><Input defaultValue="+91 79 2654 7890" /></div>
              <div><Label>Email</Label><Input defaultValue="admin@adrine.hospital" /></div>
            </div>
            <div><Label>Address</Label><Textarea defaultValue="123 Healthcare Avenue, Satellite, Ahmedabad, Gujarat 380015" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Time Zone</Label>
                <Select defaultValue="IST"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="IST">IST (UTC+5:30)</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Operating Hours</Label><Input defaultValue="24/7" /></div>
              <div><Label>Emergency Contact</Label><Input defaultValue="+91 79 2654 7899" /></div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Notification Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'SMS Notifications', desc: 'Send SMS for appointments and critical alerts', enabled: true },
              { label: 'Email Notifications', desc: 'Send email for reports and billing', enabled: true },
              { label: 'Critical Finding Alerts', desc: 'Immediate notification for critical lab/radiology findings', enabled: true },
              { label: 'Appointment Reminders', desc: 'Automatic reminders 24 hours before appointments', enabled: true },
              { label: 'Billing Reminders', desc: 'Payment due reminders for outstanding bills', enabled: false },
              { label: 'Staff Shift Notifications', desc: 'Notify staff about upcoming shifts', enabled: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between border-b last:border-0 pb-3">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked={n.enabled} />
              </div>
            ))}
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'security' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Security Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Enforce Strong Passwords', desc: 'Minimum 8 chars, uppercase, number, special char', enabled: true },
              { label: 'Multi-Factor Authentication', desc: 'Require MFA for all admin accounts', enabled: false },
              { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
              { label: 'IP Whitelisting', desc: 'Restrict admin access to specific IP addresses', enabled: false },
              { label: 'Login Attempt Lockout', desc: 'Lock account after 5 failed login attempts', enabled: true },
              { label: 'Audit All Data Exports', desc: 'Log and alert when patient data is exported', enabled: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between border-b last:border-0 pb-3">
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <Switch defaultChecked={s.enabled} />
              </div>
            ))}
            <Button>Save Security Settings</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'backup' && (
        <Card>
          <CardHeader><CardTitle className="text-base">Backup & Data Management</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Backup Frequency</Label>
                <Select defaultValue="daily"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Retention Period</Label>
                <Select defaultValue="90"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Recent Backups</p>
              {[
                { date: '2025-03-08 02:00', size: '2.4 GB', status: 'success' },
                { date: '2025-03-07 02:00', size: '2.3 GB', status: 'success' },
                { date: '2025-03-06 02:00', size: '2.3 GB', status: 'success' },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{b.date}</span>
                  <span>{b.size}</span>
                  <Badge variant="default">{b.status}</Badge>
                  <Button size="sm" variant="ghost">Restore</Button>
                </div>
              ))}
            </div>
            <Button variant="outline">Run Manual Backup</Button>
          </CardContent>
        </Card>
      )}

      {tab === 'integrations' && (
        <Card>
          <CardHeader><CardTitle className="text-base">External Integrations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'PACS (Radiology)', desc: 'Picture Archiving and Communication System', status: 'connected', url: 'pacs.hospital.local:8080' },
              { name: 'Laboratory LIS', desc: 'Laboratory Information System', status: 'connected', url: 'lis.hospital.local:3000' },
              { name: 'Accounting Software', desc: 'Tally / QuickBooks integration', status: 'disconnected', url: '' },
              { name: 'SMS Gateway', desc: 'Transactional SMS provider', status: 'connected', url: 'api.sms-provider.com' },
              { name: 'Email Service', desc: 'SMTP email configuration', status: 'connected', url: 'smtp.hospital.com' },
              { name: 'ABHA (Ayushman Bharat)', desc: 'Health ID integration', status: 'disconnected', url: '' },
            ].map((int, i) => (
              <div key={i} className="flex items-center justify-between border-b last:border-0 pb-3">
                <div>
                  <p className="text-sm font-medium">{int.name}</p>
                  <p className="text-xs text-muted-foreground">{int.desc}</p>
                  {int.url && <p className="text-xs font-mono text-muted-foreground">{int.url}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={int.status === 'connected' ? 'default' : 'secondary'}>{int.status}</Badge>
                  <Button size="sm" variant="outline">{int.status === 'connected' ? 'Configure' : 'Connect'}</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
