
export type Category = 'Vestidos' | 'Blusas' | 'Saias' | 'Calças' | 'Conjuntos' | 'Acessórios';

export interface Product {
  id: string;
  nome: string;
  subtitulo: string;
  preco: string | number;
  categoria: Category;
  imagem: string;
  whatsapp: string;
  promocao: string; // "Sim" ou "Não"
}

export interface CartItem extends Product {
  quantity: number;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';
