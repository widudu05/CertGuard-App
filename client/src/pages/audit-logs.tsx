import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuditLogTable from "@/components/audit/AuditLogTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AuditLogs() {
  const [timeRange, setTimeRange] = useState("7d");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
    queryFn: () => fetch("/api/audit-logs").then((res) => res.json()),
  });

  // Filter logs based on the search query
  const filteredLogs = logs?.filter(
    (log: any) =>
      (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.status && log.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group logs by status for the chart
  const statusCounts = logs?.reduce((acc: any, log: any) => {
    acc[log.status] = (acc[log.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = statusCounts
    ? Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      }))
    : [];

  const getBarColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "permitido":
        return "#22c55e"; // green-500
      case "bloqueado":
        return "#ef4444"; // red-500
      default:
        return "#3b82f6"; // blue-500
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Logs de Auditoria</h1>
        <p className="text-slate-600 mt-1">
          Monitore e analise todas as atividades relacionadas aos certificados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estatísticas de Acesso</CardTitle>
            <CardDescription>
              Visão geral dos acessos por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>
              Resumo das atividades recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2 text-slate-500">
                  Distribuição por Status
                </h3>
                <div className="space-y-2">
                  {chartData.map((item: any) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getBarColor(item.status) }}
                        ></div>
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 text-slate-500">
                  Período
                </h3>
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Últimas 24 horas</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Exportar Relatório</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle>Registros de Auditoria</CardTitle>
              <CardDescription>
                Total de registros: {logs?.length || 0}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Buscar logs..."
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                value={filterType}
                onValueChange={setFilterType}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="permitido">Permitidos</SelectItem>
                  <SelectItem value="bloqueado">Bloqueados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AuditLogTable 
            logs={filteredLogs}
            isLoading={isLoading}
            filterType={filterType}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
