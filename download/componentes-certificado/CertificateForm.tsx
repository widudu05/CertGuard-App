import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Certificate, UserGroup, CertificateFormValues } from "@/lib/types";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

// Esquema de validação do Zod
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres",
  }),
  type: z.string().min(1, {
    message: "Selecione um tipo de certificado",
  }),
  userGroup: z.string().min(1, {
    message: "Selecione um grupo de usuários",
  }),
  expiresAt: z.string().min(1, {
    message: "Selecione uma data de expiração",
  }),
  allowedActions: z.object({
    signing: z.boolean().default(false),
    authentication: z.boolean().default(false),
    encryption: z.boolean().default(false),
  }),
});

type CertificateFormProps = {
  isOpen: boolean;
  onClose: () => void;
  certificate?: Certificate;
};

export default function CertificateForm({
  isOpen,
  onClose,
  certificate,
}: CertificateFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(
    certificate ? new Date(certificate.expiresAt) : undefined
  );

  // Consulta grupos de usuários
  const { data: userGroups } = useQuery({
    queryKey: ["/api/user-groups"],
    queryFn: () => fetch("/api/user-groups").then((res) => res.json()),
  });

  // Valores padrão do formulário
  const defaultValues = {
    name: "",
    type: "",
    userGroup: "",
    expiresAt: "",
    allowedActions: {
      signing: false,
      authentication: false,
      encryption: false,
    },
  };

  // Inicializar formulário com react-hook-form
  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Preencher formulário com dados existentes se estiver editando
  useEffect(() => {
    if (certificate) {
      // Mapeamento das ações permitidas
      const allowedActions = {
        signing: certificate.allowedActions.includes("Assinatura"),
        authentication: certificate.allowedActions.includes("Autenticação"),
        encryption: certificate.allowedActions.includes("Criptografia"),
      };

      form.reset({
        name: certificate.name,
        type: certificate.type,
        userGroup: "1", // Grupo padrão para edição
        expiresAt: certificate.expiresAt,
        allowedActions,
      });

      setDate(new Date(certificate.expiresAt));
    } else {
      form.reset(defaultValues);
      setDate(undefined);
    }
  }, [certificate, form]);

  // Mutation para criar/atualizar certificado
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const allowedActions = [];
      if (data.allowedActions.signing) allowedActions.push("Assinatura");
      if (data.allowedActions.authentication) allowedActions.push("Autenticação");
      if (data.allowedActions.encryption) allowedActions.push("Criptografia");
      
      const certificateData = {
        name: data.name,
        type: data.type,
        expiresAt: data.expiresAt,
        allowedActions: allowedActions,
      };
      
      if (certificate) {
        // Atualizar certificado existente
        const response = await fetch(`/api/certificates/${certificate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certificateData),
        });
        
        if (!response.ok) {
          throw new Error("Falha ao atualizar o certificado");
        }
        
        return response.json();
      } else {
        // Criar novo certificado
        const response = await fetch('/api/certificates', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(certificateData),
        });
        
        if (!response.ok) {
          throw new Error("Falha ao criar o certificado");
        }
        
        return response.json();
      }
    },
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      onClose();
      form.reset(defaultValues);
    },
  });

  const onSubmit = (data: CertificateFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {certificate ? "Editar Certificado" : "Adicionar Novo Certificado"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes do certificado. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do certificado" {...field} />
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
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de certificado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Digital Signature">Assinatura Digital</SelectItem>
                      <SelectItem value="Authentication">Autenticação</SelectItem>
                      <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                      <SelectItem value="Document Signing">Assinatura de Documentos</SelectItem>
                      <SelectItem value="Email Certificate">Certificado de Email</SelectItem>
                      <SelectItem value="Code Signing">Assinatura de Código</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="userGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo de Usuários</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userGroups?.map((group: UserGroup) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    O grupo que terá acesso a este certificado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Expiração</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !date ? "text-muted-foreground" : ""
                          }`}
                        >
                          {date ? (
                            format(date, "PPP", { locale: pt })
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
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          field.onChange(date ? date.toISOString() : "");
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Ações Permitidas</FormLabel>
              <FormField
                control={form.control}
                name="allowedActions.signing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Assinatura
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="allowedActions.authentication"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Autenticação
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="allowedActions.encryption"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Criptografia
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}