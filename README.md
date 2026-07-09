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
- Sem telemetria fake, sem login, sem "Héstia Station" ou painéis comerciais.

### Estado do runtime

- Online: existe endpoint Cloudflare Pages Function em `/api/prompt-forge`.
- Online só responde com IA real se `OPENROUTER_API_KEY` estiver configurada no ambiente Cloudflare.
- Local: depende de Ollama real em execução.
- Supabase: preparado por fronteira de persistência, mas ainda sem migrations/Auth/RLS.
- Nenhum runtime deve simular resposta real quando a integração estiver indisponível.

## Próximos Passos
- Implementar o **PromptForge Core**.



## Persistência

Neste momento, a Klio usa estado local apenas para preferências, rascunhos de sessão e candidatos locais não confirmados.

Isso não é memória técnica confirmada.

A persistência remota em Supabase será adicionada em PR futuro.

Se Supabase não estiver configurado, nenhuma função deve fingir persistência remota.

## Klio Supabase Architecture

A Klio Coder terá persistência técnica no Supabase K∧LINE compartilhado.

O Supabase da Klio será textual e estruturado: mensagens, decisões, eventos, handoffs, sedimentos, memórias aprovadas, auditoria e referências.

Arquivos pesados ficam fora do Supabase.

Este PR documenta a arquitetura. Nenhuma migration ou implementação foi criada.
