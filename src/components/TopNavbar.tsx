import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_TABS } from '@/config/roleNavigation';
import { Search, Bell, LogOut, ChevronRight } from 'lucide-react';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const tabs = ROLE_TABS[user.role] ?? [];

  // Detect if we're on a sub-page (e.g., /doctor/patients/1)
  const parentTab = tabs.find(t => t.path !== `/${user.role}` && location.pathname.startsWith(t.path) && location.pathname !== t.path);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <div className="flex items-center h-14 px-5 gap-6">
        {/* Branding with breadcrumb */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-base tracking-tight">Adrine</span>
          {parentTab && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{parentTab.label}</span>
            </>
          )}
        </div>

        {/* Tabs — centered */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path || (parentTab?.key === tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap
                  ${isActive
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                {tab.label}
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
              DR
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
