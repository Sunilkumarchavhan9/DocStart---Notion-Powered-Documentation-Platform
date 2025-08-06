"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  Plus, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  FolderOpen,
  FileText as Template,
  Shield
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/dashboard", icon: FolderOpen },
    { name: "Templates", href: "/templates", icon: Template },
    { name: "Privacy", href: "/privacy", icon: Shield },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href) || false;
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
                         <Link href="/" className="flex items-center space-x-2 -ml-20">
                         <svg data-testid="geist-icon" height="40" strokeLinejoin="round" viewBox="0 0 16 16" width="40" style={{color: "currentcolor"}}><path fillRule="evenodd" clipRule="evenodd" d="M8.5 1C8.5 1 4.58642 4.74805 3.94122 5.39717C3.86128 5.4776 3.84989 5.60224 3.91398 5.69539C3.97806 5.78854 4.09993 5.82451 4.20557 5.78145L7.90537 4.27345L11.7747 10.3604C11.8406 10.464 11.9758 10.5013 12.0869 10.4465C12.1979 10.3917 12.2483 10.2628 12.2032 10.1489C11.7103 8.90508 8.5 1 8.5 1ZM6.29304 7.03867C6.35522 6.93334 6.32602 6.79881 6.22554 6.72763C6.12505 6.65645 5.98605 6.67185 5.90418 6.76322C5.12486 7.633 0 13.5 0 13.5C0 13.5 5.18613 14.803 6.03089 14.9939C6.14204 15.0191 6.25587 14.964 6.30355 14.8621C6.35122 14.7603 6.31967 14.6394 6.22796 14.5728L3.1616 12.3431L6.29304 7.03867ZM14.054 8.5893C14.016 8.47964 13.9029 8.4131 13.7867 8.43203C13.6705 8.45096 13.5853 8.5498 13.5853 8.66564V12.3824L6.45275 12.5197C6.32824 12.5221 6.22613 12.6175 6.2173 12.7396C6.20846 12.8618 6.2958 12.9704 6.41871 12.9901C7.68171 13.1927 16 14.5728 16 14.5728C16 14.5728 14.3311 9.38966 14.054 8.5893Z" fill="currentColor"></path></svg>
               <span className="text-xl font-bold text-foreground">
                  
                </span>
             </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Theme, User */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {session?.user ? (
              <div className="relative">
                <button 
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">
                    {session.user.name}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-tighter"
                >
                  SignIn
                </Link>
                                 <Link
                   href="/auth/signup"
                   className="px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                 >
                   Signup
                 </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
        className="md:hidden border-t border-border"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
          
          {session?.user && (
            <button
              onClick={() => {
                signOut();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3 " />
              Sign Out
            </button>
          )}
        </div>
      </motion.div>
    </nav>
  );
}