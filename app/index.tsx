import {
  Text, View, FlatList, ActivityIndicator, Pressable, StyleSheet, Image, TextInput, ScrollView
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../src/api";
import { router } from "expo-router";
import { useState, useMemo } from "react";

// ============================================================
// TELA 1 — LISTA
// ------------------------------------------------------------
// TODO 1: useQuery -> isPending / isError (botão "tentar de novo")
// TODO 2: FlatList (keyExtractor, renderItem)  [NADA de .map em ScrollView]
// TODO 3: busca por título + filtro por categoria (chips) — COMBINAM
// TODO 4: categorias DERIVADAS com useMemo (tipado, sem lista fixa)
// TODO 5: pull-to-refresh (refreshing + onRefresh -> refetch) + ListEmptyComponent
// TODO 6: card <Pressable> navega p/ /produto/[id]
// TODO 7: atalho para abrir /novo
// ============================================================

export default function ListaScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isPending, isError, refetch, isRefetching } = useQuery({
    queryKey: ['itens'],
    queryFn: async () => {
      const res = await getProducts();
      return res.products;
    },
  });

  const categories = useMemo(() => {
    if (!data) return [];
    const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
    return uniqueCategories;
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [data, search, selectedCategory]);

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Não foi possível carregar os produtos.</Text>
        <Pressable style={styles.button} onPress={() => refetch()}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.button} onPress={() => router.push('/novo')}>
        <Text style={styles.headerText}>Adicionar Produto</Text>
      </Pressable>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        <Pressable
          style={[styles.chip, selectedCategory === null && styles.chipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.chipText, selectedCategory === null && styles.chipTextActive]}>Todas</Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[styles.chip, selectedCategory === category && styles.chipActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.chipText, selectedCategory === category && styles.chipTextActive]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredData}
        style={styles.list}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum produto encontrado.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/produto/${item.id}`)}
          >
            <Image
              style={styles.thumbnail}
              source={{ uri: item.thumbnail }}
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.categoria} numberOfLines={1}>{item.category}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.preco}>R$ {Number(item.price).toFixed(2).replace('.', ',')}</Text>
                <Text style={[styles.badge, item.stock > 0 ? styles.badgeOn : styles.badgeOff]}>
                  {item.stock > 0 ? 'Disponível' : 'Indisponível'}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  listContent: { paddingVertical: 4 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  thumbnail: { width: 84, height: 84, borderRadius: 8, backgroundColor: "#f3f4f6" },
  cardBody: { flex: 1, justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  categoria: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  preco: { fontSize: 16, fontWeight: "700", color: "#2563eb" },
  badge: { fontSize: 12, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: "hidden" },
  badgeOn: { backgroundColor: "#d1fae5", color: "#065f46" },
  badgeOff: { backgroundColor: "#fee2e2", color: "#991b1b" },

  empty: { color: "#666", textAlign: "center", marginTop: 24 },
  error: { color: "#ef4444", textAlign: "center" },

  button: { backgroundColor: "#2563eb", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginTop: 12, marginHorizontal: 16 },
  buttonText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  headerText: { color: "#fff", fontWeight: "700", textAlign: "center" },

  searchContainer: { padding: 16, backgroundColor: "#f3f4f6" },
  searchInput: { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16 },


  categoriesScroll: { flexGrow: 0 },
  categoriesContent: { paddingHorizontal: 16, paddingVertical: 8, alignItems: "center" },
  chip: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8 },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#111827" },
  chipTextActive: { color: "#fff" },
});
