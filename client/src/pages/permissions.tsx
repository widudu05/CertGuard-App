import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PermissionTable from "@/components/permissions/permission-table";

const Permissions = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  
  // Fetch all certificates
  const { 
    data: certificates, 
    isLoading: isLoadingCertificates
  } = useQuery({
    queryKey: ['/api/certificates'],
    staleTime: 30 * 1000,
  });
  
  // Fetch all groups
  const { 
    data: groups, 
    isLoading: isLoadingGroups
  } = useQuery({
    queryKey: ['/api/groups'],
    staleTime: 30 * 1000,
  });
  
  // Fetch permissions by certificate (if a certificate is selected)
  const { 
    data: certificatePermissions, 
    isLoading: isLoadingCertificatePermissions,
    refetch: refetchCertificatePermissions
  } = useQuery({
    queryKey: [selectedCertificate ? `/api/permissions/certificate/${selectedCertificate}` : null],
    enabled: !!selectedCertificate,
    staleTime: 30 * 1000,
  });
  
  // Fetch permissions by group (if a group is selected)
  const { 
    data: groupPermissions, 
    isLoading: isLoadingGroupPermissions,
    refetch: refetchGroupPermissions
  } = useQuery({
    queryKey: [selectedGroup ? `/api/permissions/group/${selectedGroup}` : null],
    enabled: !!selectedGroup,
    staleTime: 30 * 1000,
  });
  
  // Get filtered certificates based on search term
  const filteredCertificates = certificates?.filter((cert: any) => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuedTo.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Get filtered groups based on search term
  const filteredGroups = groups?.filter((group: any) => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
  // Handle permission update
  const handleUpdatePermission = (permission: any, field: string, value: boolean) => {
    toast({
      title: "Permissão atualizada",
      description: `A atualização da permissão está em implementação para este MVP.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Permissões</h1>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar por nome de certificado ou grupo..."
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

      <Tabs defaultValue="certificates">
        <TabsList className="mb-4">
          <TabsTrigger value="certificates">Por Certificado</TabsTrigger>
          <TabsTrigger value="groups">Por Grupo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="certificates">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Certificados</h3>
                  
                  {isLoadingCertificates ? (
                    <div className="text-center py-8">Carregando certificados...</div>
                  ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {filteredCertificates.map((cert: any) => (
                        <div 
                          key={cert.id} 
                          className={`p-3 rounded-md cursor-pointer border ${
                            selectedCertificate === cert.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-zinc-50 border-zinc-200'
                          }`}
                          onClick={() => setSelectedCertificate(cert.id)}
                        >
                          <div className="flex items-center">
                            <span className="material-icons text-blue-600 mr-2">description</span>
                            <div>
                              <p className="font-medium text-sm">{cert.name}</p>
                              <p className="text-xs text-zinc-500">Emitido para: {cert.issuedTo}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredCertificates.length === 0 && (
                        <div className="text-center py-4 text-zinc-500">
                          Nenhum certificado encontrado.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedCertificate 
                      ? `Permissões: ${
                          certificates?.find((c: any) => c.id === selectedCertificate)?.name || 'Certificado Selecionado'
                        }` 
                      : 'Selecione um certificado para ver suas permissões'}
                  </h3>
                  
                  {!selectedCertificate ? (
                    <div className="text-center py-12 text-zinc-500">
                      <span className="material-icons text-4xl mb-2">touch_app</span>
                      <p>Selecione um certificado na lista à esquerda para ver suas permissões.</p>
                    </div>
                  ) : isLoadingCertificatePermissions ? (
                    <div className="text-center py-8">Carregando permissões...</div>
                  ) : (
                    <PermissionTable 
                      permissions={certificatePermissions || []}
                      groups={groups || []}
                      onUpdatePermission={handleUpdatePermission}
                      emptyMessage="Este certificado não possui permissões atribuídas."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="groups">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Grupos</h3>
                  
                  {isLoadingGroups ? (
                    <div className="text-center py-8">Carregando grupos...</div>
                  ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {filteredGroups.map((group: any) => (
                        <div 
                          key={group.id} 
                          className={`p-3 rounded-md cursor-pointer border ${
                            selectedGroup === group.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-zinc-50 border-zinc-200'
                          }`}
                          onClick={() => setSelectedGroup(group.id)}
                        >
                          <div className="flex items-center">
                            <span className="material-icons text-blue-600 mr-2">groups</span>
                            <div>
                              <p className="font-medium text-sm">{group.name}</p>
                              {group.description && (
                                <p className="text-xs text-zinc-500">{group.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredGroups.length === 0 && (
                        <div className="text-center py-4 text-zinc-500">
                          Nenhum grupo encontrado.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedGroup 
                      ? `Permissões: ${
                          groups?.find((g: any) => g.id === selectedGroup)?.name || 'Grupo Selecionado'
                        }` 
                      : 'Selecione um grupo para ver suas permissões'}
                  </h3>
                  
                  {!selectedGroup ? (
                    <div className="text-center py-12 text-zinc-500">
                      <span className="material-icons text-4xl mb-2">touch_app</span>
                      <p>Selecione um grupo na lista à esquerda para ver suas permissões.</p>
                    </div>
                  ) : isLoadingGroupPermissions ? (
                    <div className="text-center py-8">Carregando permissões...</div>
                  ) : (
                    <PermissionTable 
                      permissions={groupPermissions || []}
                      certificates={certificates || []}
                      onUpdatePermission={handleUpdatePermission}
                      emptyMessage="Este grupo não possui permissões atribuídas."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Permissions;
