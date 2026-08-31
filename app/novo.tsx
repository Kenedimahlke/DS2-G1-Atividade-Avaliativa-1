import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ============================================================
// TELA 3 — FORMULÁRIO: CRIAR E EDITAR  (você implementa)
// ------------------------------------------------------------
// A MESMA tela cria e edita. Lê um id OPCIONAL da rota:
//   sem id  -> modo criar   (createProduct)
//   com id  -> modo editar  (carrega o produto, reset(...) e updateProduct)
//
// TODO 1: schema Zod + useForm<NewProduct>({ resolver: zodResolver(schema) })
// TODO 2: um <Controller> por campo (title, price, category, description)
//         Lembre: TextInput usa onChangeText(string), NÃO onChange(event). É Controller, não register.
// TODO 3: KeyboardAvoidingView + keyboardType correto (price = "numeric")
// TODO 4: modo edição -> const { id } = useLocalSearchParams<{ id?: string }>()
//         se id existe: useQuery p/ carregar e reset(dados) quando chegar
// TODO 5: useMutation(createProduct | updateProduct) — botão disabled enquanto envia
// TODO 6: onSuccess -> atualizar cache ["products"] (adiciona ou substitui) -> router.back()
//
// Imports que você vai precisar (exemplos):
//   import { useForm, Controller } from "react-hook-form";
//   import { zodResolver } from "@hookform/resolvers/zod";
//   import { z } from "zod";
//   import { createProduct, updateProduct, getProduct } from "../src/api";
// ============================================================

export default function FormularioScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.center}>
        <Text style={styles.title}>Formulário</Text>
        <Text style={styles.hint}>Implemente criar/editar aqui.</Text>
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
