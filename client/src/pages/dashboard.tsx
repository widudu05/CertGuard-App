import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/ui/stat-card";
import FeatureCard from "@/components/ui/feature-card";
import CertificateTable from "@/components/certificates/certificate-table";
import AddCertificateDialog from "@/components/certificates/add-certificate-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SecurityFeature, CertificateWithRestrictions } from "@/types";

const securityFeatures: SecurityFeature[] = [
  {
    id: "user-groups",
    title: "Por grupos de usuários",
    description: "Gerencie o acesso dos certificados com base em grupos de usuários definidos.",
    icon: "groups",
    color: "text-blue-600",
    iconBackgroundColor: "bg-blue-50",
    benefits: [
      "Controle granular por equipe",
      "Permissões hierárquicas",
      "Herança de permissões"
    ],
    buttonText: "Configurar Grupos"
  },
  {
    id: "sensitive-info",
    title: "Bloqueio a informações sensíveis",
    description: "Restrinja o acesso a dados confidenciais com controles de segurança avançados.",
    icon: "block",
    color: "text-red-600",
    iconBackgroundColor: "bg-red-50",
    benefits: [
      "Mascaramento de dados",
      "Registro de acesso",
      "Alerta de violação"
    ],
    buttonText: "Definir Regras"
  },
  {
    id: "systems-pages",
    title: "Sistemas e páginas acessadas",
    description: "Controle quais sistemas e páginas podem ser acessados com cada certificado.",
    icon: "web",
    color: "text-blue-600",
    iconBackgroundColor: "bg-blue-50",
    benefits: [
      "Controle por aplicação",
      "Restrições por rota",
      "Monitoramento em tempo real"
    ],
    buttonText: "Mapear Acessos"
  },
  {
    id: "url-restrictions",
    title: "Restrição por URLs",
    description: "Limite o acesso a URLs específicas baseadas em padrões ou domínios exatos.",
    icon: "link",
    color: "text-purple-600",
    iconBackgroundColor: "bg-purple-50",
    benefits: [
      "Whitelist de domínios",
      "Bloqueio por padrão regex",
      "Filtro de parâmetros de URL"
    ],
    buttonText: "Configurar URLs"
  },
  {
    id: "certificate-actions",
    title: "Ações com o certificado",
    description: "Defina quais ações podem ser executadas com cada certificado emitido.",
    icon: "assignment",
    color: "text-green-600",
    iconBackgroundColor: "bg-green-50",
    benefits: [
      "Assinatura de documentos",
      "Autenticação em sistemas",
      "Regras de automação"
    ],
    buttonText: "Gerenciar Ações"
  },
  {
    id: "time-restrictions",
    title: "Horários de acesso",
    description: "Defina janelas de tempo específicas para o uso de certificados.",
    icon: "schedule",
    color: "text-amber-600",
    iconBackgroundColor: "bg-amber-50",
    benefits: [
      "Restrição por hora do dia",
      "Calendário de permissões",
      "Fusos horários personalizados"
    ],
    buttonText: "Definir Horários"
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [addCertificateOpen, setAddCertificateOpen] = useState(false);
  
  // Fetch dashboard statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Fetch recent certificates
  const { 
    data: recentCertificates, 
    isLoading: isLoadingCertificates,
    refetch: refetchCertificates
  } = useQuery({
    queryKey: ['/api/certificates/recent'],
    staleTime: 30 * 1000, // 30 seconds
  });
  
  // Prepare certificates data with restrictions count
  const processedCertificates: CertificateWithRestrictions[] = recentCertificates?.map((cert: any) => ({
    ...cert,
    expireAt: new Date(cert.expireAt),
    createdAt: new Date(cert.createdAt),
    // In a real app, these counts would come from the API
    urlRestrictions: Math.floor(Math.random() * 5),
    timeRestrictions: Math.floor(Math.random() * 3),
    groupRestrictions: Math.floor(Math.random() * 4),
    actions: Math.floor(Math.random() * 6),
  })) || [];
  
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
  
  const handleFeatureClick = (featureId: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `A funcionalidade "${featureId}" será implementada em uma próxima versão.`
    });
  };

  return (
    <div>
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total de Certificados"
          value={isLoadingStats ? "-" : stats?.certificatesCount || 0}
          icon="description"
          iconBackgroundColor="bg-blue-100"
          iconColor="text-blue-600"
          changeValue="12%"
          changeLabel="desde o último mês"
          changeDirection="up"
        />
        
        <StatCard
          title="Grupos de Usuários"
          value={isLoadingStats ? "-" : stats?.groupsCount || 0}
          icon="groups"
          iconBackgroundColor="bg-blue-100"
          iconColor="text-blue-600"
          changeValue="4%"
          changeLabel="desde o último mês"
          changeDirection="up"
        />
        
        <StatCard
          title="Certificados Expirados"
          value={isLoadingStats ? "-" : stats?.expiredCertificatesCount || 0}
          icon="gpp_bad"
          iconBackgroundColor="bg-red-100"
          iconColor="text-red-600"
          changeValue="2"
          changeLabel="desde a semana passada"
          changeDirection="up"
        />
        
        <StatCard
          title="Restrições Ativas"
          value={isLoadingStats ? "-" : stats?.urlRestrictionsCount || 0}
          icon="block"
          iconBackgroundColor="bg-amber-100"
          iconColor="text-amber-600"
          changeValue="Estável"
          changeLabel="sem alterações"
          changeDirection="neutral"
        />
      </div>

      {/* Security Features Grid */}
      <h2 className="text-xl font-semibold mb-4 text-zinc-900">Recursos de Segurança</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {securityFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            iconBackgroundColor={feature.iconBackgroundColor}
            iconColor={feature.color}
            benefits={feature.benefits}
            buttonText={feature.buttonText}
            onClick={() => handleFeatureClick(feature.id)}
          />
        ))}
      </div>

      {/* Certificate Management Section */}
      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-xl font-semibold text-zinc-900">Certificados Recentes</h2>
        <Button onClick={() => setAddCertificateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Certificado
        </Button>
      </div>

      {/* Certificate Table */}
      {isLoadingCertificates ? (
        <div className="text-center py-8">Carregando certificados...</div>
      ) : (
        <CertificateTable
          certificates={processedCertificates}
          total={stats?.certificatesCount || processedCertificates.length}
          onEdit={handleEditCertificate}
          onView={handleViewCertificate}
          onRefresh={handleRefreshCertificate}
        />
      )}

      {/* Add Certificate Dialog */}
      <AddCertificateDialog
        open={addCertificateOpen}
        onOpenChange={setAddCertificateOpen}
        onSuccess={refetchCertificates}
      />
    </div>
  );
};

export default Dashboard;
