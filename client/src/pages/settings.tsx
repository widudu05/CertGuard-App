import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingsForm from "@/components/settings/SettingsForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Bell, Lock, Database, Globe, Key, AlertTriangle } from "lucide-react";

export default function Settings() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
        <p className="text-slate-600 mt-1">
          Gerencie as configurações do sistema de certificados
        </p>
      </div>

      <Alert className="mb-8 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Atenção</AlertTitle>
        <AlertDescription className="text-amber-700">
          Alterações nas configurações de segurança podem afetar o acesso aos certificados. 
          Certifique-se de revisar cuidadosamente antes de salvar.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Acesso</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Armazenamento</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Rede</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança da plataforma de certificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="security" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie como e quando você receberá notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="notifications" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Acesso</CardTitle>
              <CardDescription>
                Defina políticas de acesso global e requisitos de autenticação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="access" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Armazenamento</CardTitle>
              <CardDescription>
                Configure o armazenamento de certificados e dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="storage" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Rede</CardTitle>
              <CardDescription>
                Configure opções de rede e conectividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="network" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de API</CardTitle>
              <CardDescription>
                Gerencie chaves de API e integrações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm type="api" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
