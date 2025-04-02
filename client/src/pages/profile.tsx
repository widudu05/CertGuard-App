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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  username: z.string().min(3, {
    message: "O nome de usuário deve ter pelo menos 3 caracteres.",
  }),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
  confirmNewPassword: z.string().min(8, "A confirmação da senha deve ter pelo menos 8 caracteres"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas não coincidem",
  path: ["confirmNewPassword"],
});

const notificationSchema = z.object({
  emailNotifications: z.string(),
  certificateExpiry: z.string(),
  securityAlerts: z.string(),
  newsletterUpdates: z.string(),
});

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Simulated user data
  const userData = {
    id: 1,
    name: "Admin Demo",
    email: "admin@whomdoc9.com",
    username: "admin",
    role: "administrator",
    avatarUrl: ""
  };
  
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      username: userData.username,
    },
  });
  
  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: "all",
      certificateExpiry: "immediate",
      securityAlerts: "immediate",
      newsletterUpdates: "weekly",
    },
  });
  
  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso.",
    });
    console.log(values);
  };
  
  const onSecuritySubmit = (values: z.infer<typeof securitySchema>) => {
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso.",
    });
    console.log(values);
    
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };
  
  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    toast({
      title: "Preferências de notificação atualizadas",
      description: "Suas preferências de notificação foram atualizadas com sucesso.",
    });
    console.log(values);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Perfil de Usuário</h1>
        <p className="text-zinc-500">Gerencie suas informações pessoais e preferências.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-lg">
                    {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-zinc-500 mb-4">{userData.email}</p>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold">
                  {userData.role}
                </div>
                
                <div className="w-full mt-6 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <span className="material-icons text-sm mr-2">person</span>
                    Informações Pessoais
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <span className="material-icons text-sm mr-2">lock</span>
                    Segurança
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <span className="material-icons text-sm mr-2">notifications</span>
                    Notificações
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("activity")}
                  >
                    <span className="material-icons text-sm mr-2">history</span>
                    Atividade da Conta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>
                        Atualize suas informações pessoais e de contato.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome de Usuário</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Foto de Perfil</FormLabel>
                        <div className="h-24 border-2 border-dashed border-zinc-300 rounded-md flex items-center justify-center mt-2">
                          <div className="text-center text-zinc-500">
                            <span className="material-icons text-3xl mb-1">cloud_upload</span>
                            <p className="text-sm">Arraste ou clique para enviar uma foto</p>
                            <p className="text-xs">PNG, JPG (máx. 2MB)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Salvar Alterações</Button>
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
                      <CardTitle>Segurança</CardTitle>
                      <CardDescription>
                        Gerencie sua senha e configurações de segurança.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormDescription>
                              A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, números e caracteres especiais.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="rounded-lg border p-4 bg-zinc-50">
                        <div className="flex items-start space-x-4">
                          <span className="material-icons text-amber-500 mt-0.5">security</span>
                          <div>
                            <h4 className="text-sm font-medium">Autenticação em Dois Fatores</h4>
                            <p className="text-sm text-zinc-500 mt-1">
                              Adicione uma camada extra de segurança ativando a autenticação em dois fatores (2FA).
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => {
                                toast({
                                  title: "Autenticação em Dois Fatores",
                                  description: "Esta funcionalidade estará disponível em versões futuras."
                                });
                              }}
                            >
                              Configurar 2FA
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Atualizar Senha</Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências de Notificação</CardTitle>
                      <CardDescription>
                        Personalize como e quando você recebe notificações.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notificações por Email</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all">Todas as notificações</SelectItem>
                                <SelectItem value="important">Apenas importantes</SelectItem>
                                <SelectItem value="none">Nenhuma</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Controle quais notificações por email você deseja receber.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="certificateExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avisos de Expiração de Certificados</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="immediate">Imediatamente</SelectItem>
                                <SelectItem value="daily">Resumo diário</SelectItem>
                                <SelectItem value="weekly">Resumo semanal</SelectItem>
                                <SelectItem value="none">Não receber</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Quando você deseja ser notificado sobre certificados próximos da expiração.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="securityAlerts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alertas de Segurança</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="immediate">Imediatamente</SelectItem>
                                <SelectItem value="daily">Resumo diário</SelectItem>
                                <SelectItem value="none">Não receber</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Quando você deseja ser notificado sobre alertas de segurança.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="newsletterUpdates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Atualizações e Novidades</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma opção" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weekly">Semanalmente</SelectItem>
                                <SelectItem value="monthly">Mensalmente</SelectItem>
                                <SelectItem value="none">Não receber</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Receba atualizações sobre novas funcionalidades e melhorias.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Salvar Preferências</Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade da Conta</CardTitle>
                  <CardDescription>
                    Visualize o histórico de atividades da sua conta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium">Login bem-sucedido</p>
                      <p className="text-xs text-zinc-500">Hoje, 10:45 - IP: 192.168.1.1</p>
                    </div>
                    
                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium">Alteração de perfil</p>
                      <p className="text-xs text-zinc-500">Ontem, 14:30 - IP: 192.168.1.1</p>
                    </div>
                    
                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium">Login bem-sucedido</p>
                      <p className="text-xs text-zinc-500">Ontem, 09:15 - IP: 192.168.1.1</p>
                    </div>
                    
                    <div className="border-l-2 border-amber-500 pl-4 py-2">
                      <p className="text-sm font-medium">Tentativa de login falhou</p>
                      <p className="text-xs text-zinc-500">3 dias atrás, 18:20 - IP: 192.168.1.100</p>
                    </div>
                    
                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium">Certificado visualizado</p>
                      <p className="text-xs text-zinc-500">1 semana atrás, 11:05 - IP: 192.168.1.1</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => {
                      toast({
                        title: "Registro de atividades",
                        description: "O registro completo de atividades estará disponível em versões futuras."
                      });
                    }}
                  >
                    Ver Histórico Completo
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
