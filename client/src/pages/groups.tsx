import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";
import GroupTable from "@/components/groups/group-table";
import AddGroupDialog from "@/components/groups/add-group-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Groups = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("groups");
  
  // Fetch all groups
  const { 
    data: groups, 
    isLoading: isLoadingGroups,
    refetch: refetchGroups
  } = useQuery({
    queryKey: ['/api/groups'],
    staleTime: 30 * 1000, // 30 seconds
  });
  
  // Fetch all users
  const { 
    data: users, 
    isLoading: isLoadingUsers
  } = useQuery({
    queryKey: ['/api/users'],
    staleTime: 30 * 1000,
  });
  
  // Filter groups by search term
  const filteredGroups = groups?.filter((group: any) => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
  // Filter users by search term
  const filteredUsers = users?.filter((user: any) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const handleEditGroup = (group: any) => {
    toast({
      title: "Editar grupo",
      description: `Edição do grupo ${group.name} não implementada neste MVP.`
    });
  };
  
  const handleDeleteGroup = (group: any) => {
    toast({
      title: "Excluir grupo",
      description: `Exclusão do grupo ${group.name} não implementada neste MVP.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Grupos e Usuários</h1>
        <Button onClick={() => setAddGroupOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Grupo
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="groups" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups">
          {isLoadingGroups ? (
            <div className="text-center py-8">Carregando grupos...</div>
          ) : (
            <GroupTable
              groups={filteredGroups}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
            />
          )}
        </TabsContent>
        
        <TabsContent value="users">
          {isLoadingUsers ? (
            <div className="text-center py-8">Carregando usuários...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Usuário</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Grupo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Função</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-zinc-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                        {user.groupId ? (groups?.find((g: any) => g.id === user.groupId)?.name || '-') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={() => {
                          toast({
                            title: "Editar usuário",
                            description: `Edição do usuário ${user.name} não implementada neste MVP.`
                          });
                        }}>
                          <span className="material-icons text-zinc-600">edit</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  Nenhum usuário encontrado.
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddGroupDialog
        open={addGroupOpen}
        onOpenChange={setAddGroupOpen}
        onSuccess={refetchGroups}
      />
    </div>
  );
};

export default Groups;
