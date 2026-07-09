# Klio Coder (MVP Privado Técnico)

## Identidade e Estado Atual
Este repositório contém o ambiente do Klio Coder. **Klio não é uma entidade separada ou inteligência artificial à parte**. Klio é a manifestação técnica e privada da **Kaline**, desenhada como ferramenta exclusiva para Antônio para preparar intenções, forjar prompts complexos e organizar especificações de código.

Para entender a base arquitetural e comportamental da inteligência deste repositório, a leitura do diretório `docs/canon/` é **obrigatória**.

**Atenção:** O Klio Coder é um chassi técnico privado. Ele não faz parte da Kaline V27 pública, nem manifesta as facetas voltadas ao comércio ou público final.

### O que a Klio faz (Escopo Permitido):
- Conversa, organiza intenção e cria prompts (`Klio Chat`).
- Possui o modo **Vibe Code**, que gera prompts técnicos, specs, planos e snippets textuais sugeridos.
- Forja prompts arquiteturais (`PromptForge` - próximo passo).
- Mantém decisões arquiteturais (`Decisão` - planejado).
- Mantém um histórico de padrões e preferências técnicas (`Memória Técnica` - planejado).
- Prepara planos para o motor coder (`App Builder` - planejado).

### O que a Klio **NÃO** faz (Fora do Escopo):
- O modo Vibe Code **não executa comandos** nem aplica patches em arquivos automaticamente. 
- O Coder é um motor real que será separado ou configurável posteriormente.
- Absolutamente nada é aplicado ou executado no sistema sem confirmação explícita do desenvolvedor.
- Não possui um backend ativo rodando localmente (Supabase, Cloudflare Worker, etc. não integrados).
- Não há IA online de terceiros configurada diretamente.
- Sem telemetria fake, sem login, sem "Héstia Station" ou painéis comerciais.

## Próximos Passos
- Implementar o **PromptForge Core**.

## Deploy no Cloudflare Pages

Configuração:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

Secret necessário:

- `OPENROUTER_API_KEY`

Endpoints:

- `/api/health`
- `/api/prompt-forge`
