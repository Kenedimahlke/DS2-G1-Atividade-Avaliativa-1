# Catálogo Mobile

App mobile de catálogo de produtos feito com Expo Router. Consome a API pública DummyJSON e implementa CRUD completo: listar, buscar/filtrar, ver detalhe, criar, editar e excluir produtos.

## Stack

- Expo + TypeScript
- Expo Router
- TanStack Query
- React Hook Form + Zod

## Como rodar

```bash
npm install
npx expo install --fix   # opcional, alinha versões de pacote com o SDK do Expo
npx expo start
```

Abra o app Expo Go (SDK 54) no celular e escaneie o QR code, ou rode `npm run android` / `npm run ios` com um emulador.

## Estrutura

```
app/
├─ _layout.tsx          # providers (TanStack Query + SafeArea) e Stack de navegação
├─ index.tsx            # lista: busca por título, filtro por categoria, pull-to-refresh
├─ novo.tsx              # formulário de criação e edição (React Hook Form + Zod)
└─ produto/[id].tsx     # detalhe do produto: editar e excluir
src/
├─ api.ts               # cliente da API DummyJSON (get/create/update/delete)
└─ types.ts             # tipos de produto e da resposta da API
```

## Funcionalidades

- Lista carregada da API com estados de carregando, erro e vazio, além de pull-to-refresh.
- Busca por título e filtro por categoria (categorias derivadas dos produtos carregados), funcionando em conjunto.
- Detalhe do produto por id, com opção de editar e excluir (exclusão pede confirmação).
- Formulário único para criar e editar, validado com Zod, com feedback de envio e campos desabilitados durante o envio.

## Sobre a API

A escrita (POST, PUT, DELETE) na DummyJSON é simulada: a API responde corretamente, mas não persiste os dados no servidor. Por isso, depois de criar, editar ou excluir um produto, cada tela atualiza o cache do TanStack Query (`queryClient.setQueryData`) para a mudança aparecer na interface sem depender de um novo fetch.
