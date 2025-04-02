import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [search, setSearch] = useState("");

  return (
    <header className="bg-white border-b border-zinc-200 p-4 hidden md:block">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
          <p className="text-sm text-zinc-500">Gerencie seus certificados e permissões em um só lugar</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              className="pl-10 pr-4 py-2 w-64"
              placeholder="Pesquisar certificados..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="material-icons absolute left-3 top-2 text-zinc-400">search</span>
          </div>
          
          <button className="p-2 rounded-full hover:bg-zinc-100 relative">
            <span className="material-icons text-zinc-500">notifications</span>
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-blue-600">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin Demo</p>
              <p className="text-xs text-zinc-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
