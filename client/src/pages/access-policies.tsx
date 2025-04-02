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

export default function AccessPolicies() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: policies, isLoading } = useQuery({
    queryKey: ["/api/access-policies"],
    queryFn: () => fetch("/api/access-policies").then((res) => res.json()),
  });

  const filteredPolicies = policies?.filter((policy: AccessPolicy) =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (policy.description && policy.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddPolicy = () => {
    // In a real app, would show a form modal or navigate to form page
    console.log("Add policy clicked");
  };

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
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
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
    </MainLayout>
  );
}
