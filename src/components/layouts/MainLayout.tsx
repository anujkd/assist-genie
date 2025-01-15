import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useLogout, useUserProfile } from '@/hooks/useAuth';
import { useTheme } from '../common/ThemeProvider';
import Header from '../common/Header';
import Footer from '../common/Footer';
import ChatSidebar from '../chat/chatHistory2';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: profile, isLoading } = useUserProfile();
  const logout = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSelectChat = (id: string) => {
    // Handle chat selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        userName={profile?.name || 'User'}
        theme={theme}
        onThemeChange={setTheme}
        onLogout={logout}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block transition-all duration-300 ${
          isSidebarOpen ? 'w-80' : 'w-0'
        }`}>
          {isSidebarOpen && (
            <div className="h-full">
              <ChatSidebar
                onSelectChat={handleSelectChat}
                onDeleteChat={(id) => console.log('delete', id)}
                onEditChat={(id) => console.log('edit', id)}
                onNewChat={() => console.log('new chat')}
                onCloseSidebar={() => setIsSidebarOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Mobile Sidebar using Sheet */}
        <Sheet open={isSidebarOpen && window.innerWidth < 1024} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <ChatSidebar
              onSelectChat={handleSelectChat}
              onDeleteChat={(id) => console.log('delete', id)}
              onEditChat={(id) => console.log('edit', id)}
              onNewChat={() => console.log('new chat')}
              onCloseSidebar={() => setIsSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      <Footer theme={theme} />
    </div>
  );
};