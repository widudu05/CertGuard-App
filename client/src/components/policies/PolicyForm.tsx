import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AccessPolicy } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  Server,
  Globe,
  XCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Esquema de validação do Zod
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nome da política deve ter pelo menos 3 caracteres",
  }),
  description: z.string().optional(),
  allowedSystems: z.array(z.string()).optional(),
  blockedUrls: z.array(z.string()).optional(),
  allowedUrls: z.array(z.string()).optional(),
  accessHours: z
    .object({
      workDays: z.boolean().default(true),
      weekend: z.boolean().default(false),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
    })
    .optional(),
});

type PolicyFormValues = z.infer<typeof formSchema>;

type PolicyFormProps = {
  isOpen: boolean;
  onClose: () => void;
  policy?: AccessPolicy;
};

export default function PolicyForm({
  isOpen,
  onClose,
  policy,
}: PolicyFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Valores padrão do formulário
  const defaultValues: Partial<PolicyFormValues> = {
    name: "",
    description: "",
    allowedSystems: [],
    blockedUrls: [],
    allowedUrls: [],
    accessHours: {
      workDays: true,
      weekend: false,
      startTime: "08:00",
      endTime: "18:00",
    },
  };

  // Inicializar formulário com react-hook-form
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Preencher formulário com dados existentes se estiver editando
  useEffect(() => {
    if (policy) {
      form.reset({
        name: policy.name,
        description: policy.description || "",
        allowedSystems: policy.allowedSystems || [],
        blockedUrls: policy.blockedUrls || [],
        allowedUrls: policy.allowedUrls || [],
        accessHours: policy.accessHours || {
          workDays: true,
          weekend: false,
          startTime: "08:00",
          endTime: "18:00",
        },
      });
    } else {
      form.reset(defaultValues);
    }
  }, [policy, form]);

  // Mutation para criar/atualizar política
  const mutation = useMutation({
    mutationFn: async (data: PolicyFormValues) => {
      if (policy) {
        // Atualizar política existente
        const response = await fetch(`/api/access-policies/${policy.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Falha ao atualizar a política");
        }

        return response.json();
      } else {
        // Criar nova política
        const response = await fetch("/api/access-policies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Falha ao criar a política");
        }

        return response.json();
      }
    },
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["/api/access-policies"] });
      toast({
        title: policy ? "Política atualizada" : "Política criada",
        description: policy
          ? `A política ${form.getValues().name} foi atualizada com sucesso.`
          : `A política ${form.getValues().name} foi criada com sucesso.`,
      });
      onClose();
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao ${
          policy ? "atualizar" : "criar"
        } a política. ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PolicyFormValues) => {
    // Tratar arrays vazios
    if (!data.allowedSystems || data.allowedSystems.length === 0) {
      data.allowedSystems = [];
    }
    if (!data.blockedUrls || data.blockedUrls.length === 0) {
      data.blockedUrls = [];
    }
    if (!data.allowedUrls || data.allowedUrls.length === 0) {
      data.allowedUrls = [];
    }

    mutation.mutate(data);
  };

  // Função para adicionar item a um array
  const addItemToArray = (fieldName: "allowedSystems" | "blockedUrls" | "allowedUrls") => {
    const inputId = `${fieldName}-input`;
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    
    if (inputElement && inputElement.value.trim()) {
      const currentValue = form.getValues(fieldName) || [];
      const newValue = [...currentValue, inputElement.value.trim()];
      form.setValue(fieldName, newValue);
      inputElement.value = "";
    }
  };

  // Função para remover item de um array
  const removeItemFromArray = (fieldName: "allowedSystems" | "blockedUrls" | "allowedUrls", index: number) => {
    const currentValue = form.getValues(fieldName) || [];
    const newValue = [...currentValue];
    newValue.splice(index, 1);
    form.setValue(fieldName, newValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {policy ? "Editar Política" : "Nova Política de Acesso"}
          </DialogTitle>
          <DialogDescription>
            Configure as regras e restrições para esta política de acesso.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Política</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da política" {...field} />
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
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição da política"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Uma breve descrição sobre o propósito desta política.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs defaultValue="systems" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="systems">
                  <Server className="h-4 w-4 mr-2" />
                  Sistemas Permitidos
                </TabsTrigger>
                <TabsTrigger value="urls">
                  <Globe className="h-4 w-4 mr-2" />
                  Controle de URLs
                </TabsTrigger>
                <TabsTrigger value="time">
                  <Clock className="h-4 w-4 mr-2" />
                  Restrições de Horário
                </TabsTrigger>
              </TabsList>

              <TabsContent value="systems">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistemas Permitidos</CardTitle>
                    <CardDescription>
                      Defina quais sistemas podem utilizar esta política
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        id="allowedSystems-input"
                        placeholder="Nome do sistema"
                      />
                      <Button
                        type="button"
                        onClick={() => addItemToArray("allowedSystems")}
                      >
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-2 mt-4">
                      {form.watch("allowedSystems")?.map((system, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                        >
                          <div className="flex items-center">
                            <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                            <span>{system}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeItemFromArray("allowedSystems", index)
                            }
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}

                      {(!form.watch("allowedSystems") ||
                        form.watch("allowedSystems").length === 0) && (
                        <p className="text-muted-foreground text-sm">
                          Nenhum sistema adicionado. Se vazio, todos os sistemas
                          serão permitidos.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="urls">
                <Card>
                  <CardHeader>
                    <CardTitle>Controle de URLs</CardTitle>
                    <CardDescription>
                      Configure URLs bloqueadas e permitidas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <ShieldAlert className="h-4 w-4 mr-2 text-destructive" />
                        URLs Bloqueadas
                      </h4>
                      <div className="flex space-x-2">
                        <Input
                          id="blockedUrls-input"
                          placeholder="https://exemplo.com"
                        />
                        <Button
                          type="button"
                          onClick={() => addItemToArray("blockedUrls")}
                        >
                          Bloquear
                        </Button>
                      </div>

                      <div className="space-y-2 mt-2">
                        {form.watch("blockedUrls")?.map((url, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-red-50 p-2 rounded-md"
                          >
                            <span className="text-sm">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeItemFromArray("blockedUrls", index)
                              }
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}

                        {(!form.watch("blockedUrls") ||
                          form.watch("blockedUrls").length === 0) && (
                          <p className="text-muted-foreground text-sm">
                            Nenhuma URL bloqueada.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                        URLs Permitidas
                      </h4>
                      <div className="flex space-x-2">
                        <Input
                          id="allowedUrls-input"
                          placeholder="https://exemplo.com"
                        />
                        <Button
                          type="button"
                          onClick={() => addItemToArray("allowedUrls")}
                        >
                          Permitir
                        </Button>
                      </div>

                      <div className="space-y-2 mt-2">
                        {form.watch("allowedUrls")?.map((url, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-green-50 p-2 rounded-md"
                          >
                            <span className="text-sm">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeItemFromArray("allowedUrls", index)
                              }
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}

                        {(!form.watch("allowedUrls") ||
                          form.watch("allowedUrls").length === 0) && (
                          <p className="text-muted-foreground text-sm">
                            Nenhuma URL explicitamente permitida. Se vazio e
                            houver URLs bloqueadas, apenas as URLs não
                            bloqueadas serão permitidas.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="time">
                <Card>
                  <CardHeader>
                    <CardTitle>Restrições de Horário</CardTitle>
                    <CardDescription>
                      Configure os dias e horários em que a política estará ativa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="accessHours.workDays"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Dias Úteis</FormLabel>
                                <FormDescription>
                                  Segunda a Sexta
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="accessHours.weekend"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Fim de Semana</FormLabel>
                                <FormDescription>
                                  Sábado e Domingo
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="accessHours.startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horário de Início</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um horário" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 24 }).map((_, i) => (
                                    <SelectItem
                                      key={i}
                                      value={`${i
                                        .toString()
                                        .padStart(2, "0")}:00`}
                                    >
                                      {`${i.toString().padStart(2, "0")}:00`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Horário de início para acesso
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="accessHours.endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horário de Término</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um horário" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 24 }).map((_, i) => (
                                    <SelectItem
                                      key={i}
                                      value={`${i
                                        .toString()
                                        .padStart(2, "0")}:00`}
                                    >
                                      {`${i.toString().padStart(2, "0")}:00`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Horário de término para acesso
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
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