import { Link, useLocation } from "wouter";
import { NavItem } from "@/types";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: "dashboard",
    href: "/",
    section: "Painel Principal"
  },
  {
    title: "Certificados",
    icon: "vpn_key",
    href: "/certificates",
    section: "Painel Principal"
  },
  {
    title: "Grupos e Usuários",
    icon: "groups",
    href: "/groups",
    section: "Painel Principal"
  },
  {
    title: "Permissões",
    icon: "admin_panel_settings",
    href: "/permissions",
    section: "Configurações"
  },
  {
    title: "Logs de Auditoria",
    icon: "history",
    href: "/audit-logs",
    section: "Configurações"
  },
  {
    title: "Configurações",
    icon: "settings",
    href: "/settings",
    section: "Configurações"
  },
  {
    title: "Perfil",
    icon: "account_circle",
    href: "/profile",
    section: "Conta"
  },
  {
    title: "Sair",
    icon: "logout",
    href: "/logout",
    section: "Conta"
  }
];

const groupedNavItems = navItems.reduce((acc, item) => {
  const section = item.section || "Outros";
  if (!acc[section]) {
    acc[section] = [];
  }
  acc[section].push(item);
  return acc;
}, {} as Record<string, NavItem[]>);

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-zinc-900 z-40 transform transition-transform duration-300 md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
          <h1 className="text-xl font-semibold text-white">WhomDoc9</h1>
        </div>
        <button 
          onClick={onClose}
          className="text-white p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
      
      <nav className="mt-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {Object.entries(groupedNavItems).map(([section, items]) => (
          <div key={section}>
            <div className="px-4 py-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{section}</span>
            </div>
            
            {items.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                onClick={onClose}
              >
                <a className={cn(
                  "flex items-center px-4 py-3 transition-colors",
                  location === item.href 
                    ? "text-zinc-100 bg-zinc-800 border-l-4 border-blue-500" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}>
                  <span className="material-icons mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </a>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MobileSidebar;
