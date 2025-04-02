import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Download } from "lucide-react";
import AuditLogTable from "@/components/audit/audit-log-table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuditLogs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  
  // Fetch audit logs
  const { 
    data: auditLogs, 
    isLoading
  } = useQuery({
    queryKey: ['/api/audit-logs'],
    staleTime: 15 * 1000, // 15 seconds
  });
  
  // Filter logs by search term and filters
  const filteredLogs = auditLogs?.filter((log: any) => {
    const matchesSearch = 
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ipAddress && log.ipAddress.includes(searchTerm));
      
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesResource = resourceFilter === "all" || log.resourceType === resourceFilter;
    
    return matchesSearch && matchesAction && matchesResource;
  }) || [];
  
  // Get unique actions for filtering
  const actions = auditLogs ? Array.from(new Set(auditLogs.map((log: any) => log.action))) : [];
  
  // Get unique resource types for filtering
  const resourceTypes = auditLogs ? Array.from(new Set(auditLogs.map((log: any) => log.resourceType))) : [];
  
  const handleExportLogs = () => {
    toast({
      title: "Exportar logs",
      description: "A funcionalidade de exportação será implementada em versões futuras."
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logs de Auditoria</h1>
        <Button variant="outline" onClick={handleExportLogs}>
          <Download className="h-4 w-4 mr-1" /> Exportar Logs
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar por ação, recurso, IP..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="w-full md:w-40">
                <Select 
                  value={actionFilter}
                  onValueChange={setActionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as ações</SelectItem>
                    {actions.map((action: string) => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-40">
                <Select 
                  value={resourceFilter}
                  onValueChange={setResourceFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Recurso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os recursos</SelectItem>
                    {resourceTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="px-3">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-8">Carregando logs de auditoria...</div>
      ) : (
        <AuditLogTable logs={filteredLogs} />
      )}
    </div>
  );
};

export default AuditLogs;
