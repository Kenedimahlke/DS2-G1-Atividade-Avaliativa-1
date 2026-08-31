// Raiz do app: providers globais + navegação (Stack). PRONTO.
// Equivale ao provider do TanStack Query que você já põe no topo de um app web,
// só que aqui a "árvore de rotas" é o Stack do Expo Router.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

// Um único QueryClient para todo o app.
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Catálogo" }} />
          <Stack.Screen name="produto/[id]" options={{ title: "Detalhe" }} />
          <Stack.Screen name="novo" options={{ title: "Produto" }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
