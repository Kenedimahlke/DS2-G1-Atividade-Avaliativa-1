// Tipos da fronteira com a API (DummyJSON). Tipar aqui é o que impede
// `any` de vazar para o resto do app. NÃO precisa mexer neste arquivo.

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  images: string[];
  stock: number;
};

// A lista vem embrulhada num envelope de paginação.
export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

// Payload do formulário (criar/editar).
export type NewProduct = {
  title: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
};

// Resposta simulada do DELETE na DummyJSON.
export type DeletedProduct = Product & { isDeleted: boolean; deletedOn: string };
