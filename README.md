# Catálogo mobile — projeto base da Avaliativa 1

Boilerplate pronto para a prova. Você implementa apenas as telas marcadas com `// TODO`.

## Como rodar

```bash
npm install
# se aparecer aviso de versão de pacote do Expo, alinhe com:
npx expo install --fix
npx expo start
```

Abra o app **Expo Go** (SDK 54) no seu celular e escaneie o QR code.
(Alternativa: `npm run android` / `npm run ios` com emulador.)

## O que já está pronto (não precisa mexer)

- `app/_layout.tsx` — providers (TanStack Query + SafeArea) e navegação (Stack).
- `src/types.ts` — tipos do produto e da resposta da API.
- `src/api.ts` — cliente da API: `getProducts`, `getProduct`, `createProduct`,
  `updateProduct`, `deleteProduct`.

## O que você implementa

- `app/index.tsx` — **Lista** (FlatList + busca + filtro + refresh + estados).
- `app/produto/[id].tsx` — **Detalhe** + **editar** + **excluir**.
- `app/novo.tsx` — **Formulário** que **cria e edita** (RHF + Zod + Controller).

O enunciado completo está em `ENUNCIADO.md`.

## ⚠️ A escrita na API é simulada

`POST`, `PUT` e `DELETE` da DummyJSON respondem certo mas **não persistem**.
Depois de criar/editar/excluir, atualize o **cache do TanStack Query**
(`queryClient.setQueryData(["products"], ...)`) para a lista mudar na tela.
Há dicas de cache nos comentários das telas.

