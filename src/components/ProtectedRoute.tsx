import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ModuleKey } from '@/types/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  module?: ModuleKey;
}

export default function ProtectedRoute({ children, module }: ProtectedRouteProps) {
  const { user, canAccess } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (module && !canAccess(module)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-xl font-bold mb-2">Access Denied</h1>
        <p className="text-sm text-muted-foreground">You don't have permission to access this module.</p>
      </div>
    );
  }

  return <>{children}</>;
}
