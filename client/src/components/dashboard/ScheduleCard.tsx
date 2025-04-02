import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, UserCheck, Calendar, ArrowRight } from "lucide-react";

interface ScheduleCardProps {
  schedule: {
    id: number;
    name: string;
    description?: string;
    isActive?: boolean;
    weekDays?: {
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
    accessHours?: {
      workDays: boolean;
      weekend: boolean;
      startTime: string;
      endTime: string;
    };
    userGroupId?: number;
  };
  onEdit?: (schedule: any) => void;
  onDelete?: (schedule: any) => void;
}

export default function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  const getDaysLabel = () => {
    // Verificar primeiro se temos o novo formato de weekDays
    if (schedule.weekDays) {
      const days = [];
      if (schedule.weekDays.monday) days.push("Seg");
      if (schedule.weekDays.tuesday) days.push("Ter");
      if (schedule.weekDays.wednesday) days.push("Qua");
      if (schedule.weekDays.thursday) days.push("Qui");
      if (schedule.weekDays.friday) days.push("Sex");
      if (schedule.weekDays.saturday) days.push("Sáb");
      if (schedule.weekDays.sunday) days.push("Dom");
      
      if (days.length === 7) return "Todos os dias";
      if (days.length === 0) return "Nenhum dia selecionado";
      if (days.length === 5 && !schedule.weekDays.saturday && !schedule.weekDays.sunday) 
        return "Segunda a Sexta";
      if (days.length === 2 && schedule.weekDays.saturday && schedule.weekDays.sunday) 
        return "Sábado e Domingo";
      
      return days.join(", ");
    } 
    
    // Formato legado com accessHours
    if (schedule.accessHours) {
      if (schedule.accessHours.workDays && schedule.accessHours.weekend) {
        return "Todos os dias";
      } else if (schedule.accessHours.workDays) {
        return "Segunda a Sexta";
      } else if (schedule.accessHours.weekend) {
        return "Sábado e Domingo";
      }
    }
    
    return "Nenhum dia selecionado";
  };

  // Determinar o horário correto
  const startTime = schedule.startTime || (schedule.accessHours?.startTime || "00:00");
  const endTime = schedule.endTime || (schedule.accessHours?.endTime || "23:59");
  
  // Determinar status ativo
  const isActive = schedule.isActive !== undefined 
    ? schedule.isActive 
    : (schedule.accessHours?.workDays || schedule.accessHours?.weekend || true);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{schedule.name}</CardTitle>
            <CardDescription>{schedule.description}</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-slate-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Horário</p>
              <p className="text-sm text-slate-500">
                {startTime} <ArrowRight className="h-3 w-3 inline mx-1" /> {endTime}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-slate-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Dias</p>
              <p className="text-sm text-slate-500">{getDaysLabel()}</p>
            </div>
          </div>
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 text-slate-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Aplicado a</p>
              <p className="text-sm text-slate-500">
                {schedule.id % 3 === 0
                  ? "Todos os grupos"
                  : schedule.id % 3 === 1
                  ? "Administradores"
                  : "Desenvolvedores"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(schedule)}>
          Editar
        </Button>
        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete && onDelete(schedule)}>
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
