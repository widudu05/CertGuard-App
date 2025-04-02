import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { AccessPolicy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PolicyForm from "@/components/policies/PolicyForm";

export default function AccessPolicies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPolicyFormOpen, setIsPolicyFormOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<AccessPolicy | undefined>(undefined);
  const [policyToDelete, setPolicyToDelete] = useState<AccessPolicy | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: policies, isLoading } = useQuery({
    queryKey: ["/api/access-policies"],
    queryFn: () => fetch("/api/access-policies").then((res) => res.json()),
  });

  const filteredPolicies = policies?.filter((policy: AccessPolicy) =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (policy.description && policy.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddPolicy = () => {
    setSelectedPolicy(undefined);
    setIsPolicyFormOpen(true);
  };
  
  const handleEditPolicy = (policy: AccessPolicy) => {
    setSelectedPolicy(policy);
    setIsPolicyFormOpen(true);
  };
  
  const handleDeletePolicy = (policy: AccessPolicy) => {
    setPolicyToDelete(policy);
    setIsDeleteDialogOpen(true);
  };
  
  // Mutation para excluir política
  const deleteMutation = useMutation({
    mutationFn: async (policyId: number) => {
      const response = await fetch(`/api/access-policies/${policyId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Falha ao excluir a política");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["/api/access-policies"] });
      
      toast({
        title: "Política excluída",
        description: "A política foi excluída com sucesso.",
      });
      
      setPolicyToDelete(undefined);
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao excluir a política. ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Políticas de Acesso</h1>
        <p className="text-slate-600 mt-1">
          Gerencie as políticas de acesso para os certificados
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Políticas de Acesso</CardTitle>
              <CardDescription>
                Total de políticas: {policies?.length || 0}
              </CardDescription>
            </div>
            <Button onClick={handleAddPolicy}>Nova Política</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Buscar políticas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="text-center p-8">Carregando políticas...</div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredPolicies?.map((policy: AccessPolicy) => (
                <AccordionItem
                  key={policy.id}
                  value={policy.id.toString()}
                  className="border rounded-lg p-2"
                >
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <div className="flex items-center">
                        <div className="font-medium text-left">{policy.name}</div>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center space-x-2 mr-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPolicy(policy)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDeletePolicy(policy)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <AccordionContent className="pt-2">
                    <div className="bg-slate-50 p-4 rounded-md">
                      <p className="text-sm text-slate-600 mb-4">{policy.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {policy.allowedSystems && policy.allowedSystems.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Sistemas Permitidos</h4>
                            <div className="flex flex-wrap gap-1">
                              {policy.allowedSystems.map((system, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-50">
                                  {system}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {policy.allowedUrls && policy.allowedUrls.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">URLs Permitidas</h4>
                            <div className="flex flex-wrap gap-1">
                              {policy.allowedUrls.map((url, idx) => (
                                <Badge key={idx} variant="outline" className="bg-green-50 text-green-700">
                                  {url}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {policy.blockedUrls && policy.blockedUrls.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">URLs Bloqueadas</h4>
                            <div className="flex flex-wrap gap-1">
                              {policy.blockedUrls.map((url, idx) => (
                                <Badge key={idx} variant="outline" className="bg-red-50 text-red-700">
                                  {url}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {policy.accessHours && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Horários de Acesso</h4>
                            <div className="text-xs">
                              <p>
                                <span className="font-medium">Dias de semana:</span>{" "}
                                {policy.accessHours.workDays ? "Permitido" : "Bloqueado"}
                              </p>
                              <p>
                                <span className="font-medium">Fins de semana:</span>{" "}
                                {policy.accessHours.weekend ? "Permitido" : "Bloqueado"}
                              </p>
                              <p>
                                <span className="font-medium">Horário:</span>{" "}
                                {policy.accessHours.startTime} - {policy.accessHours.endTime}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
      {/* Modal de formulário de política */}
      <PolicyForm
        isOpen={isPolicyFormOpen}
        onClose={() => setIsPolicyFormOpen(false)}
        policy={selectedPolicy}
      />
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir permanentemente a política "{policyToDelete?.name}".
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (policyToDelete) {
                  deleteMutation.mutate(policyToDelete.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
