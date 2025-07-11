#JusIA Contábil
Visão Geral do Projeto
O JusIA Contábil é uma aplicação web moderna desenvolvida em ReactJS com Vite, projetada para automatizar a captação e organização de dados contábeis provenientes de processos de justiça. Através de uma interface amigável, usuários podem fazer upload de documentos (imagens e PDFs) que são processados por um agente de Inteligência Artificial, resultando na extração de informações financeiras e cadastrais relevantes, organizadas e acessíveis em um banco de dados.

O objetivo principal é otimizar o fluxo de trabalho contábil-jurídico, reduzindo a necessidade de entrada manual de dados e garantindo a precisão das informações através da automação inteligente.

Funcionalidades
Autenticação Segura: Sistema de login para acesso restrito à aplicação.

Upload de Documentos: Interface para upload de arquivos em formatos de imagem e PDF.

Armazenamento em Nuvem: Documentos armazenados de forma segura no Supabase Storage.

Extração de Dados por IA: Processamento de documentos por um agente de Inteligência Artificial (via n8n) para identificar e extrair dados contábeis e de cliente.

Gestão de Clientes: Página dedicada para visualização dos dados dos clientes, com informações detalhadas expandidas ao clicar no nome.

Integração com n8n: Orquestração do fluxo de processamento de IA e retorno de dados.

Notificações em Tempo Real: (Opcional, a ser implementado) Feedback sobre o status do processamento dos documentos.

Tecnologias Utilizadas
Frontend:

ReactJS: Biblioteca para construção da interface de usuário.

Vite: Ferramenta de build rápida e eficiente para desenvolvimento React.

React Router DOM: Para gerenciamento de rotas e navegação.

useReducer: Gerenciamento de estado complexo e centralizado na aplicação.

Hooks Personalizados: Lógica de negócio reutilizável e modular.

JavaScript (ou TypeScript): Linguagem principal de desenvolvimento.

Backend & Banco de Dados:

Supabase:

Auth: Sistema de autenticação de usuários.

PostgreSQL Database: Banco de dados relacional para armazenamento de registros de arquivos e dados de clientes.

Storage: Serviço de armazenamento de objetos para os arquivos de imagem e PDF.

Automação & Inteligência Artificial:

n8n: Plataforma de automação de fluxo de trabalho (workflow automation) que orquestra:

Webhooks: Para receber notificações da aplicação React.

Nós HTTP: Para interagir com serviços externos (ex: baixar arquivos do Supabase Storage).

Nós de Processamento de IA/LLM: Para OCR e extração inteligente de dados.

Nós Supabase: Para interagir diretamente com o banco de dados do Supabase.

Arquitetura Simplificada
A arquitetura do projeto segue um padrão desacoplado onde o frontend (React com Vite) interage diretamente com o Supabase para autenticação, armazenamento e banco de dados. Para o processamento inteligente, o frontend notifica o n8n via um webhook com a URL do arquivo. O n8n, por sua vez, baixa o arquivo, o processa com IA e persiste os dados extraídos de volta no Supabase, de onde o frontend recupera as informações para exibição.

+----------------+       +-------------------+       +---------------------+       +----------------+
|                |       |                   |       |                     |       |                |
| React App      +------>+ Supabase Auth     +------>+ n8n (AI Agent)      +------>+ Supabase DB    |
| (Vite, useReducer) |       | (Login)           |       | (Webhook, OCR, LLM) |       | (Files, Clients) |
|                |       |                   |       |                     |       |                |
|                +------>+ Supabase Storage  +<----------------------------+       |                |
| (Upload Files) |       | (Store PDFs/Images) |                                   |                |
+----------------+       +-------------------+       +---------------------+       +----------------+
Configuração e Instalação
Pré-requisitos
Node.js (LTS recomendado) e npm (ou yarn)

Uma conta Supabase

Uma instância do n8n (local ou em nuvem)

Passos para Configuração
Clonar o Repositório (ou iniciar o projeto Vite):

Bash

# Se você já iniciou o projeto com os comandos anteriores, pule esta etapa
npm create vite@latest meu-projeto-ia-n8n -- --template react-ts # ou --template react
cd meu-projeto-ia-n8n
Instalar Dependências:

Bash

npm install
npm install @supabase/supabase-js react-router-dom
# Adicione suas bibliotecas de estilização aqui, ex: npm install tailwindcss postcss autoprefixer
Configurar Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e adicione suas credenciais do Supabase e a URL do webhook do n8n. Lembre-se do prefixo VITE_ no Vite.

Snippet de código

VITE_SUPABASE_URL="SUA_URL_DO_PROJETO_SUPABASE"
VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_DO_PROJETO_SUPABASE"
VITE_N8N_WEBHOOK_URL="SUA_URL_DO_WEBHOOK_N8N"
Configurar Supabase:

No console do Supabase, crie as tabelas files e clients (conforme SQLs fornecidos anteriormente na discussão).

Configure um bucket no Supabase Storage (ex: document-uploads) para armazenar os arquivos.

Ajuste as políticas de Row Level Security (RLS) para acesso adequado.

Configurar n8n:

Crie um novo workflow no n8n.

Adicione um nó Webhook como o gatilho inicial.

Configure os nós para baixar o arquivo, processá-lo com IA (OCR, LLM), e salvar os dados extraídos de volta no Supabase.

Assegure que as credenciais para acessar o Supabase a partir do n8n (ex: service_role_key ou uma chave API com permissões adequadas) estejam configuradas com segurança.

Rodar a Aplicação
Bash

npm run dev
A aplicação estará disponível em http://localhost:5173 (ou outra porta indicada pelo Vite).

Preferências de Desenvolvimento
Este projeto foi construído seguindo as seguintes preferências de desenvolvimento:

Vite: Escolhido como ferramenta de build principal pela sua velocidade e experiência de desenvolvimento aprimorada.

useReducer em vez de useState: Para gerenciamento de estado mais robusto e previsível, especialmente em componentes com lógicas complexas. Os reducers e initialState são definidos em arquivos externos para melhor organização.

Hooks Personalizados: Utilização extensiva de hooks personalizados para encapsular lógicas reutilizáveis de forma limpa e manter os componentes mais focados na UI.

Exportações Nomeadas: Priorização de exportações nomeadas em vez de exportações default para maior clareza e facilidade de refatoração no codebase.