import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types/roles';
import { ROLE_TABS } from '@/config/roleNavigation';
import { Search, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const tabs = ROLE_TABS[user.role] ?? [];
  const currentTab = tabs.find(t => location.pathname === t.path) ?? tabs[0];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <div className="flex items-center h-14 px-5 gap-6">
        {/* Branding */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-foreground text-background rounded-md flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight">Adrine</span>
            <span className="text-muted-foreground text-sm">|</span>
            <span className="text-sm text-muted-foreground font-medium">
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap
                  ${isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-1 -bottom-[13px] h-0.5 bg-foreground rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="p-2 rounded-md hover:bg-accent transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-md hover:bg-accent transition-colors relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
              {user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium hidden lg:block">{user.name}</span>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
