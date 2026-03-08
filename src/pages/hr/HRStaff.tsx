import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const staffMembers = [
  { id: 'STF-001', name: 'Dr. Rajesh Kumar', role: 'Doctor', department: 'Cardiology', designation: 'Senior Consultant', status: 'Active', joining: '2019-03-15', email: 'rajesh.k@hospital.com', phone: '+91 98765 43210' },
  { id: 'STF-002', name: 'Dr. Ananya Mishra', role: 'Doctor', department: 'Cardiology', designation: 'Consultant', status: 'Active', joining: '2024-01-10', email: 'ananya.m@hospital.com', phone: '+91 98765 43211' },
  { id: 'STF-003', name: 'Nurse Priya Shah', role: 'Nurse', department: 'ICU', designation: 'Head Nurse', status: 'Active', joining: '2018-06-01', email: 'priya.s@hospital.com', phone: '+91 98765 43212' },
  { id: 'STF-004', name: 'Amit Patel', role: 'Lab Technician', department: 'Pathology', designation: 'Senior Technician', status: 'Active', joining: '2020-09-20', email: 'amit.p@hospital.com', phone: '+91 98765 43213' },
  { id: 'STF-005', name: 'Rekha Desai', role: 'Nurse', department: 'Emergency', designation: 'Staff Nurse', status: 'On Leave', joining: '2021-04-12', email: 'rekha.d@hospital.com', phone: '+91 98765 43214' },
  { id: 'STF-006', name: 'Dr. Vikram Singh', role: 'Doctor', department: 'Orthopedics', designation: 'HOD', status: 'Active', joining: '2015-01-05', email: 'vikram.s@hospital.com', phone: '+91 98765 43215' },
  { id: 'STF-007', name: 'Sunita Verma', role: 'Receptionist', department: 'Front Desk', designation: 'Senior Executive', status: 'Active', joining: '2022-07-18', email: 'sunita.v@hospital.com', phone: '+91 98765 43216' },
  { id: 'STF-008', name: 'Mohammed Irfan', role: 'Pharmacist', department: 'Pharmacy', designation: 'Chief Pharmacist', status: 'Active', joining: '2017-11-25', email: 'irfan.m@hospital.com', phone: '+91 98765 43217' },
];

const STATUS_STYLE: Record<string, string> = {
  Active: 'bg-success/10 text-success',
  'On Leave': 'bg-warning/10 text-warning',
  Inactive: 'bg-muted text-muted-foreground',
};

export default function HRStaff() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const departments = [...new Set(staffMembers.map(s => s.department))];
  const roles = [...new Set(staffMembers.map(s => s.role))];

  const filtered = staffMembers.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.id.includes(search)) return false;
    if (deptFilter !== 'all' && s.department !== deptFilter) return false;
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage hospital staff records and assignments</p>
        </div>
        <Button className="gap-2"><UserPlus className="w-4 h-4" />Add Staff Member</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or ID..." className="pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Staff Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-bold text-foreground">
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <Badge className={`text-[10px] ${STATUS_STYLE[s.status] || ''}`}>{s.status}</Badge>
              </div>
              <h3 className="font-medium text-sm text-foreground">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.designation}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[10px]">{s.role}</Badge>
                <Badge variant="secondary" className="text-[10px]">{s.department}</Badge>
              </div>
              <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</p>
                <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">ID: {s.id} · Joined: {s.joining}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}