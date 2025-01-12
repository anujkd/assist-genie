import React from 'react';
import { cn } from "@/lib/utils";

const Footer = ({ theme = 'system' }) => {
  // Define theme-based styles
  const footerStyles = cn(
    "border-t py-6",
    {
      // Light theme - white background
      "bg-background text-foreground border-border": theme === "light",
      // Dark theme - dark background
      "bg-card text-card-foreground border-card": theme === "dark",
      // System theme (default) - Lloyds Bank theme
      "bg-primary text-primary-foreground border-primary-foreground/10": theme === "system",
    }
  );

  const linkStyles = cn(
    "hover:underline",
    {
      "text-primary": theme === "light",
      "text-card-foreground": theme === "dark",
      "text-primary-foreground/90": theme === "system",
    }
  );

  const copyrightStyles = cn(
    "text-sm",
    {
      "text-muted-foreground": theme === "light" || theme === "dark",
      "text-primary-foreground/80": theme === "system",
    }
  );

  return (
    <footer className={footerStyles}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Links Section */}
          <div className="space-y-2">
            <h4 className={cn("font-semibold mb-3", 
              theme === "system" ? "text-primary-foreground" : "text-foreground"
            )}>
              Help and Support
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className={linkStyles}>Contact Us</a></li>
              <li><a href="#" className={linkStyles}>Security Centre</a></li>
              <li><a href="#" className={linkStyles}>Accessibility</a></li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className={cn("font-semibold mb-3", 
              theme === "system" ? "text-primary-foreground" : "text-foreground"
            )}>
              Legal
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className={linkStyles}>Privacy Notice</a></li>
              <li><a href="#" className={linkStyles}>Cookies</a></li>
              <li><a href="#" className={linkStyles}>Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className={cn("font-semibold mb-3", 
              theme === "system" ? "text-primary-foreground" : "text-foreground"
            )}>
              About Genie
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className={linkStyles}>About Us</a></li>
              <li><a href="#" className={linkStyles}>Careers</a></li>
              <li><a href="#" className={linkStyles}>Modern Slavery Act</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={cn("my-6 border-t", 
          theme === "system" ? "border-primary-foreground/10" : "border-border"
        )} />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className={copyrightStyles}>
            © 2024 Lloyds Bank plc. All rights reserved
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={cn("text-sm", copyrightStyles)}>
              Genie v1.0.0
            </div>
            {theme === "system" && (
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 12h4v8h16v-8h4L12 2zm2 18h-4v-6h4v6z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;