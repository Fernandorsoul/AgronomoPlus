// Arquivo adicional para APIs que ainda não têm endpoints implementados no backend
// Corrigido: Adicionado para suportar componentes frontend que precisam de dados dinâmicos
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5299/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface MovimentacaoFinanceira {
  id: string;
  usuarioId: string;
  tipoTransacao: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  dataTransacao: string;
  usuario?: any;
}

export interface Animal {
  id: string;
  nome: string;
  tipo: string;
  raca: string;
  dataNascimento: string;
  peso: number;
  genero: 'macho' | 'femea';
  tag: string;
  localizacao: string;
  statusSaude: string;
  vacinacoes: Vacinacao[];
}

export interface Vacinacao {
  id: string;
  vacina: string;
  data: string;
  proximaDose: string;
  veterinario: string;
  notas?: string;
  status: 'aplicada' | 'pendente' | 'atrasada';
}

export interface ItemEstoque {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  dataCompra: string;
  dataValidade?: string;
  fornecedor: string;
  custo: number;
  localizacao: string;
  status: string;
  quantidadeMinima: number;
}

export interface Venda {
  id: string;
  cliente: string;
  tipoCliente: 'pessoa_fisica' | 'pessoa_juridica';
  itens: ItemVenda[];
  valorTotal: number;
  formaPagamento: string;
  status: 'pendente' | 'pago' | 'cancelado';
  notas?: string;
}

export interface ItemVenda {
  id: string;
  produto: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  precoTotal: number;
}

// Funções da API para movimentações financeiras (placeholder até endpoint ser implementado)
export const financeiroApi = {
  getAll: () => Promise.resolve({ data: [] as MovimentacaoFinanceira[] }),
  getById: (id: string) => Promise.resolve({ data: {} as MovimentacaoFinanceira }),
  create: (movimentacao: any) => Promise.resolve({ data: movimentacao }),
  update: (id: string, movimentacao: any) => Promise.resolve({ data: movimentacao }),
  delete: (id: string) => Promise.resolve({ data: null }),
};

// Funções da API para animais (placeholder até endpoint ser implementado)
export const animalApi = {
  getAll: () => Promise.resolve({ data: [] as Animal[] }),
  getById: (id: string) => Promise.resolve({ data: {} as Animal }),
  create: (animal: any) => Promise.resolve({ data: animal }),
  update: (id: string, animal: any) => Promise.resolve({ data: animal }),
  delete: (id: string) => Promise.resolve({ data: null }),
};

// Funções da API para estoque (placeholder até endpoint ser implementado)
export const estoqueApi = {
  getAll: () => Promise.resolve({ data: [] as ItemEstoque[] }),
  getById: (id: string) => Promise.resolve({ data: {} as ItemEstoque }),
  create: (item: any) => Promise.resolve({ data: item }),
  update: (id: string, item: any) => Promise.resolve({ data: item }),
  delete: (id: string) => Promise.resolve({ data: null }),
};

// Funções da API para vendas (placeholder até endpoint ser implementado)
export const vendaApi = {
  getAll: () => Promise.resolve({ data: [] as Venda[] }),
  getById: (id: string) => Promise.resolve({ data: {} as Venda }),
  create: (venda: any) => Promise.resolve({ data: venda }),
  update: (id: string, venda: any) => Promise.resolve({ data: venda }),
  delete: (id: string) => Promise.resolve({ data: null }),
};

export default api;
