import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import ScheduleForm from "@/components/schedules/ScheduleForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  weekDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  startTime: string;
  endTime: string;
  userGroupId?: number;
}

export default function Schedules() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>(undefined);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch schedules
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["/api/schedules"],
    queryFn: () => {
      // Se não existir ainda uma API de agendamentos, use políticas como mock temporário
      return fetch("/api/access-policies")
        .then((res) => res.json())
        .then((policies) => 
          // Transformar políticas em formato de agendamentos
          policies
            .filter((policy: any) => policy.accessHours)
            .map((policy: any) => ({
              id: policy.id,
              name: policy.name,
              description: policy.description,
              isActive: true,
              startDate: new Date().toISOString(),
              weekDays: {
                monday: policy.accessHours.workDays,
                tuesday: policy.accessHours.workDays,
                wednesday: policy.accessHours.workDays,
                thursday: policy.accessHours.workDays,
                friday: policy.accessHours.workDays,
                saturday: policy.accessHours.weekend,
                sunday: policy.accessHours.weekend
              },
              startTime: policy.accessHours.startTime,
              endTime: policy.accessHours.endTime,
              userGroupId: 1 // Valor padrão para exemplo
            }))
        );
    }
  });

  const filteredSchedules = schedules?.filter((schedule: Schedule) =>
    schedule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formattedDate = date
    ? format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "";
    
  // Handlers
  const handleAddSchedule = () => {
    setSelectedSchedule(undefined);
    setIsScheduleFormOpen(true);
  };
  
  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsScheduleFormOpen(true);
  };
  
  const handleDeleteSchedule = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteDialogOpen(true);
  };
  
  // Mutation para excluir agendamento
  const deleteMutation = useMutation({
    mutationFn: async (scheduleId: number) => {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Falha ao excluir o agendamento");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });
      
      setScheduleToDelete(undefined);
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao excluir o agendamento. ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Agendamentos de Acesso</h1>
        <p className="text-slate-600 mt-1">
          Defina janelas de tempo para o uso de certificados
        </p>
      </div>
      
      {/* Form de agendamento */}
      {isScheduleFormOpen && (
        <ScheduleForm
          isOpen={isScheduleFormOpen}
          onClose={() => setIsScheduleFormOpen(false)}
          schedule={selectedSchedule}
        />
      )}
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o agendamento "{scheduleToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => scheduleToDelete && deleteMutation.mutate(scheduleToDelete.id)}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  <Button onClick={handleAddSchedule}>Novo Agendamento</Button>
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
                    filteredSchedules.map((schedule: Schedule) => (
                      <ScheduleCard 
                        key={schedule.id} 
                        schedule={schedule} 
                        onEdit={handleEditSchedule}
                        onDelete={handleDeleteSchedule}
                      />
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

                <Button className="w-full" variant="outline" onClick={handleAddSchedule}>Criar Novo Horário</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
