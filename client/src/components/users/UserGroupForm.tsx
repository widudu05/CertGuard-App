import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserGroup, User } from "@/lib/types";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRoundCheckIcon, UserRoundMinusIcon } from "lucide-react";

// Esquema de validação do Zod
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nome do grupo deve ter pelo menos 3 caracteres",
  }),
  description: z.string().optional(),
  userIds: z.array(z.number()).optional(),
});

type UserGroupFormValues = z.infer<typeof formSchema>;

type UserGroupFormProps = {
  isOpen: boolean;
  onClose: () => void;
  userGroup?: UserGroup;
};

export default function UserGroupForm({
  isOpen,
  onClose,
  userGroup,
}: UserGroupFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Buscar todos os usuários
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
    enabled: isOpen,
  });

  // Buscar usuários associados ao grupo (se estiver editando)
  const { data: groupUsers, isLoading: isGroupUsersLoading } = useQuery({
    queryKey: ["/api/user-groups", userGroup?.id, "members"],
    queryFn: () =>
      fetch(`/api/user-groups/${userGroup?.id}/members`).then((res) =>
        res.json()
      ),
    enabled: isOpen && !!userGroup?.id,
  });

  // Valores padrão do formulário
  const defaultValues: Partial<UserGroupFormValues> = {
    name: "",
    description: "",
    userIds: [],
  };

  // Inicializar formulário com react-hook-form
  const form = useForm<UserGroupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Preencher formulário com dados existentes se estiver editando
  useEffect(() => {
    if (userGroup) {
      form.reset({
        name: userGroup.name,
        description: userGroup.description || "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [userGroup, form]);

  // Atualizar usuários selecionados quando os dados do grupo forem carregados
  useEffect(() => {
    if (groupUsers && Array.isArray(groupUsers)) {
      const userIds = groupUsers.map((user: User) => user.id);
      setSelectedUsers(userIds);
    }
  }, [groupUsers]);

  // Mutation para criar/atualizar grupo
  const mutation = useMutation({
    mutationFn: async (data: UserGroupFormValues) => {
      if (userGroup) {
        // Atualizar grupo existente
        const updateResponse = await fetch(`/api/user-groups/${userGroup.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error("Falha ao atualizar o grupo");
        }

        // Atualizar membros do grupo
        const currentUserIds = groupUsers?.map((user: User) => user.id) || [];
        const usersToAdd = selectedUsers.filter(
          (id) => !currentUserIds.includes(id)
        );
        const usersToRemove = currentUserIds.filter(
          (id) => !selectedUsers.includes(id)
        );

        // Adicionar usuários ao grupo
        for (const userId of usersToAdd) {
          await fetch("/api/user-groups/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              groupId: userGroup.id,
            }),
          });
        }

        // Remover usuários do grupo
        for (const userId of usersToRemove) {
          await fetch(`/api/user-groups/${userGroup.id}/members/${userId}`, {
            method: "DELETE",
          });
        }

        return updateResponse.json();
      } else {
        // Criar novo grupo
        const createResponse = await fetch("/api/user-groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
          }),
        });

        if (!createResponse.ok) {
          throw new Error("Falha ao criar o grupo");
        }

        const newGroup = await createResponse.json();

        // Adicionar usuários selecionados ao novo grupo
        for (const userId of selectedUsers) {
          await fetch("/api/user-groups/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              groupId: newGroup.id,
            }),
          });
        }

        return newGroup;
      }
    },
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["/api/user-groups"] });
      toast({
        title: userGroup ? "Grupo atualizado" : "Grupo criado",
        description: userGroup
          ? `O grupo ${form.getValues().name} foi atualizado com sucesso.`
          : `O grupo ${form.getValues().name} foi criado com sucesso.`,
      });
      onClose();
      form.reset(defaultValues);
      setSelectedUsers([]);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao ${
          userGroup ? "atualizar" : "criar"
        } o grupo. ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserGroupFormValues) => {
    mutation.mutate(data);
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const isLoading = isUsersLoading || isGroupUsersLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {userGroup ? "Editar Grupo" : "Adicionar Novo Grupo"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do grupo e selecione os membros. Clique em salvar
            quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do grupo" {...field} />
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
                      placeholder="Descrição do grupo"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Uma breve descrição sobre o propósito deste grupo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Membros do Grupo</FormLabel>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Carregando usuários...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Selecionar</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Perfil</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.length > 0 ? (
                        users.map((user: User) => (
                          <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => handleToggleUser(user.id)}
                              />
                            </TableCell>
                            <TableCell 
                              className="font-medium"
                              onClick={() => handleToggleUser(user.id)}
                            >
                              {user.fullName}
                            </TableCell>
                            <TableCell onClick={() => handleToggleUser(user.id)}>
                              {user.email}
                            </TableCell>
                            <TableCell onClick={() => handleToggleUser(user.id)}>
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium">
                                {user.role}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-6"
                          >
                            <p className="text-muted-foreground">
                              Nenhum usuário encontrado.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
              <FormDescription>
                Selecione os usuários que serão membros deste grupo.
              </FormDescription>
            </div>

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