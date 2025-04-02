import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AuditLogTableProps {
  logs: any[];
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  // Format timestamp to a readable date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };
  
  // Get appropriate badge color based on action type
  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'VIEW':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-zinc-100 text-zinc-800';
    }
  };
  
  // Format details object as a readable string
  const formatDetails = (details: any) => {
    if (!details) return '—';
    
    try {
      if (typeof details === 'string') {
        return details;
      }
      
      return Object.entries(details)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    } catch (error) {
      return JSON.stringify(details);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Recurso</TableHead>
            <TableHead>Detalhes</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-zinc-50">
              <TableCell className="whitespace-nowrap">
                {formatDateTime(log.timestamp)}
              </TableCell>
              <TableCell>
                {log.userId ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      U{log.userId}
                    </div>
                    <span>Usuário #{log.userId}</span>
                  </div>
                ) : (
                  <span className="text-zinc-500">Sistema</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getActionColor(log.action)}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span>{log.resourceType}</span>
                  {log.resourceId && (
                    <span className="text-xs text-zinc-500">#{log.resourceId}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {formatDetails(log.details)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {log.ipAddress || '—'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log('View log details:', log);
                  }}
                >
                  <span className="material-icons text-zinc-600">visibility</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum log de auditoria encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
