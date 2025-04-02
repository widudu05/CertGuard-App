import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RecentActivityItem } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials, getStatusColor, formatTimeAgo } from "@/lib/utils";

export default function RecentActivity() {
  const [timeRange, setTimeRange] = useState("24h");

  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
    queryFn: () => fetch("/api/audit-logs").then((res) => res.json()),
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-800 text-lg">Atividade Recente</h2>
          <p className="text-sm text-slate-600">Últimos acessos e alterações nos certificados</p>
        </div>
        <div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <p>Carregando atividades recentes...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Certificado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {activityLogs?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {getInitials(log.user?.fullName || "Usuário")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900">
                          {log.user?.fullName || "Usuário"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {log.user?.role || ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{log.action}</div>
                    <div className="text-xs text-slate-500">
                      {log.details ? Object.values(log.details)[0] : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {log.certificate?.name || `Cert #${log.certificateId}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatTimeAgo(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
        <div>
          <p className="text-sm text-slate-700">
            Mostrando <span className="font-medium">1</span> a{" "}
            <span className="font-medium">4</span> de{" "}
            <span className="font-medium">15</span> resultados
          </p>
        </div>
        <div className="flex space-x-1">
          <button className="px-2 py-1 text-sm border border-slate-300 rounded bg-white text-slate-500 hover:bg-slate-50">
            <span className="sr-only">Anterior</span>
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button className="px-3 py-1 text-sm border border-slate-300 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">1</button>
          <button className="px-3 py-1 text-sm border border-slate-300 rounded bg-white text-slate-500 hover:bg-slate-50">2</button>
          <button className="px-3 py-1 text-sm border border-slate-300 rounded bg-white text-slate-500 hover:bg-slate-50">3</button>
          <button className="px-3 py-1 text-sm border border-slate-300 rounded bg-white text-slate-500">...</button>
          <button className="px-2 py-1 text-sm border border-slate-300 rounded bg-white text-slate-500 hover:bg-slate-50">
            <span className="sr-only">Próximo</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
