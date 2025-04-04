import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import StatusCard from "@/components/dashboard/StatusCard";
import StatusCardDialog from "@/components/dashboard/StatusCardDialog";
import SecurityFeatures from "@/components/dashboard/SecurityFeatures";
import RecentActivity from "@/components/dashboard/RecentActivity";
import CertificateQuickAdd from "@/components/dashboard/CertificateQuickAdd";
import SecurityMetrics from "@/components/dashboard/SecurityMetrics";
import { StatusCardProps } from "@/lib/types";

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"certificates" | "groups" | "policies" | "blocked">("certificates");
  const [dialogTitle, setDialogTitle] = useState("");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  const handleCardClick = (type: "certificates" | "groups" | "policies" | "blocked", title: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  // Fallback data if API isn't available yet
  const statusCards: StatusCardProps[] = [
    {
      icon: "fa-certificate",
      title: "Certificados Ativos",
      value: stats?.activeCertificates || 128,
      color: "primary",
      trend: "12% em relação ao mês anterior",
      trendDirection: "up",
      onClick: () => handleCardClick("certificates", "Certificados Ativos"),
    },
    {
      icon: "fa-users",
      title: "Grupos de Usuários",
      value: stats?.activeGroups || 24,
      color: "secondary",
      trend: "4 grupos adicionados recentemente",
      trendDirection: "up",
      onClick: () => handleCardClick("groups", "Grupos de Usuários"),
    },
    {
      icon: "fa-shield-halved",
      title: "Restrições Ativas",
      value: stats?.restrictionsCount || 56,
      color: "amber",
      trend: "3 novas restrições pendentes",
      trendDirection: "warning",
      onClick: () => handleCardClick("policies", "Restrições Ativas"),
    },
    {
      icon: "fa-clock",
      title: "Acessos Bloqueados",
      value: stats?.blockedAccess || 17,
      color: "red",
      trend: "5 nas últimas 24 horas",
      trendDirection: "up",
      onClick: () => handleCardClick("blocked", "Acessos Bloqueados"),
    },
  ];

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">CertGuard - Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Configure as políticas de segurança e controle de acesso aos certificados
        </p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>

      {/* Main Section */}
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
        {/* Security Features Column */}
        <div className="xl:col-span-2 space-y-8">
          <SecurityFeatures />
          <RecentActivity />
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-8">
          <CertificateQuickAdd />
          <SecurityMetrics />
        </div>
      </div>

      {/* Status Card Dialog */}
      <StatusCardDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        title={dialogTitle} 
        type={dialogType}
      />
    </MainLayout>
  );
}
