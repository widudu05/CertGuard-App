import { useQuery } from "@tanstack/react-query";
import { SecurityMetric, SecurityRecommendation } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { ExclamationTriangleIcon, InfoIcon } from "lucide-react";

const securityMetrics: SecurityMetric[] = [
  {
    name: "Certificados Expirados",
    value: 5,
    label: "3",
    color: "red",
  },
  {
    name: "Autenticação MFA",
    value: 67,
    label: "67%",
    color: "amber",
  },
  {
    name: "Políticas Definidas",
    value: 95,
    label: "95%",
    color: "green",
  },
  {
    name: "Tentativas Bloqueadas",
    value: 100,
    label: "100%",
    color: "green",
  },
];

const recommendations: SecurityRecommendation[] = [
  {
    type: "warning",
    text: "Renove 3 certificados que expirarão nos próximos 30 dias",
  },
  {
    type: "warning",
    text: "Ative MFA para todos os administradores de sistema",
  },
  {
    type: "info",
    text: "Revise as políticas de acesso de grupos não utilizados",
  },
];

export default function SecurityMetrics() {
  // In a real app, this would fetch actual security metrics
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  const getColorForValue = (value: number, metricColor: string) => {
    switch (metricColor) {
      case "red":
        return "bg-red-500";
      case "amber":
        return "bg-amber-500";
      case "green":
        return "bg-green-500";
      case "primary":
        return "bg-primary-500";
      case "secondary":
        return "bg-secondary-500";
      default:
        return "bg-slate-500";
    }
  };

  const getMetricBadgeColor = (metricColor: string) => {
    switch (metricColor) {
      case "red":
        return "bg-red-100 text-red-800";
      case "amber":
        return "bg-amber-100 text-amber-800";
      case "green":
        return "bg-green-100 text-green-800";
      case "primary":
        return "bg-primary-100 text-primary-800";
      case "secondary":
        return "bg-secondary-100 text-secondary-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800 text-lg">Métricas de Segurança</h2>
        <p className="text-sm text-slate-600">Visão geral da postura de segurança</p>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Índice de Segurança</span>
            <span className="text-sm font-semibold text-green-600">82/100</span>
          </div>
          <Progress value={82} className="h-2.5" />
          <p className="mt-2 text-xs text-slate-500">
            Sua pontuação de segurança está boa, mas pode melhorar.
          </p>
        </div>

        <div className="space-y-4">
          {securityMetrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getMetricBadgeColor(metric.color)}`}>
                  {metric.label}
                </span>
              </div>
              <Progress
                value={metric.value}
                className={`h-1.5 ${
                  metric.value < 50 ? "bg-slate-200" : "bg-slate-200"
                }`}
                indicatorClassName={getColorForValue(metric.value, metric.color)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Recomendações</h3>
          <ul className="space-y-2 text-xs">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                {rec.type === "warning" ? (
                  <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-500 mt-0.5 mr-2" />
                ) : (
                  <InfoIcon className="h-3.5 w-3.5 text-primary-500 mt-0.5 mr-2" />
                )}
                <span>{rec.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <a
            href="#"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            <span>Ver relatório completo</span>
            <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
