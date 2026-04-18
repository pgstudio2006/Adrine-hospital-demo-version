import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantSettings } from '@/hooks/useTenantSettings';
import { UserRole } from '@/types/roles';
import { motion } from 'framer-motion';
import { 
  Shield, Stethoscope, Heart, UserCheck, 
  FlaskConical, Pill, CreditCard, ScanLine, Scissors, Package, Siren, Users, CalendarClock, Droplets, HeartHandshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '@/stores/hospitalStore';
import { AppSelect } from '@/components/ui/app-select';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="w-6 h-6" />,
  doctor: <Stethoscope className="w-6 h-6" />,
  nurse: <Heart className="w-6 h-6" />,
  receptionist: <UserCheck className="w-6 h-6" />,
  lab_technician: <FlaskConical className="w-6 h-6" />,
  pharmacist: <Pill className="w-6 h-6" />,
  billing: <CreditCard className="w-6 h-6" />,
  radiologist: <ScanLine className="w-6 h-6" />,
  ot_coordinator: <Scissors className="w-6 h-6" />,
  inventory_manager: <Package className="w-6 h-6" />,
  emergency: <Siren className="w-6 h-6" />,
  hr_manager: <Users className="w-6 h-6" />,
  scheduler: <CalendarClock className="w-6 h-6" />,
  dialysis_tech: <Droplets className="w-6 h-6" />,
  crm_manager: <HeartHandshake className="w-6 h-6" />,
};

export default function LoginPage() {
  const { login } = useAuth();
  const { patients, appointments } = useHospital();
  const { settings, getAvailableRoles, getRoleDescription, getRoleLabel } = useTenantSettings();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const doctorDirectory = useMemo(() => {
    const departmentMap = new Map<string, Set<string>>();

    patients.forEach((patient) => {
      if (!patient.department || !patient.assignedDoctor) {
        return;
      }
      if (!departmentMap.has(patient.department)) {
        departmentMap.set(patient.department, new Set<string>());
      }
      departmentMap.get(patient.department)?.add(patient.assignedDoctor);
    });

    appointments.forEach((appointment) => {
      if (!appointment.department || !appointment.doctor) {
        return;
      }
      if (!departmentMap.has(appointment.department)) {
        departmentMap.set(appointment.department, new Set<string>());
      }
      departmentMap.get(appointment.department)?.add(appointment.doctor);
    });

    const normalized = Array.from(departmentMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([department, doctors]) => ({
        department,
        doctors: Array.from(doctors).sort((a, b) => a.localeCompare(b)),
      }));

    return normalized;
  }, [appointments, patients]);

  const availableDoctors = useMemo(() => {
    const selected = doctorDirectory.find((entry) => entry.department === selectedDepartment);
    return selected?.doctors ?? [];
  }, [doctorDirectory, selectedDepartment]);

  useEffect(() => {
    if (selectedRole !== 'doctor') {
      setSelectedDepartment('');
      setSelectedDoctor('');
      return;
    }

    if (!selectedDepartment && doctorDirectory.length > 0) {
      setSelectedDepartment(doctorDirectory[0].department);
    }
  }, [doctorDirectory, selectedDepartment, selectedRole]);

  useEffect(() => {
    if (selectedRole !== 'doctor') {
      return;
    }

    if (availableDoctors.length === 0) {
      setSelectedDoctor('');
      return;
    }

    if (!availableDoctors.includes(selectedDoctor)) {
      setSelectedDoctor(availableDoctors[0]);
    }
  }, [availableDoctors, selectedDoctor, selectedRole]);

  const handleLogin = () => {
    if (!selectedRole) return;

    if (selectedRole === 'doctor') {
      if (!selectedDepartment || !selectedDoctor) {
        return;
      }

      login(selectedRole, selectedDoctor, { department: selectedDepartment });
    } else {
      login(selectedRole, getRoleLabel(selectedRole));
    }

    navigate('/dashboard');
  };

  const roles = getAvailableRoles();
  const doctorSelectionIncomplete = selectedRole === 'doctor' && (!selectedDepartment || !selectedDoctor);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Premium subtle noise background */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-difference pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      
      {/* Ambient static blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-foreground/[0.02] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-block"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-4">
              {settings.branding.platformMark}
            </h1>
          </motion.div>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-border" />
            <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-muted-foreground font-bold">
              {settings.branding.productDescriptor}
            </p>
            <div className="h-[1px] w-12 bg-border" />
          </div>
          <div className="mt-5 space-y-1">
            <p className="text-sm font-semibold text-foreground">{settings.branding.organizationName}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{settings.branding.loginSubheadline}</p>
          </div>
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {roles.map((role, i) => {
            const isSelected = selectedRole === role;
            const isDimmed = selectedRole && !isSelected;
            
            return (
              <motion.button
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedRole(role)}
                className={`
                  relative flex flex-col items-start gap-4 p-5 rounded-md border transition-all duration-500 text-left group
                  ${isSelected
                    ? 'border-primary bg-primary/5 text-foreground shadow-md scale-[1.01] z-10' 
                    : 'border-border/60 bg-card text-foreground hover:border-primary/40 hover:shadow-md'
                  }
                  ${isDimmed ? 'opacity-40 scale-[0.98] grayscale hover:opacity-80' : 'opacity-100'}
                `}
              >
                {isSelected && (
                  <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
                )}

                <div className={`rounded-sm p-3 transition-colors duration-300 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                  {ROLE_ICONS[role]}
                </div>

                <div className="pt-2">
                  <p className="font-bold text-sm tracking-tight">{getRoleLabel(role)}</p>
                  <p className={`text-[11px] mt-1.5 leading-relaxed font-medium ${
                    isSelected ? 'text-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {getRoleDescription(role)}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {selectedRole === 'doctor' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto mb-10 border border-border/70 rounded-md bg-card p-5"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">Doctor Access Scope</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Department</span>
                <AppSelect
                  value={selectedDepartment || undefined}
                  onValueChange={setSelectedDepartment}
                  options={doctorDirectory.map((entry) => ({ value: entry.department, label: entry.department }))}
                  placeholder={doctorDirectory.length === 0 ? 'No departments found' : 'Select department'}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Doctor</span>
                <AppSelect
                  value={selectedDoctor || undefined}
                  onValueChange={setSelectedDoctor}
                  options={availableDoctors.map((doctor) => ({ value: doctor, label: doctor }))}
                  placeholder={availableDoctors.length === 0 ? 'No doctors found' : 'Select doctor'}
                  disabled={!selectedDepartment}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                />
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              Doctor module data is restricted to assigned patients for this doctor and department.
            </p>
          </motion.div>
        )}

        {/* Login Action Area */}
        <div className="max-w-md mx-auto relative">
          <motion.div
            initial={false}
            animate={{ 
              opacity: selectedRole ? 1 : 0.5,
              y: selectedRole ? 0 : 10
            }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={handleLogin}
              disabled={!selectedRole || doctorSelectionIncomplete}
              className={`
                group relative w-full overflow-hidden rounded-md py-4 font-bold tracking-widest uppercase transition-all duration-300
                ${selectedRole && !doctorSelectionIncomplete
                  ? 'bg-foreground text-background hover:shadow-2xl hover:-translate-y-1' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                }
              `}
            >
              {selectedRole && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              )}
              <span className="relative z-10 text-xs">
                {selectedRole
                  ? selectedRole === 'doctor'
                    ? doctorSelectionIncomplete
                      ? 'Select Department And Doctor'
                      : `Initialize Sequence: ${selectedDoctor}`
                    : `Initialize Sequence: ${getRoleLabel(selectedRole)}`
                  : 'Awaiting Role Selection'}
              </span>
            </button>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {settings.branding.loginHeadline} <span className="mx-2 opacity-30">|</span> {settings.branding.supportEmail}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
