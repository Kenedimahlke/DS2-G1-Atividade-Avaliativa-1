import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, deleteProduct } from "../../src/api";
import type { Product } from "../../src/types";
import {
  StyleSheet, Text, View, Image, ScrollView, Pressable, ActivityIndicator, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ============================================================
// TELA 2 — DETALHE + EDITAR/EXCLUIR
// ------------------------------------------------------------
// TODO 1: id da rota            -> useLocalSearchParams<{ id: string }>()
// TODO 2: useQuery ["product", id]
// TODO 3: carregando / erro / não encontrado
// TODO 4: imagem, título, preço, categoria, descrição (dentro de ScrollView)
// TODO 5: EDITAR  -> router.push({ pathname: "/novo", params: { id } })
// TODO 6: EXCLUIR -> Alert -> useMutation(deleteProduct) -> atualiza cache + router.back()
// ============================================================

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });

  const del = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      // Remove da lista SEM refazer o fetch.
      // ATENÇÃO: a Tela 1 usa a chave ['itens'] e guarda SÓ o array (Product[]),
      // não o envelope ProductsResponse — por isso o update é direto no array.
      queryClient.setQueryData<Product[]>(['itens'], (old) =>
        old ? old.filter((p) => String(p.id) !== id) : old
      );
      queryClient.removeQueries({ queryKey: ["product", id] });
      router.back();
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível excluir o produto.");
    },
  });

  function confirmarExclusao() {
    if (!data) return;
    Alert.alert(
      "Excluir produto",
      `Tem certeza que deseja excluir "${data.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => del.mutate() },
      ]
    );
  }

  if (isPending) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.center}>
          <Text style={styles.title}>Erro</Text>
          <Text style={styles.hint}>Não foi possível carregar o detalhe do produto.</Text>
          <Pressable style={styles.btnGhost} onPress={() => router.back()}>
            <Text style={styles.btnGhostText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image style={styles.image} source={{ uri: data.thumbnail }} />
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.price}>R$ {Number(data.price).toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.categoria}>Categoria: {data.category}</Text>
        <Text style={styles.descricao}>{data.description}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.btn, styles.btnEdit]}
          onPress={() => router.push({ pathname: "/novo", params: { id } })}
        >
          <Text style={styles.btnText}>Editar</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnDelete, del.isPending && styles.btnDisabled]}
          onPress={confirmarExclusao}
          disabled={del.isPending}
        >
          {del.isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Excluir</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  scrollContent: { padding: 16, paddingBottom: 24 },

  image: { width: "100%", height: 260, borderRadius: 12, backgroundColor: "#f3f4f6", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 8 },
  price: { fontSize: 18, color: "#2563eb", fontWeight: "700", marginBottom: 8 },
  categoria: { fontSize: 15, fontWeight: "700", color: "#374151", marginBottom: 12 },
  descricao: { fontSize: 15, color: "#4b5563", lineHeight: 22 },
  hint: { color: "#666", textAlign: "center", marginTop: 4 },

  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  btn: { flex: 1, borderRadius: 8, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  btnEdit: { backgroundColor: "#2563eb" },
  btnDelete: { backgroundColor: "#ef4444" },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  btnGhost: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: "#d1d5db" },
  btnGhostText: { color: "#374151", fontWeight: "700" },
});
