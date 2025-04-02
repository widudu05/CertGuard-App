import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const generalSettingsSchema = z.object({
  applicationName: z.string().min(2, {
    message: "O nome da aplicação deve ter pelo menos 2 caracteres.",
  }),
  sessionTimeout: z.string().regex(/^\d+$/, {
    message: "O tempo de expiração da sessão deve ser um número válido.",
  }),
  defaultTimezone: z.string().min(1, {
    message: "Selecione um fuso horário.",
  }),
  allowFileDownloads: z.boolean(),
  enableNotifications: z.boolean(),
  enableAuditLogging: z.boolean(),
});

const securitySettingsSchema = z.object({
  passwordMinLength: z.string().regex(/^\d+$/, {
    message: "O valor deve ser um número válido.",
  }),
  passwordRequireSpecialChar: z.boolean(),
  passwordRequireNumbers: z.boolean(),
  passwordRequireUppercase: z.boolean(),
  passwordExpiryDays: z.string().regex(/^\d+$/, {
    message: "O valor deve ser um número válido.",
  }),
  maxLoginAttempts: z.string().regex(/^\d+$/, {
    message: "O valor deve ser um número válido.",
  }),
  enableTwoFactor: z.boolean(),
  certificateExpiryNotification: z.string().regex(/^\d+$/, {
    message: "O valor deve ser um número válido.",
  }),
});

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      applicationName: "WhomDoc9",
      sessionTimeout: "30",
      defaultTimezone: "America/Sao_Paulo",
      allowFileDownloads: true,
      enableNotifications: true,
      enableAuditLogging: true,
    },
  });
  
  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      passwordMinLength: "8",
      passwordRequireSpecialChar: true,
      passwordRequireNumbers: true,
      passwordRequireUppercase: true,
      passwordExpiryDays: "90",
      maxLoginAttempts: "5",
      enableTwoFactor: false,
      certificateExpiryNotification: "30",
    },
  });
  
  const onGeneralSubmit = (values: z.infer<typeof generalSettingsSchema>) => {
    toast({
      title: "Configurações gerais salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
    console.log(values);
  };
  
  const onSecuritySubmit = (values: z.infer<typeof securitySettingsSchema>) => {
    toast({
      title: "Configurações de segurança salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
    console.log(values);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        <p className="text-zinc-500">Gerencie as configurações e preferências da sua instância do WhomDoc9.</p>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Form {...generalForm}>
            <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure as preferências básicas da aplicação.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="applicationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Aplicação</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Este nome será exibido no cabeçalho e no título da página.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo de Expiração da Sessão (minutos)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" />
                          </FormControl>
                          <FormDescription>
                            Após este período de inatividade, a sessão expirará.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="defaultTimezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuso Horário Padrão</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um fuso horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</SelectItem>
                              <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                              <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                              <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                              <SelectItem value="UTC">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Este fuso horário será usado para exibir datas e horários.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="allowFileDownloads"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Permitir Downloads de Arquivos</FormLabel>
                            <FormDescription>
                              Permite o download de certificados para armazenamento local.
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
                      control={generalForm.control}
                      name="enableNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Ativar Notificações</FormLabel>
                            <FormDescription>
                              Notifica sobre eventos, como certificados prestes a expirar.
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
                      control={generalForm.control}
                      name="enableAuditLogging"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Registro de Auditoria</FormLabel>
                            <FormDescription>
                              Mantém um registro detalhado de todas as atividades.
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
                </CardContent>
                <CardFooter>
                  <Button type="submit">Salvar Configurações</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="security">
          <Form {...securityForm}>
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Configure as políticas de segurança e proteção.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={securityForm.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamanho Mínimo da Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="6" />
                          </FormControl>
                          <FormDescription>
                            Número mínimo de caracteres para senhas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="passwordExpiryDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiração de Senha (dias)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" />
                          </FormControl>
                          <FormDescription>
                            Após este período, os usuários deverão alterar suas senhas. Use 0 para nunca expirar.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="maxLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tentativas Máximas de Login</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" />
                          </FormControl>
                          <FormDescription>
                            Número de tentativas permitidas antes do bloqueio da conta.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="certificateExpiryNotification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notificação de Expiração (dias)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" />
                          </FormControl>
                          <FormDescription>
                            Dias antes da expiração para começar a notificar.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="passwordRequireSpecialChar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Exigir Caracteres Especiais</FormLabel>
                            <FormDescription>
                              As senhas devem conter pelo menos um caractere especial.
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
                      control={securityForm.control}
                      name="passwordRequireNumbers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Exigir Números</FormLabel>
                            <FormDescription>
                              As senhas devem conter pelo menos um número.
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
                      control={securityForm.control}
                      name="passwordRequireUppercase"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Exigir Letra Maiúscula</FormLabel>
                            <FormDescription>
                              As senhas devem conter pelo menos uma letra maiúscula.
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
                      control={securityForm.control}
                      name="enableTwoFactor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Autenticação em Dois Fatores</FormLabel>
                            <FormDescription>
                              Habilita a autenticação em dois fatores para maior segurança.
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
                </CardContent>
                <CardFooter>
                  <Button type="submit">Salvar Configurações</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência e o tema da aplicação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel>Tema</FormLabel>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-zinc-500 mt-1">
                      Escolha o tema de exibição para a interface.
                    </p>
                  </div>
                  
                  <div>
                    <FormLabel>Cor Principal</FormLabel>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"].map((color) => (
                        <div 
                          key={color} 
                          className="h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-zinc-400"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            toast({
                              title: "Cor alterada",
                              description: "A personalização de cores estará disponível em versões futuras."
                            });
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Escolha a cor principal da aplicação.
                    </p>
                  </div>
                </div>
                
                <div>
                  <FormLabel>Logo da Aplicação</FormLabel>
                  <div className="h-24 border-2 border-dashed border-zinc-300 rounded-md flex items-center justify-center mt-2">
                    <div className="text-center text-zinc-500">
                      <span className="material-icons text-3xl mb-1">cloud_upload</span>
                      <p className="text-sm">Arraste ou clique para enviar o logo</p>
                      <p className="text-xs">PNG, JPG ou SVG (máx. 2MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  toast({
                    title: "Configurações de aparência",
                    description: "Esta funcionalidade estará disponível em versões futuras."
                  });
                }}
              >
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Configure integrações com outros sistemas e serviços.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-zinc-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="m7 11 2-2-2-2"/>
                          <path d="M11 13h4"/>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">API REST</h4>
                        <p className="text-sm text-zinc-500">Integre com o WhomDoc9 através da API REST</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm"
                      onClick={() => {
                        toast({
                          title: "Configuração de API",
                          description: "As integrações de API estarão disponíveis em versões futuras."
                        });
                      }}
                    >
                      Configurar
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-zinc-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Notificações por E-mail</h4>
                        <p className="text-sm text-zinc-500">Configure alertas por e-mail para eventos importantes</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm"
                      onClick={() => {
                        toast({
                          title: "Configuração de E-mail",
                          description: "As notificações por e-mail estarão disponíveis em versões futuras."
                        });
                      }}
                    >
                      Configurar
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-zinc-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <path d="M10.5 15h3l4-8H4l3 8h3"/>
                          <path d="M12 15v4"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Exportação para SIEM</h4>
                        <p className="text-sm text-zinc-500">Integre logs de auditoria com seu sistema SIEM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm"
                      onClick={() => {
                        toast({
                          title: "Configuração de SIEM",
                          description: "A integração com SIEM estará disponível em versões futuras."
                        });
                      }}
                    >
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  toast({
                    title: "Integrações",
                    description: "Esta funcionalidade estará disponível em versões futuras."
                  });
                }}
              >
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
