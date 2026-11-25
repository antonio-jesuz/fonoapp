# FonoApp

Aplicação web de gestão clínica para fonoaudiologia, feita em **Vue 3 + Vite + Pinia + Vue Router**. Criada para uso da fonoaudióloga Karina Pereira.

## Funcionalidades

| Módulo | O que faz |
|---|---|
| Login e cadastro | Conta da profissional com nome, e-mail, CRFa e senha (mínimo 8 caracteres) |
| Painel | Pacientes em atendimento, consultas do dia, últimas sessões |
| Pacientes | Cadastro, busca, exclusão e ficha completa |
| Anamnese | Gestação e desenvolvimento, audição, alimentação, linguagem, escola e objetivos |
| Sessões | Registro com data, objetivo, atividades, observações e nota de desempenho (0 a 10) |
| Evolução e relatório | Gráfico de desempenho por sessão e impressão em PDF |
| Agenda | Consultas com status: agendada, realizada, faltou, cancelada |
| Exercícios e jogos | "Repita a palavra": figura, voz do navegador (pt-BR) e marcação de acerto, por tema de fonema; o resultado vira sessão no histórico do paciente |
| Perfil e backup | Edição de dados e exportação/importação de backup em JSON |

## Identidade visual e uso em clínica

- Paleta de fonoaudiologia: turquesa (calma e confiança), coral e amarelo (voz e ludicidade) sobre azul-petróleo. O motivo central são as **ondas sonoras** (logo e animação do login).
- A ilustração da fonoaudióloga está em `src/components/Therapist.vue` (SVG). Para usar uma foto real, troque o `<Therapist />` por `<img src="/foto.jpg" alt="..." class="art">` e coloque o arquivo em `public/foto.jpg`.
- **Clínica e perfil** guarda nome, telefone e endereço da clínica, que aparecem no menu e no cabeçalho do relatório impresso, com linha de assinatura e CRFa.
- A agenda tem tipo de atendimento (avaliação inicial, terapia, retorno, orientação à família) e status coloridos.

## Como rodar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a pasta dist/ para publicação
npm run preview  # testa o build
```

## Estrutura

```
src/
  main.js            inicialização (Pinia + Router)
  router.js          rotas e proteção de páginas (login obrigatório)
  App.vue            layout com menu lateral
  style.css          estilos globais, responsivo, impressão
  stores/auth.js     cadastro, login e sessão
  stores/clinic.js   pacientes, sessões e agenda
  views/             uma tela por arquivo
docs/ARQUITETURA.md  decisões técnicas e plano de evolução
```

## Como funciona o armazenamento

Esta primeira versão **não tem servidor**. Tudo é salvo no `localStorage` do navegador, separado por usuária. Vantagem: funciona sem configuração. Limites: os dados existem só naquele navegador e computador, e limpar os dados do navegador apaga tudo. Use **Perfil > Exportar backup** com frequência.

## Segurança e LGPD

Dados de saúde são **dados pessoais sensíveis** (LGPD, art. 11). Antes de usar com pacientes reais:

1. A senha é guardada com hash SHA-256 no navegador. Isso serve para esta versão local, mas **não substitui** autenticação em servidor com bcrypt/argon2.
2. Em produção, use HTTPS, backend com banco criptografado, controle de acesso e registro de acessos.
3. Obtenha consentimento do paciente ou responsável para o tratamento dos dados e respeite o sigilo profissional do código de ética da fonoaudiologia.
4. O exercício de voz usa a síntese do próprio navegador; nenhum áudio é enviado para fora.

## Próximos passos sugeridos

Backend (Node/NestJS ou Go) com PostgreSQL e JWT; sincronização entre dispositivos; envio de lembretes por WhatsApp; upload de laudos e áudios de gravação do paciente; mais jogos (sílabas, frases, sequência de sons); testes com Vitest e Playwright; PWA para uso offline em tablet.
