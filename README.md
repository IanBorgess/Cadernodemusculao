# 💪 Caderno de Musculação

Aplicação web para registro e acompanhamento de treinos de musculação. Desenvolvida com React, TypeScript e integração com Supabase para autenticação e persistência de dados.

## 🚀 Tecnologias

**Frontend**
- [React 18](https://react.dev/) com TypeScript
- [Vite 6](https://vitejs.dev/) — bundler e dev server
- [Tailwind CSS 4](https://tailwindcss.com/) — estilização utilitária
- [MUI (Material UI) 7](https://mui.com/) — componentes de interface
- [Radix UI](https://www.radix-ui.com/) — componentes acessíveis (accordion, dialog, select, etc.)
- [React Router 7](https://reactrouter.com/) — roteamento
- [React Hook Form](https://react-hook-form.com/) — gerenciamento de formulários
- [Recharts](https://recharts.org/) — gráficos e visualizações
- [Motion](https://motion.dev/) — animações
- [Lucide React](https://lucide.dev/) — ícones
- [date-fns](https://date-fns.org/) — manipulação de datas

**Backend / Infraestrutura**
- [Supabase](https://supabase.com/) — autenticação e banco de dados (PostgreSQL)
- [Deno](https://deno.com/) + [Hono](https://hono.dev/) — servidor de funções serverless

## 📁 Estrutura do Projeto

```
Cadernodemusculao/
├── src/                        # Código fonte do frontend
├── supabase/
│   └── functions/
│       └── server/             # Funções serverless (Deno + Hono)
│           ├── index.ts        # Servidor HTTP principal
│           └── kv_store.tsx    # Interface de chave-valor com Supabase
├── utils/
│   └── supabase/               # Utilitários do cliente Supabase
├── guidelines/                 # Diretrizes do projeto
├── index.html
├── package.json
├── vite.config.ts
└── postcss.config.mjs
```

## ⚙️ [Link para o Aplicativo](https://panel-slept-45172782.figma.site/login)

## 🔌 API (Funções Serverless)

O servidor roda com Deno + Hono e expõe os seguintes endpoints:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/make-server-70c28b64/health` | Verifica se o servidor está no ar |
| `POST` | `/make-server-70c28b64/signup` | Cadastro de novo usuário |

### Exemplo de cadastro

```http
POST /make-server-70c28b64/signup
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

## 🗄️ Armazenamento de Dados

O projeto utiliza um KV Store sobre o Supabase (`kv_store`) com as seguintes operações:

- `get` / `set` / `del` — operações simples por chave
- `mget` / `mset` / `mdel` — operações em lote
- `getByPrefix` — busca por prefixo de chave

## 🔗 Links

- [Painel do Supabase](https://supabase.com/dashboard/project/mbdmxdymavamxdozkmkk/database/tables)

## 👤 Autores

- **Ian Borges** — [@IanBorgess](https://github.com/IanBorgess)
- **Daniel Martins**
- **Igor Hagge**
- **Kaua Sampaio**
- **Pedro Felipe**
