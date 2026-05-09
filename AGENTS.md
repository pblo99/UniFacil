# AGENTS.md

## Propósito do projeto

Este repositório contém o protótipo acadêmico do UniFácil.

O UniFácil é um protótipo web estático criado para demonstrar a ideia de uma plataforma acadêmica centralizada para alunos, professores, disciplinas, grupos, materiais, eventos, chat, avaliações e fórum de perguntas e respostas.

O projeto não é um sistema real de produção.

## Objetivo principal

Construir e manter um protótipo responsivo, mobile-first, bonito, navegável e estável para apresentação acadêmica.

O protótipo deve parecer um aplicativo mobile moderno, mas funcionar como site estático.

## Stack obrigatória

Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- localStorage
- dados mockados locais

Não adicione:

- backend
- banco de dados
- autenticação real
- upload real
- chat real
- API externa
- integrações pagas
- analytics
- tracking

## Escopo do produto

O app deve conter:

- Splash
- Login
- Início
- Disciplinas
- Detalhes da disciplina
- Avaliação de disciplina
- Grupos
- Fórum / Q&A
- Chat
- Materiais
- Eventos
- Mais / Perfil

Todas as telas devem ser navegáveis.

Nenhuma ação principal deve levar a uma tela vazia.

## Regras de UI e UX

A interface deve ser mobile-first.

Use visual limpo, acadêmico e moderno.

Use:

- azul como cor principal
- fundo claro
- cards arredondados
- ícones simples
- sombras suaves
- espaçamento consistente
- navegação inferior
- botões grandes
- estados ativos claros
- feedback visual para ações
- animações suaves e discretas
- textos curtos e objetivos

No desktop, manter o app centralizado com aparência de interface mobile.

## Regras de usabilidade

A tela atual deve ser clara.

A navegação deve ser previsível.

O usuário nunca deve ficar preso.

Formulários devem ter validação simples.

Botões devem responder visualmente.

Áreas clicáveis devem ser confortáveis para toque.

O protótipo deve funcionar bem para apresentação presencial.

## Regras de conteúdo

Use português brasileiro.

Use textos naturais, simples e acadêmicos.

Não use dados reais de alunos.

Não use senhas reais.

Não use informações sensíveis.

Não inclua menções a ferramentas de geração, inteligência artificial ou automação no código, interface, README ou textos visíveis do projeto.

## Regras de código

Use código limpo e organizado.

Use TypeScript corretamente.

Use nomes descritivos.

Mantenha dados mockados centralizados em src/data/mockData.ts.

Mantenha tipos em src/types/app.ts.

Mantenha helpers de localStorage em src/utils/storage.ts.

Não deixe código morto.

Não deixe arquivos não usados.

Não deixe console.log.

Não deixe TODO.

Não deixe FIXME.

Não deixe comentários desnecessários.

Não deixe código comentado.

Comentários no código devem ser evitados.

## Regras de acessibilidade

Use HTML semântico quando possível.

Botões devem ser elementos button.

Inputs devem ter label ou aria-label.

Ícones não devem ser a única forma de entender uma ação.

Contraste deve ser legível.

O app deve funcionar com zoom do navegador.

## Verificação

Antes de finalizar qualquer alteração, rode:

npm run build

Se houver lint configurado, rode também:

npm run lint

Não considere a tarefa pronta se houver erro de build, TypeScript ou navegação quebrada.
