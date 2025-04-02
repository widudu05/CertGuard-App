import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Certificate } from "@/lib/types";
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
import { useToast } from "@/hooks/use-toast";

type DeleteConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate;
};

export default function DeleteConfirmation({
  isOpen,
  onClose,
  certificate,
}: DeleteConfirmationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/certificates/${certificate.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Falha ao excluir o certificado");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({
        title: "Certificado excluído",
        description: `O certificado ${certificate.name} foi excluído com sucesso.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o certificado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Certificado</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o certificado <strong>{certificate?.name}</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Excluindo..." : "Sim, excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}