import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Certificate, AccessPolicy } from "@/lib/types";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, ShieldX, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PolicyAssignmentProps = {
  isOpen: boolean;
  onClose: () => void;
  certificate?: Certificate;
};

export default function PolicyAssignment({
  isOpen,
  onClose,
  certificate,
}: PolicyAssignmentProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedPolicies, setSelectedPolicies] = useState<number[]>([]);
  const [currentPolicies, setCurrentPolicies] = useState<number[]>([]);

  // Buscar todas as políticas
  const { data: allPolicies, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ["/api/access-policies"],
    queryFn: () => fetch("/api/access-policies").then((res) => res.json()),
    enabled: isOpen,
  });

  // Buscar políticas associadas ao certificado
  const { data: certificatePolicies, isLoading: isCertPoliciesLoading } = useQuery({
    queryKey: ["/api/certificates", certificate?.id, "policies"],
    queryFn: () => 
      fetch(`/api/certificates/${certificate?.id}/policies`).then((res) => res.json()),
    enabled: isOpen && !!certificate?.id,
  });
  
  // Atualizar os estados quando os dados das políticas forem carregados
  useEffect(() => {
    if (certificatePolicies) {
      const policyIds = certificatePolicies.map((policy: AccessPolicy) => policy.id);
      setCurrentPolicies(policyIds);
      setSelectedPolicies(policyIds);
    }
  }, [certificatePolicies]);

  // Mutation para associar política ao certificado
  const assignMutation = useMutation({
    mutationFn: async (policyId: number) => {
      const response = await fetch("/api/certificates/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateId: certificate?.id,
          policyId: policyId,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao associar política ao certificado");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/certificates", certificate?.id, "policies"],
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao associar política. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation para remover associação de política
  const removeMutation = useMutation({
    mutationFn: async (policyId: number) => {
      const response = await fetch(
        `/api/certificates/${certificate?.id}/policies/${policyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao remover política do certificado");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/certificates", certificate?.id, "policies"],
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao remover política. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleTogglePolicy = (policyId: number) => {
    setSelectedPolicies((prev) => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      } else {
        return [...prev, policyId];
      }
    });
  };

  const handleSaveChanges = async () => {
    const policiesToAdd = selectedPolicies.filter(
      (id) => !currentPolicies.includes(id)
    );
    const policiesToRemove = currentPolicies.filter(
      (id) => !selectedPolicies.includes(id)
    );

    // Adicionar novas políticas
    for (const policyId of policiesToAdd) {
      await assignMutation.mutateAsync(policyId);
    }

    // Remover políticas desassociadas
    for (const policyId of policiesToRemove) {
      await removeMutation.mutateAsync(policyId);
    }

    toast({
      title: "Políticas atualizadas",
      description: "As políticas de acesso foram atualizadas com sucesso.",
    });

    onClose();
  };

  const isLoading = isPoliciesLoading || isCertPoliciesLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Políticas de Acesso para Certificado</DialogTitle>
          <DialogDescription>
            Gerencie as políticas de acesso associadas ao certificado{" "}
            <strong>{certificate?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p>Carregando políticas...</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Selecionar</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Restrições</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPolicies?.length > 0 ? (
                  allPolicies.map((policy: AccessPolicy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPolicies.includes(policy.id)}
                          onCheckedChange={() => handleTogglePolicy(policy.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell>
                        {policy.description || "Sem descrição"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {policy.allowedSystems && policy.allowedSystems.length > 0 && (
                            <Badge variant="outline" className="bg-green-50">
                              {policy.allowedSystems.length} sistemas permitidos
                            </Badge>
                          )}
                          {policy.blockedUrls && policy.blockedUrls.length > 0 && (
                            <Badge variant="outline" className="bg-red-50">
                              {policy.blockedUrls.length} URLs bloqueadas
                            </Badge>
                          )}
                          {policy.accessHours && (
                            <Badge variant="outline" className="bg-blue-50">
                              Restrição de horário
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleTogglePolicy(policy.id)}
                              >
                                {selectedPolicies.includes(policy.id) ? (
                                  <ShieldCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ShieldX className="h-4 w-4 text-red-600" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {selectedPolicies.includes(policy.id)
                                ? "Desativar política"
                                : "Ativar política"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver detalhes da política</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <p className="text-muted-foreground">
                        Nenhuma política de acesso encontrada.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          onClose();
                          // Aqui você pode redirecionar para a página de políticas
                        }}
                      >
                        Criar Política
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={
              isLoading ||
              assignMutation.isPending ||
              removeMutation.isPending ||
              JSON.stringify(selectedPolicies.sort()) === JSON.stringify(currentPolicies.sort())
            }
          >
            {assignMutation.isPending || removeMutation.isPending
              ? "Salvando..."
              : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}