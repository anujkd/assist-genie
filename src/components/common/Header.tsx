// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSub,
//   DropdownMenuSubTrigger,
//   DropdownMenuSubContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { 
//   Menu, 
//   MessageSquarePlus, 
//   Sun, 
//   Moon, 
//   Computer, 
//   LogOut, 
//   User,
//   ChevronRight,
//   Terminal
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Header = ({ 
//   userName = 'John Doe',
//   theme = 'light',
//   onThemeChange,
//   onLogout,
//   onSidebarToggle 
// }) => {
//   return (
//     <header className="h-16 bg-white dark:bg-card border-b border-border flex items-center px-4 shadow-sm">
//       <div className="flex items-center gap-3 flex-1">
//         <Button 
//           variant="ghost" 
//           size="icon"
//           onClick={onSidebarToggle}
//           className="text-primary hover:text-primary/90"
//         >
//           <Menu className="h-5 w-5" />
//         </Button>

//         {/* Lloyds Bank Logo */}
//         <div className="flex items-center gap-2">
//           <svg
//             className="h-8 w-8 text-primary"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//           >
//             <path d="M12 2L2 12h4v8h16v-8h4L12 2zm2 18h-4v-6h4v6z" />
//           </svg>
//           <div className="flex flex-col">
//             <span className="text-lg font-semibold text-primary">Genie</span>
//             <span className="text-xs text-muted-foreground">by Lloyds Bank</span>
//           </div>
//         </div>

//         <div className="ml-6">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="gap-2 text-primary hover:text-primary/90"
//           >
//             <MessageSquarePlus className="h-4 w-4" />
//             New Chat
//           </Button>
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-sm font-medium mr-2">{userName}</span>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button 
//               variant="ghost" 
//               className="h-9 w-9 rounded-full p-0 border-2 border-primary"
//             >
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src="" />
//                 <AvatarFallback className="bg-primary/10 text-primary">
//                   {userName.slice(0, 2).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//             </Button>
//           </DropdownMenuTrigger>
          
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
            
//             <DropdownMenuItem>
//               <User className="mr-2 h-4 w-4" />
//               <span>Profile</span>
//               <ChevronRight className="ml-auto h-4 w-4" />
//             </DropdownMenuItem>
            
//             <DropdownMenuItem>
//               <Terminal className="mr-2 h-4 w-4" />
//               <span>API Console</span>
//               <ChevronRight className="ml-auto h-4 w-4" />
//             </DropdownMenuItem>

//             <DropdownMenuSub>
//               <DropdownMenuSubTrigger>
//                 {theme === 'light' && <Sun className="mr-2 h-4 w-4" />}
//                 {theme === 'dark' && <Moon className="mr-2 h-4 w-4" />}
//                 {theme === 'system' && <Computer className="mr-2 h-4 w-4" />}
//                 <span>Theme</span>
//               </DropdownMenuSubTrigger>
//               <DropdownMenuSubContent>
//                 <DropdownMenuItem onClick={() => onThemeChange('light')}>
//                   <Sun className="mr-2 h-4 w-4" />
//                   Light
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => onThemeChange('dark')}>
//                   <Moon className="mr-2 h-4 w-4" />
//                   Dark
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => onThemeChange('system')}>
//                   <Computer className="mr-2 h-4 w-4" />
//                   System
//                 </DropdownMenuItem>
//               </DropdownMenuSubContent>
//             </DropdownMenuSub>

//             <DropdownMenuSeparator />
            
//             <DropdownMenuItem onClick={onLogout} className="text-destructive">
//               <LogOut className="mr-2 h-4 w-4" />
//               <span>Logout</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// };

// export default Header;


// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSub,
//   DropdownMenuSubTrigger,
//   DropdownMenuSubContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { 
//   Menu, 
//   MessageSquarePlus, 
//   Sun, 
//   Moon, 
//   Computer, 
//   LogOut, 
//   User,
//   Settings,
//   ChevronRight,
//   Terminal
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Header = ({ 
//   userName = 'John Doe',
//   theme = 'light',
//   onThemeChange,
//   onLogout,
//   onSidebarToggle 
// }) => {
//   return (
//     <header className="h-16 bg-primary flex items-center px-4 shadow-sm">
//       <div className="flex items-center gap-3 flex-1">
//         <Button 
//           variant="ghost" 
//           size="icon"
//           onClick={onSidebarToggle}
//           className="text-white hover:bg-primary-foreground/10 hover:text-white"
//         >
//           <Menu className="h-5 w-5" />
//         </Button>

//         {/* Lloyds Bank Logo */}
//         <div className="flex items-center gap-2">
//           <svg
//             className="h-8 w-8 text-white"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//           >
//             <path d="M12 2L2 12h4v8h16v-8h4L12 2zm2 18h-4v-6h4v6z" />
//           </svg>
//           <div className="flex flex-col">
//             <span className="text-lg font-semibold text-white">Genie</span>
//             <span className="text-xs text-primary-foreground/80">by Lloyds Bank</span>
//           </div>
//         </div>

//         <div className="ml-6">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="gap-2 text-white hover:bg-primary-foreground/10 hover:text-white"
//           >
//             <MessageSquarePlus className="h-4 w-4" />
//             New Chat
//           </Button>
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <span className="text-sm font-medium text-white mr-2">{userName}</span>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button 
//               variant="ghost" 
//               className="h-9 w-9 rounded-full p-0 border-2 border-white hover:bg-primary-foreground/10"
//             >
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src="" />
//                 <AvatarFallback className="bg-white/10 text-white">
//                   {userName.slice(0, 2).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//             </Button>
//           </DropdownMenuTrigger>
          
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
            
//             <DropdownMenuItem>
//               <User className="mr-2 h-4 w-4" />
//               <span>Profile</span>
//               <ChevronRight className="ml-auto h-4 w-4" />
//             </DropdownMenuItem>
            
//             <DropdownMenuItem>
//               <Terminal className="mr-2 h-4 w-4" />
//               <span>API Console</span>
//               <ChevronRight className="ml-auto h-4 w-4" />
//             </DropdownMenuItem>

//             <DropdownMenuSub>
//               <DropdownMenuSubTrigger>
//                 {theme === 'light' && <Sun className="mr-2 h-4 w-4" />}
//                 {theme === 'dark' && <Moon className="mr-2 h-4 w-4" />}
//                 {theme === 'system' && <Computer className="mr-2 h-4 w-4" />}
//                 <span>Theme</span>
//               </DropdownMenuSubTrigger>
//               <DropdownMenuSubContent>
//                 <DropdownMenuItem onClick={() => onThemeChange('light')}>
//                   <Sun className="mr-2 h-4 w-4" />
//                   Light
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => onThemeChange('dark')}>
//                   <Moon className="mr-2 h-4 w-4" />
//                   Dark
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => onThemeChange('system')}>
//                   <Computer className="mr-2 h-4 w-4" />
//                   System
//                 </DropdownMenuItem>
//               </DropdownMenuSubContent>
//             </DropdownMenuSub>

//             <DropdownMenuSeparator />
            
//             <DropdownMenuItem onClick={onLogout} className="text-destructive">
//               <LogOut className="mr-2 h-4 w-4" />
//               <span>Logout</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  MessageSquarePlus, 
  Sun, 
  Moon, 
  Computer, 
  LogOut, 
  User,
  Settings,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Header = ({ 
  userName = 'John Doe',
  theme = 'system',
  onThemeChange,
  onLogout,
  onSidebarToggle 
}) => {
  // Define theme-based styles
  const headerStyles = cn(
    "h-16 flex items-center px-4 shadow-sm",
    {
      // Light theme - white background
      "bg-background text-foreground": theme === "light",
      // Dark theme - dark background
      "bg-card text-card-foreground": theme === "dark",
      // System theme (default) - Lloyds Bank green
      "bg-primary text-primary-foreground": theme === "system",
    }
  );

  const buttonStyles = cn(
    "gap-2",
    {
      // Light theme
      "text-primary hover:text-primary/90": theme === "light",
      // Dark theme
      "text-card-foreground hover:text-card-foreground/90": theme === "dark",
      // System theme
      "text-white hover:bg-primary-foreground/10 hover:text-white": theme === "system",
    }
  );

  const logoTextStyles = cn(
    "text-lg font-semibold",
    {
      "text-primary": theme === "light",
      "text-card-foreground": theme === "dark",
      "text-white": theme === "system",
    }
  );

  const subTextStyles = cn(
    "text-xs",
    {
      "text-muted-foreground": theme === "light" || theme === "dark",
      "text-primary-foreground/80": theme === "system",
    }
  );

  const avatarContainerStyles = cn(
    "h-9 w-9 rounded-full p-0 border-2",
    {
      "border-primary": theme === "light",
      "border-card-foreground": theme === "dark",
      "border-white": theme === "system",
    }
  );

  return (
    <header className={headerStyles}>
      <div className="flex items-center gap-3 flex-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSidebarToggle}
          className={buttonStyles}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Lloyds Bank Logo */}
        <div className="flex items-center gap-2">
          <svg
            className={theme === "light" ? "h-8 w-8 text-primary" : "h-8 w-8 text-white"}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 12h4v8h16v-8h4L12 2zm2 18h-4v-6h4v6z" />
          </svg>
          <div className="flex flex-col">
            <span className={logoTextStyles}>Genie</span>
            <span className={subTextStyles}>by Lloyds Bank</span>
          </div>
        </div>

        <div className="ml-6">
          <Button
            variant="ghost"
            size="sm"
            className={buttonStyles}
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-medium mr-2", logoTextStyles)}>{userName}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={avatarContainerStyles}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className={theme === "system" ? "bg-white/10 text-white" : "bg-primary/10 text-primary"}>
                  {userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Terminal className="mr-2 h-4 w-4" />
              <span>API Console</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {theme === 'light' && <Sun className="mr-2 h-4 w-4" />}
                {theme === 'dark' && <Moon className="mr-2 h-4 w-4" />}
                {theme === 'system' && <Computer className="mr-2 h-4 w-4" />}
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onThemeChange('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeChange('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeChange('system')}>
                  <Computer className="mr-2 h-4 w-4" />
                  System (Lloyds)
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;