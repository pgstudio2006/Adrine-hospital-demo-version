import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, Search, X, Video, RotateCcw, Trash2, Edit2, AlertTriangle, CalendarOff, Lock } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 14 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);
const DEPARTMENTS = ['General Medicine', 'Cardiology', 'Orthopedics', 'Gynecology', 'Pediatrics', 'Dermatology', 'ENT', 'Neurology'];
const DOCTORS: Record<string, string[]> = {
  'General Medicine': ['Dr. A. Shah', 'Dr. V. Reddy'],
  'Cardiology': ['Dr. R. Mehta'],
  'Orthopedics': ['Dr. K. Rao'],
  'Gynecology': ['Dr. S. Iyer'],
  'Pediatrics': ['Dr. P. Nair'],
  'Dermatology': ['Dr. D. Kapoor'],
  'ENT': ['Dr. L. Mohan'],
  'Neurology': ['Dr. N. Joshi'],
};

// Doctor leave calendar
const doctorLeaves: Record<string, number[]> = {
  'Dr. R. Mehta': [2, 5], // Day indices with leave
  'Dr. K. Rao': [4],
};

// Locked/booked slots (for double-booking prevention)
const bookedSlots: { doctor: string; date: string; time: string }[] = [
  { doctor: 'Dr. R. Mehta', date: '2026-03-08', time: '09:00' },
  { doctor: 'Dr. R. Mehta', date: '2026-03-08', time: '09:30' },
  { doctor: 'Dr. A. Shah', date: '2026-03-08', time: '10:00' },
];

type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';

interface Appointment {
  id: number;
  appointmentId: string;
  uhid: string;
  patient: string;
  phone: string;
  doctor: string;
  dept: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  type: 'new' | 'follow-up' | 'teleconsultation';
  consultationType: 'in-person' | 'video';
  referralSource: string;
  notes: string;
  day: number;
  bookedAt: string;
  cancelReason?: string;
  cancelledBy?: string;
}

const appointments: Appointment[] = [
  { id: 1, appointmentId: 'APT-10001', uhid: 'UHID-240001', patient: 'Rajesh Sharma', phone: '9876543210', doctor: 'Dr. R. Mehta', dept: 'Cardiology', time: '09:00', duration: 30, status: 'confirmed', type: 'follow-up', consultationType: 'in-person', referralSource: 'Self', notes: 'Follow-up ECG review', day: 0, bookedAt: '7 Mar, 4:30 PM' },
  { id: 2, appointmentId: 'APT-10002', uhid: 'UHID-240002', patient: 'Priya Patel', phone: '9876543211', doctor: 'Dr. S. Iyer', dept: 'Gynecology', time: '09:30', duration: 30, status: 'confirmed', type: 'new', consultationType: 'in-person', referralSource: 'Dr. Referral', notes: '', day: 0, bookedAt: '6 Mar, 10:00 AM' },
  { id: 3, appointmentId: 'APT-10003', uhid: 'UHID-240003', patient: 'Amit Kumar', phone: '9876543212', doctor: 'Dr. A. Shah', dept: 'General Medicine', time: '10:00', duration: 45, status: 'scheduled', type: 'new', consultationType: 'in-person', referralSource: 'Walk-in', notes: 'Chest pain evaluation', day: 0, bookedAt: '8 Mar, 8:00 AM' },
  { id: 4, appointmentId: 'APT-10004', uhid: 'UHID-240006', patient: 'Neha Gupta', phone: '9876543215', doctor: 'Dr. D. Kapoor', dept: 'Dermatology', time: '10:30', duration: 30, status: 'confirmed', type: 'follow-up', consultationType: 'in-person', referralSource: 'Self', notes: '', day: 1, bookedAt: '5 Mar, 2:00 PM' },
  { id: 5, appointmentId: 'APT-10005', uhid: 'UHID-240005', patient: 'Vikram Singh', phone: '9876543214', doctor: 'Dr. R. Mehta', dept: 'Cardiology', time: '11:00', duration: 30, status: 'cancelled', type: 'new', consultationType: 'in-person', referralSource: 'Hospital Referral', notes: '', day: 0, bookedAt: '4 Mar, 11:00 AM', cancelReason: 'Patient requested', cancelledBy: 'Patient' },
  { id: 6, appointmentId: 'APT-10006', uhid: 'UHID-240004', patient: 'Sunita Devi', phone: '9876543213', doctor: 'Dr. K. Rao', dept: 'Orthopedics', time: '11:30', duration: 30, status: 'confirmed', type: 'new', consultationType: 'in-person', referralSource: 'Self', notes: 'Knee pain', day: 2, bookedAt: '7 Mar, 9:30 AM' },
  { id: 7, appointmentId: 'APT-10007', uhid: 'UHID-240007', patient: 'Arjun Reddy', phone: '9876543216', doctor: 'Dr. S. Iyer', dept: 'Gynecology', time: '14:00', duration: 30, status: 'no-show', type: 'follow-up', consultationType: 'in-person', referralSource: 'Self', notes: '', day: 0, bookedAt: '6 Mar, 3:00 PM' },
  { id: 8, appointmentId: 'APT-10008', uhid: 'UHID-240008', patient: 'Fatima Khan', phone: '9876543217', doctor: 'Dr. P. Nair', dept: 'Pediatrics', time: '14:30', duration: 45, status: 'scheduled', type: 'teleconsultation', consultationType: 'video', referralSource: 'Online', notes: 'Child fever', day: 3, bookedAt: '8 Mar, 7:00 AM' },
  { id: 9, appointmentId: 'APT-10009', uhid: 'UHID-240003', patient: 'Amit Kumar', phone: '9876543212', doctor: 'Dr. R. Mehta', dept: 'Cardiology', time: '15:00', duration: 30, status: 'rescheduled', type: 'follow-up', consultationType: 'in-person', referralSource: 'Self', notes: 'Rescheduled from 7 Mar', day: 0, bookedAt: '7 Mar, 5:00 PM' },
  { id: 10, appointmentId: 'APT-10010', uhid: 'UHID-240001', patient: 'Rajesh Sharma', phone: '9876543210', doctor: 'Dr. A. Shah', dept: 'General Medicine', time: '16:00', duration: 30, status: 'checked-in', type: 'new', consultationType: 'in-person', referralSource: 'Self', notes: '', day: 0, bookedAt: '8 Mar, 9:00 AM' },
];

const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: 'bg-info/10 text-info' },
  confirmed: { label: 'Confirmed', color: 'bg-success/10 text-success' },
  'checked-in': { label: 'Checked In', color: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', color: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive' },
  'no-show': { label: 'No Show', color: 'bg-warning/10 text-warning' },
  rescheduled: { label: 'Rescheduled', color: 'bg-accent text-accent-foreground' },
};

const CANCEL_REASONS = ['Patient requested', 'Doctor unavailable', 'Emergency rescheduling', 'Insurance issue', 'No show - auto cancel', 'Duplicate booking', 'Other'];

export default function ReceptionAppointments() {
  const [view, setView] = useState<'day' | 'week' | 'list'>('day');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showDoctorLeave, setShowDoctorLeave] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    uhid: '', patientName: '', phone: '', department: '', doctor: '',
    date: '2026-03-08', time: '09:00', duration: '30',
    type: 'new' as 'new' | 'follow-up' | 'teleconsultation',
    consultationType: 'in-person' as 'in-person' | 'video',
    referralSource: 'walk-in', notes: '',
  });

  // Double-booking check
  const isSlotBooked = (doctor: string, date: string, time: string) => {
    return bookedSlots.some(s => s.doctor === doctor && s.date === date && s.time === time);
  };

  const slotConflict = bookingForm.doctor && bookingForm.date && bookingForm.time
    ? isSlotBooked(bookingForm.doctor, bookingForm.date, bookingForm.time)
    : false;

  // Doctor on leave check
  const isDoctorOnLeave = (doctor: string, dayIdx: number) => {
    return doctorLeaves[doctor]?.includes(dayIdx) ?? false;
  };

  const todayAppointments = appointments.filter(a => a.day === 0);
  const stats = [
    { label: 'Total Today', value: todayAppointments.length },
    { label: 'Confirmed', value: todayAppointments.filter(a => a.status === 'confirmed' || a.status === 'checked-in').length },
    { label: 'Scheduled', value: todayAppointments.filter(a => a.status === 'scheduled').length },
    { label: 'Cancelled / No-show', value: todayAppointments.filter(a => a.status === 'cancelled' || a.status === 'no-show').length },
  ];

  const filteredAppts = (view === 'week' ? appointments : todayAppointments).filter(a => {
    const matchSearch = !search || a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase()) || a.appointmentId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage scheduling, conflicts, and cancellations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDoctorLeave(!showDoctorLeave)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors">
            <CalendarOff className="w-4 h-4" /> Doctor Leaves
          </button>
          <button onClick={() => setShowBooking(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Doctor Leave Calendar */}
      <AnimatePresence>
        {showDoctorLeave && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CalendarOff className="w-4 h-4" /> Doctor Leave Calendar (This Week)</h3>
            <div className="space-y-2">
              {Object.entries(doctorLeaves).map(([doctor, days]) => (
                <div key={doctor} className="flex items-center gap-3 text-sm">
                  <span className="w-32 font-medium">{doctor}</span>
                  <div className="flex gap-1">
                    {DAYS.map((day, i) => (
                      <span key={i} className={`w-10 h-8 flex items-center justify-center rounded text-xs ${days.includes(i) ? 'bg-destructive/10 text-destructive font-semibold' : 'bg-muted text-muted-foreground'}`}>
                        {day}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{days.length} day(s) leave</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card text-sm" placeholder="Search by patient, doctor, or ID..." />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-lg border overflow-hidden">
            {(['day', 'week', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === v ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border rounded-lg px-2">
            <button className="p-1 hover:bg-accent rounded"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-medium px-2">8 Mar 2026</span>
            <button className="p-1 hover:bg-accent rounded"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-1.5 overflow-x-auto">
        {['all', ...Object.keys(statusConfig)].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {s === 'all' ? 'All' : statusConfig[s as AppointmentStatus].label}
          </button>
        ))}
      </div>

      {/* Day View */}
      {view === 'day' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="divide-y">
            {HOURS.map(hour => {
              const slotAppts = filteredAppts.filter(a => a.time.startsWith(hour.split(':')[0]));
              return (
                <div key={hour} className="flex min-h-[56px]">
                  <div className="w-20 shrink-0 px-3 py-2 text-xs text-muted-foreground font-mono border-r bg-muted/20">{hour}</div>
                  <div className="flex-1 p-1.5 flex gap-2 flex-wrap">
                    {slotAppts.map(a => (
                      <div key={a.id} onClick={() => setSelectedAppt(a)}
                        className={`px-3 py-2 rounded-lg text-sm flex-1 min-w-[220px] max-w-[320px] border cursor-pointer hover:shadow-sm transition-all ${
                          a.status === 'confirmed' || a.status === 'checked-in' ? 'bg-success/5 border-success/20' :
                          a.status === 'scheduled' ? 'bg-info/5 border-info/20' :
                          a.status === 'cancelled' || a.status === 'no-show' ? 'bg-muted/50 border-muted opacity-60' :
                          'bg-card border-border'
                        }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium flex items-center gap-1">
                            {a.consultationType === 'video' && <Video className="w-3 h-3 text-info" />}
                            {a.patient}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusConfig[a.status].color}`}>{statusConfig[a.status].label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.doctor} · {a.dept} · {a.duration}min</p>
                        {a.cancelReason && <p className="text-xs text-destructive mt-0.5">Reason: {a.cancelReason}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="grid grid-cols-7 border-b">
            {DAYS.map((day, i) => {
              const hasLeave = Object.entries(doctorLeaves).some(([, days]) => days.includes(i));
              return (
                <div key={day} className={`px-3 py-2 text-center text-xs font-semibold border-r last:border-r-0 ${i === 0 ? 'bg-primary/5' : ''}`}>
                  <div className="text-muted-foreground flex items-center justify-center gap-1">
                    {day}
                    {hasLeave && <CalendarOff className="w-3 h-3 text-destructive" />}
                  </div>
                  <div className={`text-lg font-bold mt-0.5 ${i === 0 ? 'text-primary' : ''}`}>{8 + i}</div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 min-h-[400px]">
            {DAYS.map((_, dayIdx) => {
              const dayAppts = filteredAppts.filter(a => a.day === dayIdx);
              return (
                <div key={dayIdx} className={`border-r last:border-r-0 p-2 space-y-1 ${dayIdx === 0 ? 'bg-primary/5' : ''}`}>
                  {dayAppts.map(a => (
                    <div key={a.id} onClick={() => setSelectedAppt(a)}
                      className={`px-2 py-1.5 rounded text-xs border cursor-pointer hover:shadow-sm ${
                        a.status === 'confirmed' || a.status === 'checked-in' ? 'bg-success/5 border-success/20' :
                        a.status === 'cancelled' || a.status === 'no-show' ? 'bg-muted/50 border-muted opacity-60' :
                        'bg-card border-border'
                      }`}>
                      <p className="font-medium truncate">{a.patient}</p>
                      <p className="text-muted-foreground">{a.time} · {a.doctor.split(' ')[1]}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Type</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Cancel Reason</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAppts.map(a => (
                <tr key={a.id} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedAppt(a)}>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.appointmentId}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{a.patient}</p>
                    <p className="text-xs text-muted-foreground">{a.uhid}</p>
                  </td>
                  <td className="px-4 py-3 text-sm hidden sm:table-cell">{a.doctor}</td>
                  <td className="px-4 py-3 text-sm font-mono hidden md:table-cell">{a.time}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs flex items-center gap-1">
                      {a.consultationType === 'video' && <Video className="w-3 h-3" />}
                      {a.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[a.status].color}`}>{statusConfig[a.status].label}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{a.cancelReason || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {a.status !== 'cancelled' && a.status !== 'completed' && (
                        <>
                          <button onClick={e => { e.stopPropagation(); setShowCancelModal(a); }} className="p-1 rounded hover:bg-accent" title="Cancel"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1 rounded hover:bg-accent" title="Reschedule"><RotateCcw className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowBooking(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Book New Appointment</h2>
                <button onClick={() => setShowBooking(false)} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
              </div>

              {/* Conflict Warning */}
              {slotConflict && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-center gap-2 text-sm text-destructive">
                  <Lock className="w-4 h-4" />
                  <span><strong>Slot conflict!</strong> {bookingForm.doctor} already has a booking at {bookingForm.time} on {bookingForm.date}. Please choose a different time.</span>
                </div>
              )}

              {/* Doctor Leave Warning */}
              {bookingForm.doctor && isDoctorOnLeave(bookingForm.doctor, new Date(bookingForm.date).getDay()) && (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 flex items-center gap-2 text-sm text-warning">
                  <CalendarOff className="w-4 h-4" />
                  <span><strong>{bookingForm.doctor}</strong> is on leave on this day.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">UHID</label>
                  <input value={bookingForm.uhid} onChange={e => setBookingForm(f => ({ ...f, uhid: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Search UHID..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Patient Name *</label>
                  <input value={bookingForm.patientName} onChange={e => setBookingForm(f => ({ ...f, patientName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone *</label>
                  <input value={bookingForm.phone} onChange={e => setBookingForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="+91" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Department *</label>
                  <select value={bookingForm.department} onChange={e => setBookingForm(f => ({ ...f, department: e.target.value, doctor: '' }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="">Select</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Doctor *</label>
                  <select value={bookingForm.doctor} onChange={e => setBookingForm(f => ({ ...f, doctor: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" disabled={!bookingForm.department}>
                    <option value="">Select</option>
                    {(DOCTORS[bookingForm.department] || []).map(d => (
                      <option key={d} value={d}>{d} {isDoctorOnLeave(d, new Date(bookingForm.date).getDay()) ? '(On Leave)' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <div className="flex gap-2">
                    {(['new', 'follow-up', 'teleconsultation'] as const).map(t => (
                      <button key={t} onClick={() => setBookingForm(f => ({ ...f, type: t, consultationType: t === 'teleconsultation' ? 'video' : 'in-person' }))}
                        className={`flex-1 px-2 py-2 rounded-lg border text-xs font-medium transition-colors ${bookingForm.type === t ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}>
                        {t === 'teleconsultation' ? 'Tele' : t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date *</label>
                  <input type="date" value={bookingForm.date} onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Time * {slotConflict && <span className="text-destructive">(Conflict!)</span>}</label>
                  <select value={bookingForm.time} onChange={e => setBookingForm(f => ({ ...f, time: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm ${slotConflict ? 'border-destructive' : ''}`}>
                    {HOURS.flatMap(h => [`${h.slice(0,2)}:00`, `${h.slice(0,2)}:15`, `${h.slice(0,2)}:30`, `${h.slice(0,2)}:45`]).map(t => (
                      <option key={t} value={t}>{t} {bookingForm.doctor && isSlotBooked(bookingForm.doctor, bookingForm.date, t) ? '🔒 Booked' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duration</label>
                  <select value={bookingForm.duration} onChange={e => setBookingForm(f => ({ ...f, duration: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Referral Source</label>
                  <select value={bookingForm.referralSource} onChange={e => setBookingForm(f => ({ ...f, referralSource: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                    <option value="walk-in">Walk-in</option><option value="phone">Phone</option><option value="online">Online</option>
                    <option value="doctor-referral">Doctor Referral</option><option value="hospital-referral">Hospital Referral</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Notes</label>
                  <textarea value={bookingForm.notes} onChange={e => setBookingForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm" rows={2} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowBooking(false)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent">Cancel</button>
                <button onClick={() => setShowBooking(false)} disabled={slotConflict}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                  Book Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Reason Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCancelModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border rounded-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Cancel Appointment</h2>
              <div className="text-sm">
                <p><span className="text-muted-foreground">Patient:</span> {showCancelModal.patient}</p>
                <p><span className="text-muted-foreground">Appointment:</span> {showCancelModal.appointmentId} at {showCancelModal.time}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cancellation Reason *</label>
                <div className="space-y-1.5">
                  {CANCEL_REASONS.map(r => (
                    <label key={r} className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer hover:bg-accent/30 ${cancelReason === r ? 'border-primary bg-primary/5' : ''}`}>
                      <input type="radio" name="cancelReason" value={r} checked={cancelReason === r} onChange={() => setCancelReason(r)} className="rounded-full" />
                      <span className="text-sm">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Cancelled By</label>
                <select className="w-full px-3 py-2 rounded-lg border bg-background text-sm">
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowCancelModal(null)} className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent">Keep Appointment</button>
                <button onClick={() => { setShowCancelModal(null); setCancelReason(''); }} disabled={!cancelReason}
                  className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-50">
                  Confirm Cancellation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedAppt(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border rounded-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selectedAppt.patient}</h2>
                  <p className="text-xs text-muted-foreground">{selectedAppt.appointmentId} · {selectedAppt.uhid}</p>
                </div>
                <button onClick={() => setSelectedAppt(null)} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Doctor:</span> {selectedAppt.doctor}</div>
                <div><span className="text-muted-foreground">Department:</span> {selectedAppt.dept}</div>
                <div><span className="text-muted-foreground">Time:</span> {selectedAppt.time} ({selectedAppt.duration} min)</div>
                <div><span className="text-muted-foreground">Type:</span> {selectedAppt.type} {selectedAppt.consultationType === 'video' ? '📹' : ''}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selectedAppt.phone}</div>
                <div><span className="text-muted-foreground">Referral:</span> {selectedAppt.referralSource}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig[selectedAppt.status].color}`}>{statusConfig[selectedAppt.status].label}</span></div>
                {selectedAppt.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> {selectedAppt.notes}</div>}
                {selectedAppt.cancelReason && (
                  <div className="col-span-2 rounded-lg bg-destructive/5 border border-destructive/20 p-2">
                    <span className="text-muted-foreground">Cancel reason:</span> {selectedAppt.cancelReason}
                    {selectedAppt.cancelledBy && <span className="ml-2 text-xs text-muted-foreground">by {selectedAppt.cancelledBy}</span>}
                  </div>
                )}
                <div className="col-span-2 text-xs text-muted-foreground">Booked: {selectedAppt.bookedAt}</div>
              </div>
              <div className="flex gap-2 pt-2">
                {selectedAppt.status !== 'cancelled' && selectedAppt.status !== 'completed' && (
                  <>
                    <button className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent flex items-center justify-center gap-1">
                      <Edit2 className="w-3.5 h-3.5" /> Modify
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent flex items-center justify-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5" /> Reschedule
                    </button>
                    <button onClick={() => { setSelectedAppt(null); setShowCancelModal(selectedAppt); }}
                      className="flex-1 px-3 py-2 rounded-lg border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 flex items-center justify-center gap-1">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
