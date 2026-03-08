import TopNavbar from './TopNavbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />
      <main className="flex-1 p-6 max-w-[1440px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
