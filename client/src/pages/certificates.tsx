import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CertificateTable from "@/components/certificates/certificate-table";
import AddCertificateDialog from "@/components/certificates/add-certificate-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CertificateWithRestrictions } from "@/types";

const Certificates = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [addCertificateOpen, setAddCertificateOpen] = useState(false);
  
  // Fetch all certificates
  const { 
    data: certificates, 
    isLoading,
    refetch: refetchCertificates
  } = useQuery({
    queryKey: ['/api/certificates'],
    staleTime: 30 * 1000, // 30 seconds
  });
  
  // Prepare certificates data with restrictions count
  const processedCertificates: CertificateWithRestrictions[] = certificates?.map((cert: any) => ({
    ...cert,
    expireAt: new Date(cert.expireAt),
    createdAt: new Date(cert.createdAt),
    // In a real app, these counts would come from the API
    urlRestrictions: Math.floor(Math.random() * 5),
    timeRestrictions: Math.floor(Math.random() * 3),
    groupRestrictions: Math.floor(Math.random() * 4),
    actions: Math.floor(Math.random() * 6),
  })) || [];
  
  // Filter certificates by search term
  const filteredCertificates = processedCertificates.filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuedToEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.fingerprint.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditCertificate = (certificate: CertificateWithRestrictions) => {
    toast({
      title: "Editar certificado",
      description: `Edição do certificado ${certificate.name} não implementada neste MVP.`
    });
  };
  
  const handleViewCertificate = (certificate: CertificateWithRestrictions) => {
    toast({
      title: "Visualizar certificado",
      description: `Visualização do certificado ${certificate.name} não implementada neste MVP.`
    });
  };
  
  const handleRefreshCertificate = (certificate: CertificateWithRestrictions) => {
    toast({
      title: "Renovar certificado",
      description: `Renovação do certificado ${certificate.name} não implementada neste MVP.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Certificados</h1>
        <Button onClick={() => setAddCertificateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Certificado
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar por nome, destinatário ou fingerprint..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            Filtros
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando certificados...</div>
      ) : (
        <CertificateTable
          certificates={filteredCertificates}
          total={filteredCertificates.length}
          onEdit={handleEditCertificate}
          onView={handleViewCertificate}
          onRefresh={handleRefreshCertificate}
        />
      )}

      <AddCertificateDialog
        open={addCertificateOpen}
        onOpenChange={setAddCertificateOpen}
        onSuccess={refetchCertificates}
      />
    </div>
  );
};

export default Certificates;
