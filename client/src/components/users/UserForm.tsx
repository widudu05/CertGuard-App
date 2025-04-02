import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// Esquema de validação do Zod
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Nome de usuário deve ter pelo menos 3 caracteres",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres",
  }),
  fullName: z.string().min(3, {
    message: "Nome completo deve ter pelo menos 3 caracteres",
  }),
  email: z.string().email({
    message: "Digite um e-mail válido",
  }),
  role: z.string().min(1, {
    message: "Selecione um perfil de usuário",
  }),
  isActive: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof formSchema>;

type UserFormProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
};

export default function UserForm({ isOpen, onClose, user }: UserFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Valores padrão do formulário
  const defaultValues: Partial<UserFormValues> = {
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "",
    isActive: true,
  };

  // Inicializar formulário com react-hook-form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Preencher formulário com dados existentes se estiver editando
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        password: "", // Não preencher a senha para edição
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [user, form]);

  // Mutation para criar/atualizar usuário
  const mutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      if (user) {
        // Atualizar usuário existente
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error("Falha ao atualizar o usuário");
        }
        
        return response.json();
      } else {
        // Criar novo usuário
        const response = await fetch('/api/users', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error("Falha ao criar o usuário");
        }
        
        return response.json();
      }
    },
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: user ? "Usuário atualizado" : "Usuário criado",
        description: user 
          ? `O usuário ${form.getValues().username} foi atualizado com sucesso.`
          : `O usuário ${form.getValues().username} foi criado com sucesso.`,
      });
      onClose();
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao ${user ? "atualizar" : "criar"} o usuário. ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do usuário. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="nome.usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{user ? "Nova Senha" : "Senha"}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={user ? "Deixe em branco para manter" : "Senha"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="administrator">Administrador</SelectItem>
                      <SelectItem value="developer">Desenvolvedor</SelectItem>
                      <SelectItem value="finance">Financeiro</SelectItem>
                      <SelectItem value="analyst">Analista</SelectItem>
                      <SelectItem value="user">Usuário Básico</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    O perfil determina as permissões do usuário
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Status do Usuário</FormLabel>
                    <FormDescription>
                      Usuários inativos não podem acessar o sistema
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