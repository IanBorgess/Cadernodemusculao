# 📐 Guidelines — Caderno de Musculação

Diretrizes de padrões de código e arquitetura do projeto. Seguir essas convenções garante consistência, legibilidade e facilidade de manutenção ao longo do tempo.

---

## 1. Estrutura de Pastas

```
src/
├── components/         # Componentes reutilizáveis
│   ├── ui/             # Componentes base (botões, inputs, modais...)
│   └── [feature]/      # Componentes específicos de uma feature
├── pages/              # Páginas da aplicação (uma por rota)
├── hooks/              # Custom hooks React
├── services/           # Chamadas à API e ao Supabase
├── store/              # Estado global (se aplicável)
├── types/              # Tipos e interfaces TypeScript
├── utils/              # Funções utilitárias puras
└── assets/             # Imagens, ícones e fontes estáticas
```

**Regras:**
- Cada pasta de feature deve ser **autocontida**: componentes, hooks e tipos daquela feature ficam juntos.
- Nunca importar de `pages/` dentro de `components/`.
- Evitar arquivos soltos na raiz do `src/` — tudo tem um lugar.

---

## 2. Nomenclatura

### Arquivos e Pastas
| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente React | PascalCase | `TrainingCard.tsx` |
| Hook customizado | camelCase com prefixo `use` | `useTrainingLog.ts` |
| Serviço / utilitário | camelCase | `supabaseClient.ts` |
| Tipos e interfaces | PascalCase | `Training.ts` |
| Pasta de feature | kebab-case | `training-log/` |

### Variáveis e Funções
- Variáveis e funções: `camelCase`
- Constantes globais: `UPPER_SNAKE_CASE`
- Tipos e interfaces: `PascalCase`, com prefixo `I` apenas para interfaces quando houver ambiguidade (`ITraining`)
- Booleanos: prefixo descritivo — `isLoading`, `hasError`, `canEdit`

---

## 3. Componentes React

### Estrutura padrão de um componente

```tsx
// 1. Imports externos
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Tipos locais
interface TrainingCardProps {
  title: string
  date: string
  onEdit: () => void
}

// 3. Componente
export function TrainingCard({ title, date, onEdit }: TrainingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <h2>{title}</h2>
      <span>{date}</span>
      <Button onClick={onEdit}>Editar</Button>
    </div>
  )
}
```

**Regras:**
- Sempre usar **function declarations** com export nomeado. Evitar `export default` em componentes.
- Props sempre tipadas com `interface`, nunca `any`.
- Componentes de UI puros (sem lógica de negócio) ficam em `components/ui/`.
- Componentes com mais de ~150 linhas devem ser quebrados em subcomponentes.

---

## 4. TypeScript

- **Nunca usar `any`**. Prefira `unknown` quando o tipo for incerto e trate-o explicitamente.
- Sempre tipar o retorno de funções que não sejam triviais.
- Usar `type` para unions e interseções; `interface` para objetos com possibilidade de extensão.
- Habilitar `strict: true` no `tsconfig.json` e não suprimir erros com `// @ts-ignore`.

```ts
// ✅ Correto
function calcularVolume(series: number, reps: number, peso: number): number {
  return series * reps * peso
}

// ❌ Evitar
function calcularVolume(series: any, reps: any, peso: any) {
  return series * reps * peso
}
```

---

## 5. Estilização

O projeto usa **Tailwind CSS 4**. Seguir as regras abaixo para manter consistência:

- Estilização feita via **classes utilitárias do Tailwind**, diretamente no JSX.
- Não criar arquivos `.css` avulsos, exceto para estilos globais em `index.css`.
- Para condicionais de classe, usar a lib `clsx` + `tailwind-merge` (já instaladas):

```tsx
import { cn } from '@/utils/cn'

<div className={cn('p-4 rounded-lg', isActive && 'bg-blue-500', className)}>
```

- Tokens de design (cores, espaçamentos) devem ser definidos no `tailwind.config` e não hardcoded.
- Componentes de UI base (como `Button`, `Input`) usam **Radix UI** como primitiva e **Tailwind** para estilo — não recriar do zero o que já existe.

---

## 6. Integração com Supabase

- Toda comunicação com o Supabase deve passar por **funções de serviço** em `src/services/`, nunca diretamente dentro de componentes.
- O cliente Supabase deve ser instanciado uma única vez (em `utils/supabase/`) e importado onde necessário.

```ts
// src/services/treinos.ts
import { supabase } from '@/utils/supabase/client'

export async function getTreinosByUser(userId: string) {
  const { data, error } = await supabase
    .from('treinos')
    .select('*')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return data
}
```

- Nunca expor a `service_role_key` no frontend. Ela é exclusiva do servidor (funções Deno/Hono).
- Tratar **sempre** o campo `error` retornado pelo Supabase antes de usar `data`.

---

## 7. Funções Serverless (Deno + Hono)

Localizadas em `supabase/functions/server/`.

- Cada endpoint deve ter **validação de body** antes de processar.
- Retornar erros com status HTTP correto (`400` para dados inválidos, `500` para erro interno).
- Não duplicar lógica entre endpoints — extrair para funções auxiliares.
- O KV Store (`kv_store.tsx`) é a interface de persistência simples. Usar chaves com prefixo por domínio:

```ts
// ✅ Chaves com prefixo claro
await kv.set(`treino:${userId}:${treinoId}`, dados)
await kv.getByPrefix(`treino:${userId}`)

// ❌ Chaves soltas
await kv.set('dados', dados)
```

---

## 8. Gerenciamento de Estado

- **Estado local** (`useState`, `useReducer`): para estado de UI e dados de um único componente.
- **Estado compartilhado entre componentes próximos**: elevar o estado ao pai mais próximo (lifting state up).
- **Estado global**: usar com parcimônia. Só adotar uma lib de estado global (ex: Zustand) se o estado precisar ser acessado em partes distantes da árvore de componentes.
- Nunca armazenar dados do servidor no estado global — usar o padrão de cache de server state (React Query ou similar, se adotado).

---

## 9. Tratamento de Erros

- Toda função assíncrona deve ter tratamento de erro explícito (`try/catch` ou verificação do retorno).
- Erros de UI devem ser comunicados ao usuário com o componente `Sonner` (toast), já instalado no projeto.
- Não usar `console.log` em código de produção. Usar `console.error` apenas para erros reais.

```tsx
// ✅
try {
  await salvarTreino(dados)
  toast.success('Treino salvo!')
} catch (error) {
  toast.error('Erro ao salvar treino.')
  console.error(error)
}
```

---

## 10. Boas Práticas Gerais

- **DRY** (Don't Repeat Yourself): se um trecho de lógica ou JSX se repete em mais de dois lugares, extraia para uma função ou componente.
- **Funções pequenas**: cada função deve fazer uma única coisa bem feita.
- **Sem comentários óbvios**: comentar o *porquê*, não o *o quê*. Código legível dispensa comentários descritivos.
- **Imports absolutos**: configurar paths absolutos (`@/`) no `tsconfig.json` e usar sempre no lugar de `../../`.
- **Acessibilidade**: componentes interativos devem ter atributos `aria-*` adequados. Usar as primitivas do Radix UI que já lidam com isso nativamente.
