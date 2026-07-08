# Klio Coder (MVP Privado Técnico)

## Estado Atual do Repositório
Este repositório é o app separado da Klio. A Klio é o assistente técnico privado para o desenvolvedor (Antônio), desenhada para preparar intenções, forjar prompts complexos e organizar especificações de código.

**Atenção:** Klio não é a versão pública V27, nem o Kuan, nem o Guardião.

### O que a Klio faz (Escopo Permitido):
- Conversa, organiza intenção e cria prompts (`Klio Chat`).
- Forja prompts arquiteturais (`PromptForge` - próximo passo).
- Mantém decisões arquiteturais (`Decisão` - planejado).
- Mantém um histórico de padrões e preferências técnicas (`Memória Técnica` - planejado).
- Prepara planos para o motor coder (`App Builder` - planejado).

### O que a Klio **NÃO** faz (Fora do Escopo):
- Não executa comandos automaticamente no terminal.
- Não possui um backend ativo rodando localmente (Supabase, Cloudflare Worker, etc. não integrados).
- Não gera patches automaticamente sem ser requisitada via motor coder separado.
- Não há IA online de terceiros configurada diretamente (nem OpenRouter nativo ativo para auto-execução).
- Sem telemetria fake, sem login, sem "Héstia Station" ou painéis comerciais.

## Próximos Passos
- Implementar o **PromptForge Core**.
