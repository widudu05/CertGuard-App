import SecurityFeatureItem from "./SecurityFeatureItem";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function SecurityFeatures() {
  const handleConfigure = (feature: string) => {
    console.log(`Configure clicked for ${feature}`);
    // In a real app, this would open a configuration modal or navigate to a config page
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800 text-lg">Ferramentas de Segurança</h2>
        <p className="text-sm text-slate-600">
          Configure recursos de segurança para o gerenciamento de certificados
        </p>
      </div>

      <div className="p-4">
        {/* User Groups */}
        <SecurityFeatureItem
          icon="fa-users-rectangle"
          title="Por grupos de usuários"
          description="Conceda acesso aos certificados com base em grupos de usuários personalizados"
          onConfigure={() => handleConfigure("user-groups")}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-slate-100 text-slate-700">
              Equipe de Desenvolvimento
            </Badge>
            <Badge variant="outline" className="bg-slate-100 text-slate-700">
              Administradores
            </Badge>
            <Badge variant="outline" className="bg-slate-100 text-slate-700">
              Equipe Financeira
            </Badge>
            <Badge variant="outline" className="bg-primary-100 text-primary-700">
              + Adicionar grupo
            </Badge>
          </div>
        </SecurityFeatureItem>

        {/* Sensitive Info Blocking */}
        <SecurityFeatureItem
          icon="fa-eye-slash"
          title="Bloqueio a informações sensíveis"
          description="Proteja dados sensíveis com regras de redação e mascaramento"
          onConfigure={() => handleConfigure("sensitive-info")}
        >
          <div className="flex items-center text-sm">
            <span className="flex items-center text-green-600 mr-4">
              <i className="fa-solid fa-check-circle mr-1"></i>
              5 regras ativas
            </span>
            <span className="flex items-center text-amber-600">
              <i className="fa-solid fa-triangle-exclamation mr-1"></i>
              2 regras precisam de atenção
            </span>
          </div>
        </SecurityFeatureItem>

        {/* Systems and Pages Access */}
        <SecurityFeatureItem
          icon="fa-desktop"
          title="Sistemas e páginas que serão acessadas"
          description="Limite o acesso a sistemas e páginas específicas com certificados"
          onConfigure={() => handleConfigure("systems-access")}
        >
          <div className="flex items-center text-sm">
            <span className="flex items-center text-slate-600 mr-4">
              <i className="fa-solid fa-list mr-1"></i>
              12 sistemas configurados
            </span>
          </div>
        </SecurityFeatureItem>

        {/* URL Restriction */}
        <SecurityFeatureItem
          icon="fa-link-slash"
          title="Restrição por URLs"
          description="Controle o acesso a domínios e URLs específicos"
          onConfigure={() => handleConfigure("url-restriction")}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded flex items-center">
              <i className="fa-solid fa-ban mr-1"></i>
              *.external-domain.com/*
            </div>
            <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded flex items-center">
              <i className="fa-solid fa-check mr-1"></i>
              *.company-domain.com/secure/*
            </div>
          </div>
        </SecurityFeatureItem>

        {/* Certificate Actions */}
        <SecurityFeatureItem
          icon="fa-file-signature"
          title="Ações que serão desempenhadas com o certificado"
          description="Controle quais ações podem ser executadas com cada certificado"
          onConfigure={() => handleConfigure("certificate-actions")}
        >
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <Checkbox id="sign" className="mr-2" defaultChecked />
              <Label htmlFor="sign" className="text-xs">Assinatura Digital</Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="auth" className="mr-2" defaultChecked />
              <Label htmlFor="auth" className="text-xs">Autenticação</Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="encrypt" className="mr-2" />
              <Label htmlFor="encrypt" className="text-xs">Criptografia</Label>
            </div>
            <div className="flex items-center">
              <Checkbox id="nonRepudiation" className="mr-2" defaultChecked />
              <Label htmlFor="nonRepudiation" className="text-xs">Não repúdio</Label>
            </div>
          </div>
        </SecurityFeatureItem>

        {/* Access Hours */}
        <SecurityFeatureItem
          icon="fa-clock"
          title="Horários de acesso"
          description="Defina janelas de tempo específicas para o uso de certificados"
          onConfigure={() => handleConfigure("access-hours")}
        >
          <div className="bg-slate-50 p-2 rounded text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Horário Comercial</span>
              <span className="text-xs text-green-600">Ativo</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <div className="bg-blue-100 text-blue-800 rounded p-1">Seg</div>
              <div className="bg-blue-100 text-blue-800 rounded p-1">Ter</div>
              <div className="bg-blue-100 text-blue-800 rounded p-1">Qua</div>
              <div className="bg-blue-100 text-blue-800 rounded p-1">Qui</div>
              <div className="bg-blue-100 text-blue-800 rounded p-1">Sex</div>
              <div className="bg-slate-100 text-slate-400 rounded p-1">Sáb</div>
              <div className="bg-slate-100 text-slate-400 rounded p-1">Dom</div>
            </div>
            <div className="mt-1 text-xs">08:00 - 18:00</div>
          </div>
        </SecurityFeatureItem>

        {/* Enhanced Security Actions */}
        <SecurityFeatureItem
          icon="fa-shield-halved"
          title="E diversas ações que vão eliminar a insegurança do cenário atual!"
          description="Recursos avançados de segurança para proteger seus certificados"
          onConfigure={() => handleConfigure("enhanced-security")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center text-xs">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span>Detecção de anomalias</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span>Autenticação multifator</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span>Alerta de tentativas de acesso</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span>Revogação de emergência</span>
            </div>
          </div>
        </SecurityFeatureItem>
      </div>
    </div>
  );
}
