import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Certificate } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  PlusCircle, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  Users, 
  FileCheck 
} from "lucide-react";
import CertificateForm from "@/components/certificates/CertificateForm";
import DeleteConfirmation from "@/components/certificates/DeleteConfirmation";
import PolicyAssignment from "@/components/certificates/PolicyAssignment";

export default function Certificates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | undefined>(undefined);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["/api/certificates"],
    queryFn: () => fetch("/api/certificates").then((res) => res.json()),
  });

  const handleDelete = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedCertificate(undefined);
    setIsFormOpen(true);
  };
  
  const handleManagePolicies = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsPolicyDialogOpen(true);
  };

  const filteredCertificates = certificates?.filter((cert: Certificate) =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Certificados</h1>
        <p className="text-slate-600 mt-1">
          Gerencie os certificados armazenados na plataforma
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>
            Total de certificados: {certificates?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Buscar certificados..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Certificado
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <p>Carregando certificados...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Data de Emissão</TableHead>
                  <TableHead>Data de Expiração</TableHead>
                  <TableHead>Ações Permitidas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates?.map((cert: Certificate) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.name}</TableCell>
                    <TableCell>
                      <Badge className={`px-2 py-1 ${
                        cert.type === "A1"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                      }`}>
                        {cert.type === "A1" 
                          ? "A1 - Software" 
                          : "A3 - Hardware"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cert.entityType ? (
                        <Badge className={`px-2 py-1 ${
                          cert.entityType === "PF"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }`}>
                          {cert.entityType === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(cert.issuedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          new Date(cert.expiresAt) > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            ? "bg-green-500" // Mais de 30 dias para expirar
                            : new Date(cert.expiresAt) > new Date()
                              ? "bg-amber-500" // Menos de 30 dias para expirar
                              : "bg-red-500" // Expirado
                        }`} />
                        {formatDate(cert.expiresAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cert.allowedActions.map((action, idx) => (
                          <Badge key={idx} variant="outline">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(cert)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar certificado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManagePolicies(cert)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Gerenciar políticas
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Gerenciar grupos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Ver histórico de uso
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(cert)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir certificado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCertificates?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhum certificado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Modais */}
      {isFormOpen && (
        <CertificateForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          certificate={selectedCertificate}
        />
      )}
      
      {isDeleteDialogOpen && selectedCertificate && (
        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          certificate={selectedCertificate}
        />
      )}
      
      {isPolicyDialogOpen && selectedCertificate && (
        <PolicyAssignment
          isOpen={isPolicyDialogOpen}
          onClose={() => setIsPolicyDialogOpen(false)}
          certificate={selectedCertificate}
        />
      )}
    </MainLayout>
  );
}
