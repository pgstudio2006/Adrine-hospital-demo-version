import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_TABS, ROLE_BASE_PATH } from '@/config/roleNavigation';
import { ROLE_LABELS } from '@/types/roles';
import { Search, Bell, LogOut, ChevronRight, X, Clock, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "New lab report ready", message: "CBC report for patient UH-10234 is ready for review", time: "2 min ago", read: false },
  { id: 2, title: "Appointment reminder", message: "Dr. Sanjay Mehta's appointment in 15 minutes", time: "5 min ago", read: false },
  { id: 3, title: "Bed allocation request", message: "ICU bed requested for emergency admission", time: "12 min ago", read: false },
  { id: 4, title: "Inventory alert", message: "Dialyzer F60S stock below reorder level", time: "1 hr ago", read: true },
  { id: 5, title: "Shift change", message: "Evening shift starts at 2:00 PM — 3 tasks pending", time: "2 hr ago", read: true },
];

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  if (!user) return null;

  const tabs = ROLE_TABS[user.role] ?? [];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Dynamic initials from user name
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Detect if we're on a sub-page (e.g., /doctor/patients/1)
  const parentTab = tabs.find(t => t.path !== `/${user.role}` && location.pathname.startsWith(t.path) && location.pathname !== t.path);

  // Search results from tab labels
  const searchResults = searchQuery.trim()
    ? tabs.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery('');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <div className="flex items-center h-14 px-5 gap-6">
        {/* Branding with breadcrumb */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-base tracking-tight cursor-pointer" onClick={() => navigate(ROLE_BASE_PATH[user.role])}>Adrine</span>
          <Badge variant="outline" className="text-[9px] hidden md:inline-flex">{ROLE_LABELS[user.role]}</Badge>
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
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={searchRef}
                  placeholder="Search modules..."
                  className="w-48 h-8 text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') { setShowSearch(false); setSearchQuery(''); }
                    if (e.key === 'Enter' && searchResults.length > 0) handleSearchSelect(searchResults[0].path);
                  }}
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-1">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full mt-1 right-0 w-48 bg-popover border rounded-md shadow-lg py-1 z-50">
                    {searchResults.map(r => (
                      <button
                        key={r.key}
                        onClick={() => handleSearchSelect(r.path)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowSearch(true)} className="p-2 rounded-md hover:bg-accent transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md hover:bg-accent transition-colors relative"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[9px] text-destructive-foreground flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full mt-1 right-0 w-80 bg-popover border rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                      onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read ? (
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        ) : (
                          <CheckCircle className="w-3 h-3 text-muted-foreground mt-1 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
              {initials}
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
