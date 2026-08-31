// Cliente da API DummyJSON. NÃO precisa mexer neste arquivo —
// só chamar estas funções (de dentro do TanStack Query).
//
// ATENÇÃO: create/update/delete são SIMULADOS. A API responde certo,
// mas NÃO salva nada. Para a UI mudar, atualize o cache do TanStack Query
// depois da mutation (veja os TODO nas telas).

import type {
  Product,
  ProductsResponse,
  NewProduct,
  DeletedProduct,
} from "./types";

const BASE_URL = "https://dummyjson.com";

// Helper tipado: centraliza fetch + checagem de erro. É o mesmo fetch do web.
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`Erro ${res.status} em ${path}`);
  return res.json() as Promise<T>;
}

export function getProducts() {
  return http<ProductsResponse>("/products?limit=100");
}

export function getProduct(id: number | string) {
  return http<Product>(`/products/${id}`);
}

// POST simulado: responde com o objeto criado (id novo), mas não persiste.
export function createProduct(data: NewProduct) {
  return http<Product>("/products/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT simulado: responde com o objeto atualizado, mas não persiste.
export function updateProduct(id: number | string, data: Partial<NewProduct>) {
  return http<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE simulado: responde com isDeleted/deletedOn, mas não persiste.
export function deleteProduct(id: number | string) {
  return http<DeletedProduct>(`/products/${id}`, { method: "DELETE" });
}
