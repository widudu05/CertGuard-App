import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface StatusCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: "certificates" | "groups" | "policies" | "blocked";
}

export default function StatusCardDialog({ open, onOpenChange, title, type }: StatusCardDialogProps) {
  // Consultas para buscar dados com base no tipo
  const { data: certificates } = useQuery({
    queryKey: ["/api/certificates"],
    queryFn: () => fetch("/api/certificates").then((res) => res.json()),
    enabled: open && type === "certificates",
  });

  const { data: groups } = useQuery({
    queryKey: ["/api/user-groups"],
    queryFn: () => fetch("/api/user-groups").then((res) => res.json()),
    enabled: open && type === "groups",
  });

  const { data: policies } = useQuery({
    queryKey: ["/api/access-policies"],
    queryFn: () => fetch("/api/access-policies").then((res) => res.json()),
    enabled: open && type === "policies",
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["/api/audit-logs"],
    queryFn: () => fetch("/api/audit-logs").then((res) => res.json()),
    enabled: open && type === "blocked",
  });

  const filteredAuditLogs = auditLogs?.filter((log: any) => log.status === "Bloqueado") || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription>
            Detalhes e informações relacionadas
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            {type === "certificates" && <TabsTrigger value="types">Tipos de Certificados</TabsTrigger>}
            {type !== "blocked" && <TabsTrigger value="actions">Ações</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview">
            {type === "certificates" && certificates && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {certificates.map((cert: any) => (
                  <Card key={cert.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Tipo:</span>{" "}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          cert.type === "A1" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {cert.type === "A1" ? "A1 - Software" : "A3 - Hardware"}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Entidade:</span>{" "}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          cert.entityType === "PF" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {cert.entityType === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                        </span>
                      </p>
                      <p className="text-sm"><span className="font-semibold">Expira em:</span> {new Date(cert.expiresAt).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {type === "groups" && groups && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {groups.map((group: any) => (
                  <Card key={group.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{group.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{group.description || "Sem descrição"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {type === "policies" && policies && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {policies.map((policy: any) => (
                  <Card key={policy.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{policy.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{policy.description || "Sem descrição"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {type === "blocked" && filteredAuditLogs && (
              <div className="space-y-4">
                {filteredAuditLogs.length > 0 ? (
                  filteredAuditLogs.map((log: any) => (
                    <Card key={log.id} className="bg-red-50 border-red-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-red-700">Acesso Bloqueado</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm"><span className="font-semibold">Ação:</span> {log.action}</p>
                        <p className="text-sm"><span className="font-semibold">Data:</span> {new Date(log.timestamp).toLocaleString()}</p>
                        <p className="text-sm"><span className="font-semibold">Detalhes:</span> {JSON.stringify(log.details)}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-6">Nenhum acesso bloqueado recentemente</p>
                )}
              </div>
            )}
          </TabsContent>

          {type === "certificates" && (
            <TabsContent value="types">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Certificado Digital A1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      O certificado <strong className="text-blue-600">A1</strong> é armazenado no computador do usuário e possui validade de 1 ano.
                    </p>
                    <ul className="text-sm space-y-2 list-disc pl-5">
                      <li>Armazenado diretamente no computador (software)</li>
                      <li>Válido por 1 ano</li>
                      <li>Mais acessível e prático para uso imediato</li>
                      <li>Ideal para assinaturas de documentos e autenticações online</li>
                      <li>Disponível para Pessoas Físicas (PF) e Jurídicas (PJ)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Certificado Digital A3</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      O certificado <strong className="text-purple-600">A3</strong> é armazenado em dispositivo portátil (token/smartcard) e possui validade de até 3 anos.
                    </p>
                    <ul className="text-sm space-y-2 list-disc pl-5">
                      <li>Armazenado em dispositivo criptográfico (token USB ou cartão)</li>
                      <li>Válido por até 3 anos, reduzindo custos de renovação</li>
                      <li>Maior segurança, chave privada protegida por hardware</li>
                      <li>Ideal para transações de alto valor e operações sensíveis</li>
                      <li>Disponível para Pessoas Físicas (PF) e Jurídicas (PJ)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          <TabsContent value="actions">
            <div className="flex flex-col gap-4">
              {type === "certificates" && (
                <>
                  <Link href="/certificates" className="inline-block">
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors">
                      Gerenciar Certificados
                    </button>
                  </Link>
                  <p className="text-sm text-gray-600">
                    Acesse a área de certificados para criar novos, renovar expirados ou revogar existentes.
                  </p>
                </>
              )}

              {type === "groups" && (
                <>
                  <Link href="/users" className="inline-block">
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors">
                      Gerenciar Grupos
                    </button>
                  </Link>
                  <p className="text-sm text-gray-600">
                    Acesse a área de usuários para criar novos grupos, adicionar membros ou modificar permissões.
                  </p>
                </>
              )}

              {type === "policies" && (
                <>
                  <Link href="/access-policies" className="inline-block">
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors">
                      Gerenciar Políticas de Acesso
                    </button>
                  </Link>
                  <p className="text-sm text-gray-600">
                    Acesse a área de políticas para definir novas regras, modificar restrições ou revisar permissões.
                  </p>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}