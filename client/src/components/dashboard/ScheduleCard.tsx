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
    accessHours: {
      workDays: boolean;
      weekend: boolean;
      startTime: string;
      endTime: string;
    };
  };
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  const getDaysLabel = () => {
    if (schedule.accessHours.workDays && schedule.accessHours.weekend) {
      return "Todos os dias";
    } else if (schedule.accessHours.workDays) {
      return "Segunda a Sexta";
    } else if (schedule.accessHours.weekend) {
      return "Sábado e Domingo";
    } else {
      return "Nenhum dia selecionado";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{schedule.name}</CardTitle>
            <CardDescription>{schedule.description}</CardDescription>
          </div>
          <Badge variant={schedule.accessHours.workDays ? "default" : "secondary"}>
            Ativo
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
                {schedule.accessHours.startTime} <ArrowRight className="h-3 w-3 inline mx-1" /> {schedule.accessHours.endTime}
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
        <Button variant="outline" size="sm">Visualizar</Button>
        <Button variant="outline" size="sm">Editar</Button>
      </CardFooter>
    </Card>
  );
}
