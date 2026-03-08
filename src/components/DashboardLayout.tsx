import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types/roles';
import { NAV_ITEMS } from '@/config/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, canAccess } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNav = useMemo(() => {
    return NAV_ITEMS.filter(item => canAccess(item.key));
  }, [canAccess]);

  const groupedNav = useMemo(() => {
    const groups: Record<string, typeof filteredNav> = {};
    filteredNav.forEach(item => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, [filteredNav]);

  const currentPage = NAV_ITEMS.find(item => location.pathname === item.path);

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground text-background rounded-md flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-sm tracking-tight">ADRINE</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Hospital OS</span>
            </div>
          </div>
        </SidebarHeader>

        <Separator className="mx-2 w-auto" />

        <SidebarContent className="mt-2">
          {Object.entries(groupedNav).map(([group, items]) => (
            <SidebarGroup key={group}>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                {group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map(item => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        isActive={location.pathname === item.path}
                        tooltip={item.label}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="p-3">
          <Separator className="mb-3" />
          <div className="flex items-center gap-2 px-1 group-data-[collapsible=icon]:justify-center">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
              {user?.name?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground">{user ? ROLE_LABELS[user.role] : ''}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="p-1.5 rounded-md hover:bg-muted transition-colors group-data-[collapsible=icon]:hidden"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-background/80 backdrop-blur-sm px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">{currentPage?.group}</span>
            {currentPage && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{currentPage.label}</span>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
