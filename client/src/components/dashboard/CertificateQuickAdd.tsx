import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3, "Nome do certificado é obrigatório"),
  type: z.string().min(1, "Tipo do certificado é obrigatório"),
  userGroupId: z.string().min(1, "Grupo de usuários é obrigatório"),
  expiresAt: z.string().min(1, "Data de expiração é obrigatória"),
  signing: z.boolean().optional(),
  authentication: z.boolean().optional(),
  encryption: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CertificateQuickAdd() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["/api/user-groups"],
    queryFn: () => fetch("/api/user-groups").then(res => res.json()),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Digital Signature",
      userGroupId: "",
      expiresAt: "",
      signing: true,
      authentication: true,
      encryption: false,
    },
  });

  const createCertificateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform form data to match API expected format
      const allowedActions = [];
      if (data.signing) allowedActions.push("sign");
      if (data.authentication) allowedActions.push("authenticate");
      if (data.encryption) allowedActions.push("encrypt");

      const payload = {
        name: data.name,
        type: data.type,
        data: "CERTIFICATE_DATA", // In a real app, this would be actual certificate data
        expiresAt: new Date(data.expiresAt).toISOString(),
        createdBy: 1, // In a real app, this would be the current user's ID
        allowedActions,
      };

      const response = await apiRequest("POST", "/api/certificates", payload);
      const certificate = await response.json();

      // Assign the certificate to the selected group
      await apiRequest("POST", "/api/certificates/groups", {
        certificateId: certificate.id,
        groupId: parseInt(data.userGroupId),
      });

      return certificate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({
        title: "Certificado criado",
        description: "O certificado foi criado com sucesso",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar certificado. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createCertificateMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800 text-lg">Adicionar Certificado</h2>
        <p className="text-sm text-slate-600">Adicione rapidamente um novo certificado</p>
      </div>
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Certificado</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Certificado de Desenvolvimento"
                      {...field}
                    />
                  </FormControl>
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
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Digital Signature">Digital Signature</SelectItem>
                      <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                      <SelectItem value="Code Signing">Code Signing</SelectItem>
                      <SelectItem value="Client Authentication">Client Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo de Usuários</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingGroups}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userGroups?.map((group: any) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Expiração</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Permissões</FormLabel>
              <div className="mt-2 space-y-2">
                <FormField
                  control={form.control}
                  name="signing"
                  render={({ field }) => (
                    <div className="flex items-start">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="signing"
                        />
                      </FormControl>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="signing"
                          className="font-medium text-slate-700"
                        >
                          Assinatura Digital
                        </label>
                      </div>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authentication"
                  render={({ field }) => (
                    <div className="flex items-start">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="authentication"
                        />
                      </FormControl>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="authentication"
                          className="font-medium text-slate-700"
                        >
                          Autenticação
                        </label>
                      </div>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="encryption"
                  render={({ field }) => (
                    <div className="flex items-start">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="encryption"
                        />
                      </FormControl>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="encryption"
                          className="font-medium text-slate-700"
                        >
                          Criptografia
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createCertificateMutation.isPending}
            >
              {createCertificateMutation.isPending ? "Criando..." : "Criar Certificado"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
