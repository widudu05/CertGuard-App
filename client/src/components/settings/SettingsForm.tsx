import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Type definitions for different settings forms
interface SettingsFormProps {
  type: 'security' | 'notifications' | 'access' | 'storage' | 'network' | 'api';
}

// Form schema for security settings
const securitySchema = z.object({
  passwordPolicy: z.string(),
  mfaEnabled: z.boolean(),
  sessionTimeout: z.string(),
  blockedIps: z.string(),
  autoLogout: z.boolean(),
  auditLogRetention: z.string(),
});

// Form schema for notification settings
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  certificateExpiration: z.boolean(),
  accessAttempts: z.boolean(),
  anomalyDetection: z.boolean(),
  notificationEmail: z.string().email().optional(),
  notificationFrequency: z.string(),
});

// Form schema for access settings
const accessSchema = z.object({
  defaultAccessPolicy: z.string(),
  ipRestriction: z.boolean(),
  allowedIps: z.string().optional(),
  timeBasedAccess: z.boolean(),
  workingHours: z.string().optional(),
  deviceRestriction: z.string(),
});

// Form schema for storage settings
const storageSchema = z.object({
  storageType: z.string(),
  encryptionEnabled: z.boolean(),
  encryptionAlgorithm: z.string().optional(),
  backupFrequency: z.string(),
  retentionPeriod: z.string(),
  compressionEnabled: z.boolean(),
});

// Form schema for network settings
const networkSchema = z.object({
  allowedDomains: z.string(),
  proxyEnabled: z.boolean(),
  proxyServer: z.string().optional(),
  sslVerification: z.boolean(),
  connectionTimeout: z.string(),
  rateLimiting: z.boolean(),
});

// Form schema for API settings
const apiSchema = z.object({
  apiEnabled: z.boolean(),
  rateLimiting: z.boolean(),
  maxRequests: z.string().optional(),
  authType: z.string(),
  tokenExpiration: z.string().optional(),
  allowedOrigins: z.string(),
});

export default function SettingsForm({ type }: SettingsFormProps) {
  const { toast } = useToast();
  
  // Select the appropriate schema based on the form type
  let schema;
  let defaultValues: any = {};
  
  switch (type) {
    case 'security':
      schema = securitySchema;
      defaultValues = {
        passwordPolicy: 'strong',
        mfaEnabled: true,
        sessionTimeout: '30',
        blockedIps: '',
        autoLogout: true,
        auditLogRetention: '90',
      };
      break;
    case 'notifications':
      schema = notificationSchema;
      defaultValues = {
        emailNotifications: true,
        smsNotifications: false,
        certificateExpiration: true,
        accessAttempts: true,
        anomalyDetection: true,
        notificationEmail: '',
        notificationFrequency: 'daily',
      };
      break;
    case 'access':
      schema = accessSchema;
      defaultValues = {
        defaultAccessPolicy: 'restrictive',
        ipRestriction: false,
        allowedIps: '',
        timeBasedAccess: true,
        workingHours: '08:00-18:00',
        deviceRestriction: 'none',
      };
      break;
    case 'storage':
      schema = storageSchema;
      defaultValues = {
        storageType: 'cloud',
        encryptionEnabled: true,
        encryptionAlgorithm: 'aes-256',
        backupFrequency: 'daily',
        retentionPeriod: '90',
        compressionEnabled: true,
      };
      break;
    case 'network':
      schema = networkSchema;
      defaultValues = {
        allowedDomains: '*',
        proxyEnabled: false,
        proxyServer: '',
        sslVerification: true,
        connectionTimeout: '30',
        rateLimiting: true,
      };
      break;
    case 'api':
      schema = apiSchema;
      defaultValues = {
        apiEnabled: true,
        rateLimiting: true,
        maxRequests: '1000',
        authType: 'jwt',
        tokenExpiration: '60',
        allowedOrigins: '*',
      };
      break;
    default:
      schema = securitySchema;
      defaultValues = {
        passwordPolicy: 'strong',
        mfaEnabled: true,
        sessionTimeout: '30',
        blockedIps: '',
        autoLogout: true,
        auditLogRetention: '90',
      };
  }

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(data: any) {
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
    console.log(data);
  }

  // Render the appropriate form based on the type
  const renderForm = () => {
    switch (type) {
      case 'security':
        return renderSecurityForm();
      case 'notifications':
        return renderNotificationsForm();
      case 'access':
        return renderAccessForm();
      case 'storage':
        return renderStorageForm();
      case 'network':
        return renderNetworkForm();
      case 'api':
        return renderApiForm();
      default:
        return renderSecurityForm();
    }
  };

  const renderSecurityForm = () => (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="passwordPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Política de Senhas</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma política" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="simple">Simples (mínimo 8 caracteres)</SelectItem>
                <SelectItem value="medium">Média (letras, números, 8+ caracteres)</SelectItem>
                <SelectItem value="strong">Forte (letras, números, símbolos, 12+ caracteres)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Define a complexidade das senhas exigidas no sistema.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mfaEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Autenticação de dois fatores (MFA)</FormLabel>
              <FormDescription>
                Exige autenticação adicional ao fazer login.
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
        control={form.control}
        name="sessionTimeout"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timeout de Sessão (minutos)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription>
              Tempo de inatividade após o qual o usuário será desconectado.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="blockedIps"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IPs Bloqueados</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Digite os endereços IP, um por linha"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Lista de IPs que serão bloqueados de acessar o sistema.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="autoLogout"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Logout automático</FormLabel>
              <FormDescription>
                Desconecta automaticamente após o período de timeout.
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
        control={form.control}
        name="auditLogRetention"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Retenção de Logs de Auditoria (dias)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription>
              Período de armazenamento dos logs de auditoria.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );

  const renderNotificationsForm = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Canais de Notificação</CardTitle>
            <CardDescription>Configure como deseja receber alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Notificações por Email</FormLabel>
                    <FormDescription className="text-xs">
                      Receba alertas por email
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
              control={form.control}
              name="smsNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Notificações por SMS</FormLabel>
                    <FormDescription className="text-xs">
                      Receba alertas por SMS
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
              control={form.control}
              name="notificationEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email para Notificações</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência de Resumos</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="realtime">Tempo real</SelectItem>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Alerta</CardTitle>
            <CardDescription>Quais eventos devem gerar notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="certificateExpiration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Expiração de Certificados</FormLabel>
                    <FormDescription className="text-xs">
                      Alertas quando certificados estiverem próximos da expiração
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
              control={form.control}
              name="accessAttempts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Tentativas de Acesso</FormLabel>
                    <FormDescription className="text-xs">
                      Alertas sobre tentativas de acesso não autorizadas
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
              control={form.control}
              name="anomalyDetection"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Detecção de Anomalias</FormLabel>
                    <FormDescription className="text-xs">
                      Alertas sobre comportamentos suspeitos detectados
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
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAccessForm = () => (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="defaultAccessPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Política de Acesso Padrão</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma política" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="permissive">Permissiva (permitir tudo por padrão)</SelectItem>
                <SelectItem value="moderate">Moderada (algumas restrições)</SelectItem>
                <SelectItem value="restrictive">Restritiva (bloquear tudo por padrão)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Define a política padrão para novos certificados e usuários.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ipRestriction"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Restrição por IP</FormLabel>
              <FormDescription>
                Limita o acesso a endereços IP específicos.
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

      {form.watch("ipRestriction") && (
        <FormField
          control={form.control}
          name="allowedIps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IPs Permitidos</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite os endereços IP, um por linha"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Lista de IPs que têm permissão para acessar o sistema.
              </FormDescription>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="timeBasedAccess"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Acesso baseado em horário</FormLabel>
              <FormDescription>
                Limita o acesso a determinados horários do dia.
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

      {form.watch("timeBasedAccess") && (
        <FormField
          control={form.control}
          name="workingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário de Trabalho</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: 08:00-18:00"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Período durante o qual o acesso é permitido.
              </FormDescription>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="deviceRestriction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Restrição de Dispositivo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhuma (acesso de qualquer dispositivo)</SelectItem>
                <SelectItem value="registered">Apenas dispositivos registrados</SelectItem>
                <SelectItem value="corporate">Apenas dispositivos corporativos</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Restringe o acesso com base no tipo de dispositivo.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );

  const renderStorageForm = () => (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="storageType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Armazenamento</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="local" />
                </FormControl>
                <FormLabel className="font-normal">
                  Armazenamento Local
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="cloud" />
                </FormControl>
                <FormLabel className="font-normal">
                  Armazenamento em Nuvem
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="hybrid" />
                </FormControl>
                <FormLabel className="font-normal">
                  Armazenamento Híbrido
                </FormLabel>
              </FormItem>
            </RadioGroup>
            <FormDescription>
              Define onde os certificados serão armazenados.
            </FormDescription>
          </FormItem>
        )}
      />

      <Separator />

      <FormField
        control={form.control}
        name="encryptionEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Criptografia</FormLabel>
              <FormDescription>
                Criptografa certificados armazenados para maior segurança.
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

      {form.watch("encryptionEnabled") && (
        <FormField
          control={form.control}
          name="encryptionAlgorithm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Algoritmo de Criptografia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um algoritmo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="aes-128">AES-128</SelectItem>
                  <SelectItem value="aes-256">AES-256</SelectItem>
                  <SelectItem value="chacha20">ChaCha20</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      )}

      <Separator />

      <FormField
        control={form.control}
        name="backupFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frequência de Backup</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma frequência" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="hourly">A cada hora</SelectItem>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Com que frequência os dados são salvos em backup.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="retentionPeriod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Período de Retenção (dias)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription>
              Por quanto tempo os backups são mantidos.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="compressionEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Compressão de Dados</FormLabel>
              <FormDescription>
                Comprime dados para economizar espaço de armazenamento.
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
  );

  const renderNetworkForm = () => (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="allowedDomains"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Domínios Permitidos</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Digite os domínios, um por linha (use * para qualquer domínio)"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Lista de domínios permitidos para acesso ao sistema.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="proxyEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Usar Proxy</FormLabel>
              <FormDescription>
                Redireciona o tráfego através de um servidor proxy.
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

      {form.watch("proxyEnabled") && (
        <FormField
          control={form.control}
          name="proxyServer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servidor Proxy</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: http://proxy.example.com:8080"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Endereço do servidor proxy.
              </FormDescription>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="sslVerification"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Verificação SSL</FormLabel>
              <FormDescription>
                Verifica certificados SSL em conexões HTTPS.
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
        control={form.control}
        name="connectionTimeout"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timeout de Conexão (segundos)</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription>
              Tempo máximo de espera para estabelecer conexões.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rateLimiting"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Limitação de Taxa</FormLabel>
              <FormDescription>
                Limita o número de requisições por IP.
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
  );

  const renderApiForm = () => (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="apiEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">API Habilitada</FormLabel>
              <FormDescription>
                Permite acesso à API para integrações externas.
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

      {form.watch("apiEnabled") && (
        <>
          <FormField
            control={form.control}
            name="authType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Autenticação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="key">Chave API</SelectItem>
                    <SelectItem value="jwt">JWT</SelectItem>
                    <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Método de autenticação para acesso à API.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tokenExpiration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiração de Token (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Por quanto tempo os tokens de acesso permanecem válidos.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rateLimiting"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Limitação de Taxa</FormLabel>
                  <FormDescription>
                    Limita o número de chamadas de API por chave.
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

          {form.watch("rateLimiting") && (
            <FormField
              control={form.control}
              name="maxRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de Requisições (por hora)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número máximo de requisições permitidas por hora.
                  </FormDescription>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="allowedOrigins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origens Permitidas (CORS)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite as origens, uma por linha (use * para qualquer origem)"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Domínios que podem fazer requisições à API.
                </FormDescription>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {renderForm()}
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">Salvar Configurações</Button>
        </div>
      </form>
    </Form>
  );
}
