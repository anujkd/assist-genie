import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, MessageSquarePlus, Sun, Moon, Computer, LogOut, User as UserIcon, Settings, SquareChevronRight } from 'lucide-react';
import { useTheme } from '../common/ThemeProvider';
import { useLogout, useUserProfile } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: profile, isLoading } = useUserProfile();
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  console.log('profile', profile);
  console.log('isLoading', isLoading);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <header className="border-b h-14 flex items-center px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
          <Link to="/chat">  <span className="font-semibold">Assistant Genie</span></Link>
         
        </div>
        
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback>{profile?.name && <span className="sr-only">{profile.name}</span>}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SquareChevronRight className="mr-2 h-4 w-4" />
                <Link to="/settings"><span>API Console</span></Link> 
              </DropdownMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-2 w-full flex items-center">
                  {theme === 'light' && <Sun className="h-4 w-4" />}
                  {theme === 'dark' && <Moon className="h-4 w-4" />}
                  {theme === 'system' && <Computer className="h-4 w-4" />}
                  <span className="ml-4">Theme</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header> */}
      <Header
        userName={profile?.name || 'User'}
        theme={theme}
        onThemeChange={setTheme}
        onLogout={logout}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {/* <footer className="border-t py-4 px-6 text-center text-sm text-gray-500">
        <p>© 2024 AI Assistant Genie v1.0.0</p>
      </footer> */}
      <Footer theme={theme}/>
    </div>
  );
};