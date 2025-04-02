import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Settings 
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Certificados", path: "/certificates", icon: FileCheck },
  { name: "Usuários", path: "/users", icon: Users },
  { name: "Políticas de Acesso", path: "/access-policies", icon: ShieldCheck },
  { name: "Agendamentos", path: "/schedules", icon: Clock },
  { name: "Logs de Auditoria", path: "/audit-logs", icon: FileText },
  { name: "Configurações", path: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div
      className={`fixed z-30 md:relative w-64 h-screen shadow-lg transition-transform duration-300 ease-in-out bg-white ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Logo & Brand */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center">
          <div className="rounded-md bg-primary-600 p-2 mr-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Whom.doc9</h1>
            <p className="text-xs text-slate-500">Gerenciamento de Certificados</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul>
          {navigationItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link href={item.path}>
                <a
                  className={`flex items-center px-4 py-3 rounded-md font-medium ${
                    location === item.path
                      ? "text-primary-600 bg-primary-50"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
