import { formatTimeAgo, getStatusColor } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuditLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  filterType: string;
}

export default function AuditLogTable({ logs, isLoading, filterType }: AuditLogTableProps) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  
  // Filter logs by status if a filter is selected
  const filteredLogs = filterType === "all" 
    ? logs 
    : logs?.filter((log: AuditLog) => 
        log.status.toLowerCase() === filterType.toLowerCase()
      );
  
  // Calculate total pages
  const totalPages = filteredLogs ? Math.ceil(filteredLogs.length / rowsPerPage) : 0;
  
  // Get current page logs
  const currentLogs = filteredLogs?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePreviousPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Carregando logs de auditoria...</p>
      </div>
    );
  }

  if (!currentLogs?.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Nenhum registro de auditoria encontrado</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Certificado</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentLogs.map((log) => (
            <TableRow key={log.id} className="hover:bg-slate-50">
              <TableCell className="py-4">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {log.userId ? log.userId.toString().substring(0, 2).toUpperCase() : "UN"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {log.userId ? `Usuário #${log.userId}` : "Sistema"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {log.userId ? (log.userId === 1 ? "Administrador" : log.userId === 2 ? "Desenvolvedor" : "Financeiro") : "Automático"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{log.action}</div>
                {log.details && (
                  <div className="text-xs text-slate-500">
                    {Object.values(log.details)[0]}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {log.certificateId ? `Cert #${log.certificateId}` : "N/A"}
              </TableCell>
              <TableCell>
                {formatTimeAgo(log.timestamp)}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    log.status
                  )}`}
                >
                  {log.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
        <div>
          <p className="text-sm text-slate-700">
            Mostrando <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(page * rowsPerPage, filteredLogs?.length || 0)}
            </span>{" "}
            de <span className="font-medium">{filteredLogs?.length || 0}</span> resultados
          </p>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            <span className="sr-only">Anterior</span>
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </Button>
          
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx}
              variant={page === idx + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(idx + 1)}
              className={page === idx + 1 ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : ""}
            >
              {idx + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            <span className="sr-only">Próximo</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </Button>
        </div>
      </div>
    </>
  );
}
