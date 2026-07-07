# PR 9 — Canon Wiring & Memory Import UI

Este PR conecta a camada canônica criada no PR 7 ao MemoryPanel.

O que faz:
- adiciona botão para importar sementes canônicas da Totalidade;
- grava em kaline_contexts no localStorage;
- evita duplicatas;
- não sobrescreve contextos do usuário.

O que não faz:
- não usa Supabase;
- não cria backend;
- não implementa IA real;
- não altera RLS;
- não importa rotas do Totalidade;
- não cria nova tela.
