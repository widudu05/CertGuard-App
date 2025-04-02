# Documentação CertGuard

Esta pasta contém a documentação da plataforma CertGuard para gerenciamento de certificados digitais.

## Arquivos

- `CertGuard-Manual-do-Usuario.pdf`: Manual completo do usuário em formato PDF
- `certguard-manual.md`: Versão markdown do manual
- `index.cjs`: Script para gerar o PDF
- `logo.md`: Arquivo markdown com o logotipo
- `headers.js`: Configurações de cabeçalho e rodapé para o PDF
- `pdf-style.css`: Estilos para o PDF

## Como usar

O PDF já está gerado e pronto para uso. Caso precise atualizá-lo, siga os passos abaixo:

1. Edite o arquivo `certguard-manual.md` com as alterações desejadas
2. Execute o script para gerar o PDF:

```bash
cd docs
node index.cjs
```

3. O PDF será gerado/atualizado em `CertGuard-Manual-do-Usuario.pdf`

## Conteúdo do Manual

O manual inclui:

- Introdução ao CertGuard
- Gerenciamento de certificados
- Políticas de acesso
- Gestão de usuários
- Agendamentos
- Registros de auditoria
- Dicas e boas práticas