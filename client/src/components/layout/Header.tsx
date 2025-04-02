import { useState } from "react";
import { Menu, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar: () => void;
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export default function Header({ onToggleSidebar, user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-600 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search */}
        <div className="relative md:ml-4 hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <Input 
            type="text" 
            className="pl-10 pr-4 py-2 w-72" 
            placeholder="Pesquisar certificados..." 
          />
        </div>

        {/* Right Menu */}
        <div className="flex items-center space-x-4">
          <button className="text-slate-600 relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white"></span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-700">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
