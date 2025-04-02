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
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ScheduleCard from "@/components/dashboard/ScheduleCard";

export default function Schedules() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // In a real app, fetch schedules from the API
  const { data: policies, isLoading } = useQuery({
    queryKey: ["/api/access-policies"],
    queryFn: () => fetch("/api/access-policies").then((res) => res.json()),
  });

  // Mock schedules data based on access policies
  const schedules = policies?.filter((policy: any) => policy.accessHours);

  const filteredSchedules = schedules?.filter((schedule: any) =>
    schedule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formattedDate = date
    ? format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "";

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Agendamentos de Acesso</h1>
        <p className="text-slate-600 mt-1">
          Defina janelas de tempo para o uso de certificados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Agendamentos</CardTitle>
                  <CardDescription>
                    Total de agendamentos: {schedules?.length || 0}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Buscar agendamentos..."
                    className="w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button>Novo Agendamento</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Agendamentos Ativos</TabsTrigger>
                  <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                  <TabsTrigger value="expired">Expirados</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="space-y-4">
                  {isLoading ? (
                    <div className="text-center p-8">Carregando agendamentos...</div>
                  ) : filteredSchedules?.length > 0 ? (
                    filteredSchedules.map((schedule: any) => (
                      <ScheduleCard key={schedule.id} schedule={schedule} />
                    ))
                  ) : (
                    <div className="text-center p-8 text-slate-500">
                      Nenhum agendamento ativo encontrado
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="upcoming">
                  <div className="text-center p-8 text-slate-500">
                    Não há agendamentos programados para iniciar em breve
                  </div>
                </TabsContent>
                <TabsContent value="expired">
                  <div className="text-center p-8 text-slate-500">
                    Não há agendamentos expirados
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>
                {formattedDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={ptBR}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários Padrão</CardTitle>
              <CardDescription>
                Períodos comuns configurados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-blue-800">Horário Comercial</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Padrão</Badge>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    <div className="bg-blue-100 text-blue-800 rounded p-1">Seg</div>
                    <div className="bg-blue-100 text-blue-800 rounded p-1">Ter</div>
                    <div className="bg-blue-100 text-blue-800 rounded p-1">Qua</div>
                    <div className="bg-blue-100 text-blue-800 rounded p-1">Qui</div>
                    <div className="bg-blue-100 text-blue-800 rounded p-1">Sex</div>
                    <div className="bg-slate-100 text-slate-400 rounded p-1">Sáb</div>
                    <div className="bg-slate-100 text-slate-400 rounded p-1">Dom</div>
                  </div>
                  <div className="text-sm text-blue-800">08:00 - 18:00</div>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-purple-800">Acesso 24/7</h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">Administradores</Badge>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    <div className="bg-purple-100 text-purple-800 rounded p-1">Seg</div>
                    <div className="bg-purple-100 text-purple-800 rounded p-1">Ter</div>
                    <div className="bg-purple-100 text-purple-800 rounded p-1">Qua</div>
                    <div className="bg-purple-100 text-purple-800 rounded p-1">Qui</div>
                    <div className="bg-purple-100 text-purple-800 rounded p-1">Sex</div>
                    <div className="bg-purple-100 text-purple-800 rounded p-1">Sáb</div>
                    <div className="bg-purple-100 text-purple-800 rounded p-1">Dom</div>
                  </div>
                  <div className="text-sm text-purple-800">00:00 - 23:59</div>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-amber-800">Horário Estendido</h3>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">Desenvolvedores</Badge>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    <div className="bg-amber-100 text-amber-800 rounded p-1">Seg</div>
                    <div className="bg-amber-100 text-amber-800 rounded p-1">Ter</div>
                    <div className="bg-amber-100 text-amber-800 rounded p-1">Qua</div>
                    <div className="bg-amber-100 text-amber-800 rounded p-1">Qui</div>
                    <div className="bg-amber-100 text-amber-800 rounded p-1">Sex</div>
                    <div className="bg-amber-100 text-amber-800 rounded p-1">Sáb</div>
                    <div className="bg-slate-100 text-slate-400 rounded p-1">Dom</div>
                  </div>
                  <div className="text-sm text-amber-800">07:00 - 22:00</div>
                </div>

                <Button className="w-full" variant="outline">Criar Novo Horário</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
