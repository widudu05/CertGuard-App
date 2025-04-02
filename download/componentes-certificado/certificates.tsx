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
import { Search, PlusCircle } from "lucide-react";
import CertificateForm from "@/components/certificates/CertificateForm";
import DeleteConfirmation from "@/components/certificates/DeleteConfirmation";

export default function Certificates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
                    <TableCell>{cert.type}</TableCell>
                    <TableCell>{formatDate(cert.issuedAt)}</TableCell>
                    <TableCell>{formatDate(cert.expiresAt)}</TableCell>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(cert)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(cert)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCertificates?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum certificado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Modal do Formulário */}
      {isFormOpen && (
        <CertificateForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          certificate={selectedCertificate}
        />
      )}
      
      {/* Modal de Confirmação de Exclusão */}
      {isDeleteDialogOpen && selectedCertificate && (
        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          certificate={selectedCertificate}
        />
      )}
    </MainLayout>
  );
}
