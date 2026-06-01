# 💪 Caderno de Musculação

Aplicação web para registro e acompanhamento de treinos de musculação, desenvolvida com React, TypeScript, Vite e Supabase.

---

## 📋 Requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

| Ferramenta | Versão mínima | Download |
|---|---|---|
| Node.js | 18.x ou superior | [nodejs.org](https://nodejs.org) |
| npm | 9.x ou superior | Incluso com Node.js |
| Git | Qualquer versão recente | [git-scm.com](https://git-scm.com) |

> **Opcional — para geração de APK Android:**
> - Android Studio (versão Hedgehog ou superior)
> - Java JDK 17+
> - Android SDK (API 34 recomendado)

---

## 🚀 Instalação e Execução Local

### 1. Clone o repositório

```bash
git clone https://github.com/IanBorgess/Cadernodemusculao.git
cd Cadernodemusculao
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

> 💡 Você encontra esses valores no painel do Supabase em **Settings → API**.
> Sem essas variáveis, o app não conseguirá se conectar ao banco de dados.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: **[cadernodemusculao.vercel.app](https://cadernodemusculao.vercel.app/login)**

---

## 🏗️ Build de Produção

Para gerar os arquivos otimizados para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

Para visualizar o build localmente:

```bash
npm run preview
```

---

## 📱 Gerando o APK Android

### Pré-requisitos adicionais

- Android Studio instalado
- Android SDK configurado

### Passo a passo

**1. Instale o Capacitor:**

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Caderno de Musculação" "com.seunome.cadernodemusculacao" --web-dir=dist
```

**2. Gere o build e sincronize:**

```bash
npm run build
npx cap add android
npx cap sync
```

**3. Abra no Android Studio:**

```bash
npx cap open android
```

**4. Gere o APK:**

No Android Studio: **Build → Generate App Bundles or APKs → Generate APKs**

O APK será gerado em:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## ☁️ Deploy (Hospedagem Gratuita)

### Vercel (recomendado)

1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub
2. Importe o repositório **Cadernodemusculao**
3. Em **Environment Variables**, adicione as variáveis do Supabase:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

---

## 🗂️ Estrutura do Projeto

```
Cadernodemusculao/
├── src/                    # Código-fonte principal
├── utils/supabase/         # Configuração do cliente Supabase
├── supabase/functions/     # Edge functions do Supabase
├── guidelines/             # Diretrizes do projeto
├── public/                 # Arquivos estáticos públicos
├── index.html              # HTML de entrada
├── vite.config.ts          # Configuração do Vite
├── package.json            # Dependências e scripts
└── .env                    # Variáveis de ambiente (não versionar!)
```

---

## 🔧 Tecnologias Utilizadas

- **React 18** — Interface de usuário
- **TypeScript** — Tipagem estática
- **Vite 6** — Bundler e servidor de desenvolvimento
- **Tailwind CSS 4** — Estilização
- **Supabase** — Backend, banco de dados e autenticação
- **Radix UI** — Componentes acessíveis
- **React Router 7** — Roteamento
- **Capacitor** — Geração de APK Android/iOS

---

## ⚠️ Observações Importantes

- **Nunca suba o arquivo `.env`** para o repositório. Ele contém chaves sensíveis do Supabase.
- As pastas `dist/` e `android/` são geradas automaticamente e também não devem ser versionadas.
- O projeto utiliza **pnpm** como gerenciador preferencial internamente, mas funciona normalmente com `npm`.
- Caso encontre erros de dependências, tente limpar o cache: `npm cache clean --force` e reinstale com `npm install`.
- Para o APK funcionar corretamente em produção, configure a URL do app hospedado no `capacitor.config.ts` antes de gerar o APK.

---

## 📄 Licença

Este projeto foi gerado a partir do template [figma/repo-template](https://github.com/figma/repo-template).
Consulte o arquivo [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) para informações sobre atribuições.
