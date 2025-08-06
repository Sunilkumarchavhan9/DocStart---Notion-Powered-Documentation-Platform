"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Plus, Settings } from "lucide-react";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
}

export default function ResponsiveLayout({
  children,
  sidebar,
  header,
  showMobileMenu = false,
  onMobileMenuToggle
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-card border-b border-border lg:hidden"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={onMobileMenuToggle}
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-lg font-semibold text-foreground">DocStart</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-accent rounded-md transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-accent rounded-md transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.header>
      )}

      {/* Desktop Header */}
      {!isMobile && header && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-card border-b border-border"
        >
          {header}
        </motion.header>
      )}

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isMobile && (
          <AnimatePresence>
            {showMobileMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                  onClick={onMobileMenuToggle}
                />
                <motion.aside
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-40 lg:hidden"
                >
                  <div className="p-4">
                    {sidebar}
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && sidebar && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-80 bg-card border-r border-border min-h-screen"
          >
            <div className="p-4">
              {sidebar}
            </div>
          </motion.aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'w-full' : 'min-w-0'}`}>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 