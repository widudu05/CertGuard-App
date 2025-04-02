import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CertificateWithRestrictions } from "@/types";
import { formatDate, calculateDaysRemaining, getExpirationStatus, getExpirationStatusColor } from "@/lib/utils";

interface CertificateTableProps {
  certificates: CertificateWithRestrictions[];
  total: number;
  onEdit: (certificate: CertificateWithRestrictions) => void;
  onView: (certificate: CertificateWithRestrictions) => void;
  onRefresh?: (certificate: CertificateWithRestrictions) => void;
}

const CertificateTable: React.FC<CertificateTableProps> = ({
  certificates,
  total,
  onEdit,
  onView,
  onRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="w-[300px]">Certificado</TableHead>
              <TableHead>Emitido para</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Restrições</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((cert) => {
              const daysRemaining = calculateDaysRemaining(cert.expireAt);
              const statusColorClass = getExpirationStatusColor(daysRemaining);
              const expirationText = getExpirationStatus(daysRemaining);
              
              return (
                <TableRow key={cert.id} className="hover:bg-zinc-50">
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-700">
                        <AvatarFallback className="material-icons">description</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-zinc-900">{cert.name}</div>
                        <div className="text-xs text-zinc-500 font-mono">{cert.fingerprint}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-900">{cert.issuedTo}</div>
                    <div className="text-xs text-zinc-500">{cert.issuedToEmail}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2 rounded-full ${
                        cert.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cert.status === "active" ? "Ativo" : "Expirado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-900">{formatDate(cert.expireAt)}</div>
                    <div className={`text-xs ${statusColorClass}`}>{expirationText}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {cert.urlRestrictions > 0 && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          URLs: {cert.urlRestrictions}
                        </Badge>
                      )}
                      {cert.timeRestrictions > 0 && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          Horários: {cert.timeRestrictions}
                        </Badge>
                      )}
                      {cert.groupRestrictions > 0 && (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          Grupos: {cert.groupRestrictions}
                        </Badge>
                      )}
                      {cert.actions > 0 && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Ações: {cert.actions}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(cert)}
                      >
                        <span className="material-icons text-zinc-600">edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(cert)}
                      >
                        <span className="material-icons text-zinc-600">visibility</span>
                      </Button>
                      {cert.status === "expired" && onRefresh && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRefresh(cert)}
                        >
                          <span className="material-icons text-zinc-600">refresh</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <span className="material-icons text-zinc-600">more_vert</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="px-6 py-3 border-t border-zinc-200 flex items-center justify-between">
        <div className="text-sm text-zinc-700">
          Mostrando {certificates.length} de {total} certificados
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </Button>
          
          {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
            const pageNumber = currentPage <= 2 
              ? index + 1 
              : currentPage === totalPages 
                ? totalPages - 2 + index 
                : currentPage - 1 + index;
            
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateTable;
