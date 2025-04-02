import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, certificateTypes } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório (min. 3 caracteres)"),
  type: z.string().min(1, "Tipo é obrigatório"),
  issuedTo: z.string().min(2, "Emitido para é obrigatório"),
  issuedToEmail: z.string().email("Email inválido"),
  description: z.string().optional(),
  expireAt: z.date({
    required_error: "Data de expiração é obrigatória",
  }),
  fingerprint: z.string().optional(),
  data: z.string().min(1, "Conteúdo do certificado é obrigatório"),
  groups: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddCertificateDialog: React.FC<AddCertificateDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [groups, setGroups] = useState([
    { id: 1, name: "Financeiro" },
    { id: 2, name: "TI - Infraestrutura" },
    { id: 3, name: "TI - Desenvolvimento" },
    { id: 4, name: "RH" },
    { id: 5, name: "Jurídico" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      issuedTo: "",
      issuedToEmail: "",
      description: "",
      expireAt: new Date(),
      fingerprint: "",
      data: "",
      groups: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // First create the certificate
      const response = await apiRequest("POST", "/api/certificates", {
        ...values,
        status: "active",
      });
      
      const newCertificate = await response.json();
      
      // If groups are selected, create permissions for each group
      if (values.groups && values.groups.length > 0) {
        await Promise.all(
          values.groups.map((groupId) =>
            apiRequest("POST", "/api/permissions", {
              certificateId: newCertificate.id,
              groupId,
              canView: true,
              canEdit: false,
              canDelete: false,
              canDownload: true,
            })
          )
        );
      }
      
      toast({
        title: "Certificado adicionado",
        description: "O certificado foi adicionado com sucesso.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding certificate:", error);
      toast({
        title: "Erro ao adicionar certificado",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Certificado</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do certificado que você deseja adicionar ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Certificado</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: SSL Website" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Certificado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de certificado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {certificateTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issuedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emitido para</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Financeiro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="issuedToEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: financeiro@empresa.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="expireAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Expiração</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo do Certificado</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cole o conteúdo do certificado aqui..."
                      className="font-mono text-xs h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a finalidade deste certificado..."
                      className="h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="groups"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Atribuir a Grupos</FormLabel>
                  </div>
                  <div className="border border-zinc-200 rounded-md p-2 max-h-32 overflow-y-auto">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center p-1 hover:bg-zinc-50 rounded"
                      >
                        <Checkbox
                          id={`group-${group.id}`}
                          onCheckedChange={(checked) => {
                            const currentGroups = form.getValues("groups") || [];
                            const updatedGroups = checked
                              ? [...currentGroups, group.id]
                              : currentGroups.filter((id) => id !== group.id);
                            form.setValue("groups", updatedGroups);
                          }}
                        />
                        <label
                          htmlFor={`group-${group.id}`}
                          className="ml-2 text-sm text-zinc-700"
                        >
                          {group.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adicionando..." : "Adicionar Certificado"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCertificateDialog;
