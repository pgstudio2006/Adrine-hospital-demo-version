import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ambulance, Clock, MapPin, Phone, User, Radio } from 'lucide-react';

const ambulances = [
  { id: 'AMB-108-GJ05', vehicle: 'GJ-05-AB-1234', type: '108 (BLS)', status: 'At Hospital', driver: 'Suresh Patel', paramedic: 'Ram Singh', phone: '+91 98765 43210', patient: 'Unknown Male (~45y)', complaint: 'Chest pain, diaphoresis', pickup: 'SG Highway, near Iscon', arrivalTime: '10:40 AM', eta: 'Arrived' },
  { id: 'AMB-102-GJ01', vehicle: 'GJ-01-CD-5678', type: '102 (ALS)', status: 'En Route', driver: 'Kamal Verma', paramedic: 'Dr. Nisha', phone: '+91 98765 11111', patient: 'RTA victim (~30M)', complaint: 'Multiple injuries, conscious', pickup: 'Ahmedabad-Gandhinagar Highway', arrivalTime: '—', eta: '4 min' },
  { id: 'AMB-108-GJ12', vehicle: 'GJ-12-EF-9012', type: '108 (BLS)', status: 'Available', driver: 'Jayesh Modi', paramedic: 'Rekha Sharma', phone: '+91 98765 22222', patient: null, complaint: null, pickup: null, arrivalTime: null, eta: null },
  { id: 'AMB-HOSP-01', vehicle: 'GJ-01-GH-3456', type: 'Hospital Ambulance', status: 'On Call', driver: 'Manoj Tiwari', paramedic: 'Amit Patel', phone: '+91 98765 33333', patient: 'Transfer patient', complaint: 'Inter-hospital transfer', pickup: 'Civil Hospital', arrivalTime: null, eta: '12 min' },
  { id: 'AMB-108-GJ05B', vehicle: 'GJ-05-IJ-7890', type: '108 (BLS)', status: 'Available', driver: 'Dinesh Solanki', paramedic: 'Geeta Nair', phone: '+91 98765 44444', patient: null, complaint: null, pickup: null, arrivalTime: null, eta: null },
];

const STATUS_STYLE: Record<string, string> = {
  'At Hospital': 'bg-success/10 text-success',
  'En Route': 'bg-warning/10 text-warning',
  'Available': 'bg-muted text-muted-foreground',
  'On Call': 'bg-info/10 text-info',
};

export default function EmergencyAmbulance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Ambulance Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">Track ambulance arrivals, dispatch, and paramedic details</p>
        </div>
        <Button className="gap-2"><Radio className="w-4 h-4" />Dispatch Ambulance</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Fleet', value: ambulances.length },
          { label: 'En Route', value: ambulances.filter(a => a.status === 'En Route').length },
          { label: 'At Hospital', value: ambulances.filter(a => a.status === 'At Hospital').length },
          { label: 'Available', value: ambulances.filter(a => a.status === 'Available').length },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active / En Route</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        {['all', 'active', 'available'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {ambulances
              .filter(a => tab === 'all' || (tab === 'active' && ['En Route', 'At Hospital', 'On Call'].includes(a.status)) || (tab === 'available' && a.status === 'Available'))
              .map((a) => (
                <Card key={a.id} className="p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        <Ambulance className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-foreground">{a.id}</span>
                          <Badge className={`text-[10px] ${STATUS_STYLE[a.status]}`}>{a.status}</Badge>
                          <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.vehicle}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.driver}</span>
                          <span>Paramedic: {a.paramedic}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{a.phone}</span>
                        </div>
                        {a.patient && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs space-y-0.5">
                            <p className="font-medium text-foreground">{a.patient}</p>
                            <p className="text-muted-foreground">{a.complaint}</p>
                            {a.pickup && <p className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{a.pickup}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {a.eta && (
                        <Badge variant={a.eta === 'Arrived' ? 'default' : 'secondary'} className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />{a.eta}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}