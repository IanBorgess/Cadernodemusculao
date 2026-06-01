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
