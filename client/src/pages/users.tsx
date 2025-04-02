import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  const { data: userGroups } = useQuery({
    queryKey: ["/api/user-groups"],
    queryFn: () => fetch("/api/user-groups").then((res) => res.json()),
  });

  const filteredUsers = users?.filter((user: User) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    // In a real app, would show a form modal or navigate to form page
    console.log("Add user clicked");
  };

  const handleAddGroup = () => {
    // In a real app, would show a form modal or navigate to form page
    console.log("Add group clicked");
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Usuários e Grupos</h1>
        <p className="text-slate-600 mt-1">
          Gerencie usuários e grupos de acesso aos certificados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Usuários</CardTitle>
                  <CardDescription>
                    Total de usuários: {users?.length || 0}
                  </CardDescription>
                </div>
                <Button onClick={handleAddUser}>Adicionar Usuário</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {isLoading ? (
                <div className="text-center p-8">Carregando usuários...</div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers?.map((user: User) => (
                    <div key={user.id} className="p-4 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Grupos</CardTitle>
                  <CardDescription>
                    Total de grupos: {userGroups?.length || 0}
                  </CardDescription>
                </div>
                <Button size="sm" onClick={handleAddGroup}>
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userGroups?.map((group: any) => (
                  <div
                    key={group.id}
                    className="p-3 border rounded-md hover:bg-slate-50 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-xs text-slate-500">
                        {group.description || "Sem descrição"}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Gerenciar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
