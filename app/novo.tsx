import { useEffect, useMemo, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, getProduct, getProducts } from "../src/api";
import type { Product, NewProduct } from "../src/types";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Switch, Text, TextInput, View
} from "react-native";
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
const schema = z.object({
  title: z.string().trim().min(3, "Mínimo de 3 caracteres."),
  price: z
    .string()
    .trim()
    .min(1, "Informe o preço.")
    .refine((v) => !Number.isNaN(Number(v.replace(",", "."))), "Preço inválido.")
    .refine((v) => Number(v.replace(",", ".")) > 0, "Deve ser maior que 0."),
  category: z.string().trim().min(1, "Selecione uma categoria."),
  description: z.string().trim().optional(),
  available: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function FormularioScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const queryClient = useQueryClient();

  const priceRef = useRef<TextInput>(null);
  const descRef = useRef<TextInput>(null);

  const {
    control, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", price: "", category: "", description: "", available: true },
  });

  const descricaoAtual = watch("description") ?? "";

  // Carrega produtos p/ derivar categorias
  const produtos = useQuery({
    queryKey: ["itens"],
    queryFn: () => getProducts().then((r) => r.products),
  });
  const categorias = useMemo(
    () => Array.from(new Set((produtos.data ?? []).map((p) => p.category))),
    [produtos.data]
  );
  // Carrega produto atual p/ edição (se id existe)
  const produtoAtual = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: isEdit,
  });

  // Quando o produto atual chega, preenche o formulário
  useEffect(() => {
    const p = produtoAtual.data;
    if (p) {
      reset({
        title: p.title,
        price: String(p.price),
        category: p.category,
        description: p.description ?? "",
        available: p.stock > 0,
      });
    }
  }, [produtoAtual.data, reset]);

  // Salva (cria ou atualiza) produto
  const salvar = useMutation({
    mutationFn: (payload: NewProduct) =>
      isEdit ? updateProduct(id!, payload) : createProduct(payload),
    onSuccess: (saved: Product) => {
      queryClient.setQueryData<Product[]>(["itens"], (old) => {
        if (!old) return old;
        return isEdit
          ? old.map((p) => (String(p.id) === id ? { ...p, ...saved } : p))
          : [saved, ...old];
      });

      // Atualiza cache do produto atual (se estiver editando)
      if (isEdit) {
        queryClient.setQueryData<Product>(["product", id], (old) =>
          old ? { ...old, ...saved } : saved
        );
      }
      Alert.alert("Sucesso", isEdit ? "Produto atualizado." : "Produto criado.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    },
  });

  // Converte os valores do formulário p/ o payload da API e chama a mutation
  const onSubmit = (values: FormValues) => {
    const payload: NewProduct = {
      title: values.title,
      price: Number(values.price.replace(",", ".")),
      category: values.category,
      description: values.description?.trim() ? values.description.trim() : undefined,
      stock: values.available ? 1 : 0,
    };
    salvar.mutate(payload);
  };
  // Renderização
  if (isEdit && produtoAtual.isPending) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>
      </SafeAreaView>
    );
  }
  if (isEdit && produtoAtual.isError) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.center}>
          <Text style={styles.title}>Erro</Text>
          <Text style={styles.hint}>Não foi possível carregar o produto para edição.</Text>
          <Pressable style={styles.ghost} onPress={() => router.back()}>
            <Text style={styles.ghostText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Renderiza o formulário
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{isEdit ? "Editar produto" : "Novo produto"}</Text>

          // Título
          <Text style={styles.label}>Título</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Ex.: Mouse Gamer RGB"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => priceRef.current?.focus()}
              />
            )}
          />
          {!!errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

          // Preço
          <Text style={styles.label}>Preço</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                ref={priceRef}
                style={[styles.input, errors.price && styles.inputError]}
                placeholder="Ex.: 99.99"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => descRef.current?.focus()}
              />
            )}
          />
          {!!errors.price && <Text style={styles.error}>{errors.price.message}</Text>}

          // Descrição
          <Text style={styles.label}>Descrição</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                ref={descRef}
                style={[styles.input, styles.textarea]}
                placeholder="Descreva o produto (opcional)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                maxLength={300}
                autoCapitalize="sentences"
              />
            )}
          />
          <Text style={styles.counter}>{descricaoAtual.length}/300</Text>

          // Categoria
          <Text style={styles.label}>Categoria</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => {
              const lista = value && !categorias.includes(value) ? [value, ...categorias] : categorias;
              return (
                <View style={styles.chipsRow}>
                  {lista.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => onChange(cat)}
                      style={[styles.chip, value === cat && styles.chipActive]}
                    >
                      <Text style={value === cat ? styles.chipTextActive : styles.chipText}>{cat}</Text>
                    </Pressable>
                  ))}
                </View>
              );
            }}
          />
          {!!errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

          // Disponibilidade - stock
          <View style={styles.switchRow}>
            <Text style={styles.label}>Disponível</Text>
            <Controller
              control={control}
              name="available"
              render={({ field: { value, onChange } }) => (
                <Switch value={value} onValueChange={onChange} />
              )}
            />
          </View>

          <Pressable
            style={[styles.button, salvar.isPending && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={salvar.isPending}
          >
            {salvar.isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>{isEdit ? "Salvar alterações" : "Criar produto"}</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 12 },
  hint: { color: "#666", textAlign: "center", marginTop: 4 },
  label: { fontSize: 15, fontWeight: "700", color: "#374151", marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, backgroundColor: "#fff",
  },
  inputError: { borderColor: "#ef4444" },
  textarea: { height: 100, textAlignVertical: "top" },
  counter: { color: "#666", textAlign: "right", marginTop: 4 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#111827" },
  chipTextActive: { color: "#fff" },
  switchRow: { marginTop: 8, marginBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  error: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  button: { backgroundColor: "#2563eb", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 24 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  ghost: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: "#d1d5db" },
  ghostText: { color: "#374151", fontWeight: "700" },
});
