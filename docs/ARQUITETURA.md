# Arquitetura

## Visão geral
Single Page Application em Vue 3 (Composition API, `<script setup>`). Estado global em Pinia, navegação com Vue Router em modo hash (funciona em qualquer hospedagem estática, sem configurar redirecionamentos).

```
Views (telas) ──► Stores Pinia ──► localStorage
                      │
              (futuro) API REST ──► PostgreSQL
```

## Decisões
- **Pinia com duas stores**: `auth` (identidade e sessão) e `clinic` (dados clínicos). Os dados clínicos são gravados na chave `fono:data:<idDaUsuária>`, o que isola cada conta no mesmo navegador.
- **Rotas protegidas** por `beforeEach`: sem login, tudo redireciona para `/login`; logada, `/login` e `/cadastro` redirecionam para o painel.
- **Camada de dados única** (`clinic.add/update/remove`): para migrar para um backend, basta trocar o corpo dessas ações por chamadas HTTP; as telas não mudam.
- **Sem dependências de UI**: CSS próprio com variáveis, acessível (foco visível, `aria-label`, `role="alert"`), responsivo e com estilos de impressão para o relatório.

## Modelo de dados
- **Paciente**: `id, name, birth, guardian, phone, complaint, active, anamnese{gestacao, audicao, alimentacao, linguagem, escola, objetivos}`
- **Sessão**: `id, patientId, date, goal, activities, notes, score(0-10)`
- **Consulta**: `id, patientId, when, notes, status`

## Plano de migração para backend
1. API REST: `POST /auth/register`, `POST /auth/login`, CRUD de `/patients`, `/sessions`, `/appointments`.
2. Senhas com argon2; JWT em cookie `HttpOnly`.
3. PostgreSQL com criptografia em repouso e tabela de auditoria de acessos.
4. Trocar as ações das stores por `fetch` mantendo as mesmas assinaturas.
