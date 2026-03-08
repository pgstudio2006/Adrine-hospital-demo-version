import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_LABELS } from '@/types/roles';
import { motion } from 'framer-motion';
import { 
  Shield, Stethoscope, Heart, UserCheck, 
  FlaskConical, Pill, CreditCard, ScanLine, Scissors, Package, Siren
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Full system access & configuration',
  doctor: 'OPD, IPD, prescriptions & orders',
  nurse: 'Ward management & patient care',
  receptionist: 'Registration, appointments & billing',
  lab_technician: 'Lab worklist & report management',
  pharmacist: 'Dispensing & inventory control',
  billing: 'Billing, revenue & insurance',
  radiologist: 'Radiology worklist & reporting',
  ot_coordinator: 'OT scheduling & surgical teams',
  inventory_manager: 'Central store & supply chain',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = () => {
    if (!selectedRole) return;
    login(selectedRole, ROLE_LABELS[selectedRole]);
    navigate('/dashboard');
  };

  const roles = Object.keys(ROLE_LABELS) as UserRole[];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            ADRINE
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium">
            Hospital Operating System
          </p>
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {roles.map((role, i) => (
            <motion.button
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedRole(role)}
              className={`
                relative flex flex-col items-center gap-3 p-5 rounded-lg border transition-all duration-200 text-center
                ${selectedRole === role 
                  ? 'border-foreground bg-foreground text-background shadow-lg scale-[1.02]' 
                  : 'border-border bg-card text-foreground hover:border-foreground/30 hover:shadow-sm'
                }
              `}
            >
              <div className={selectedRole === role ? 'opacity-100' : 'opacity-60'}>
                {ROLE_ICONS[role]}
              </div>
              <div>
                <p className="font-semibold text-sm">{ROLE_LABELS[role]}</p>
                <p className={`text-[11px] mt-1 leading-tight ${
                  selectedRole === role ? 'text-background/70' : 'text-muted-foreground'
                }`}>
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Login Button */}
        <motion.button
          onClick={handleLogin}
          disabled={!selectedRole}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full py-3.5 rounded-lg font-semibold text-sm tracking-wide uppercase transition-all duration-200
            ${selectedRole 
              ? 'bg-foreground text-background hover:opacity-90 cursor-pointer' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {selectedRole ? `Enter as ${ROLE_LABELS[selectedRole]}` : 'Select your role'}
        </motion.button>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Demo mode — Select a role to explore the system
        </p>
      </motion.div>
    </div>
  );
}
