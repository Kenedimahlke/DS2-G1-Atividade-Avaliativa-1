import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ============================================================
// TELA 1 — LISTA  (você implementa)
// ------------------------------------------------------------
// TODO 1: useQuery({ queryKey: ["products"], queryFn: getProducts })
//         -> tratar isPending / isError (mostrar botão "tentar de novo")
// TODO 2: FlatList com os produtos (keyExtractor, renderItem)  [NADA de .map em ScrollView]
// TODO 3: campo de busca por título + filtro por categoria (chips) — os dois COMBINAM
// TODO 4: categorias DERIVADAS dos produtos com useMemo (tipado, sem lista fixa)
// TODO 5: pull-to-refresh (refreshing + onRefresh -> refetch) + ListEmptyComponent
// TODO 6: cada card é <Pressable> e navega p/ /produto/[id]  (router.push)
// TODO 7: um botão/atalho para abrir /novo (criar produto)
//
// EXTRA (opcional, só depois do CRUD): painel de multi-filtro
//   texto + categorias em multi-seleção + faixa de preço + ordenação + contador.
//
// Imports que você vai precisar (exemplos):
//   import { useQuery } from "@tanstack/react-query";
//   import { getProducts } from "../src/api";
//   import { Link, router } from "expo-router";
// ============================================================

export default function ListaScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.center}>
        <Text style={styles.title}>Lista</Text>
        <Text style={styles.hint}>Implemente a lista aqui (veja os TODO no arquivo).</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  hint: { color: "#666", textAlign: "center" },
});
