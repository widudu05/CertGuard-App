import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import MobileSidebar from "@/components/ui/mobile-sidebar";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [location] = useLocation();

  useEffect(() => {
    // Set page title based on current location
    switch (location) {
      case "/":
        setPageTitle("Dashboard");
        break;
      case "/certificates":
        setPageTitle("Certificados");
        break;
      case "/groups":
        setPageTitle("Grupos e Usuários");
        break;
      case "/permissions":
        setPageTitle("Permissões");
        break;
      case "/audit-logs":
        setPageTitle("Logs de Auditoria");
        break;
      case "/settings":
        setPageTitle("Configurações");
        break;
      case "/profile":
        setPageTitle("Perfil");
        break;
      default:
        setPageTitle("Dashboard");
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />
      
      {/* Mobile Header with Hamburger */}
      <div className="bg-zinc-900 text-white p-2 md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between">
        <button 
          onClick={() => setMobileSidebarOpen(true)} 
          className="p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>
        <h1 className="text-lg font-semibold">WhomDoc9</h1>
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />
        
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-10">
          <div className="container mx-auto max-w-7xl px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
