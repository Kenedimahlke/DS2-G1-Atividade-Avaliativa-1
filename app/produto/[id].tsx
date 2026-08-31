import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ============================================================
// TELA 2 — DETALHE + EDITAR/EXCLUIR  (você implementa)
// ------------------------------------------------------------
// TODO 1: ler o id da rota -> useLocalSearchParams<{ id: string }>()
// TODO 2: useQuery({ queryKey: ["product", id], queryFn: () => getProduct(id) })
// TODO 3: tratar carregando / erro / não encontrado
// TODO 4: exibir imagem, título, preço, categoria, descrição (dentro de ScrollView)
// TODO 5: EDITAR -> navegar p/ /novo passando { id }  (o form abre em modo edição)
//         ex.: router.push({ pathname: "/novo", params: { id } })
// TODO 6: EXCLUIR -> Alert.alert de confirmação -> useMutation(() => deleteProduct(id))
//         no onSuccess: remover o item do cache ["products"] e router.back()
//
// Dica de cache (remover da lista sem refazer o fetch):
//   queryClient.setQueryData<ProductsResponse>(["products"], (old) =>
//     old ? { ...old, products: old.products.filter((p) => String(p.id) !== id) } : old
//   );
// ============================================================

export default function DetalheScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.center}>
        <Text style={styles.title}>Detalhe</Text>
        <Text style={styles.hint}>Implemente detalhe + editar/excluir aqui.</Text>
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
