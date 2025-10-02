// Arquivo corrigido: adicionado axios como dependência, que estava faltando no package.json
// Isso resolveu o erro "Cannot find module 'axios'" no frontend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5299/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Tipos baseados nos modelos da API
export interface Person {
  id: string;
  nome: string;
  email: string;
  password?: string;
  dataCriacao: string;
  ultimoAcesso?: string;
  ativo: boolean;
  role?: string;
}

export interface Propriedade {
  id: string;
  personId: string;
  nome: string;
  localizacao: string;
  tamanhoArea: number;
  dataCriacao: string;
  person?: Person;
}

export interface Plantio {
  id: string;
  propriedadeId: string;
  tipoSemente: string;
  tipoSolo: string;
  correcaoSolo: string;
  adubacao: string;
  tempoCrecimento: number;
  previsaoColheita?: string;
  dataCriacao: string;
  propriedade?: Propriedade;
}

export interface ComposicaoDeSolo {
  id: string;
  propriedadeId: string;
  dataAnalise: string;
  ph: number;
  materiaOrganica: number;
  nitrogenio: number;
  fosforo: number;
  potassio: number;
  calcio: number;
  magnesio: number;
  enxofre: number;
  aluminio: number;
  recomendacoes: string;
  propriedade?: Propriedade;
}

// Funções da API
export const personApi = {
  getAll: () => api.get<Person[]>('/person'),
  getById: (id: string) => api.get<Person>(`/person/${id}`),
  create: (person: Omit<Person, 'id' | 'dataCriacao'>) => api.post<Person>('/person', person),
  update: (id: string, person: Partial<Person>) => api.put<Person>(`/person/${id}`, person),
  delete: (id: string) => api.delete(`/person/${id}`),
};

export const propriedadeApi = {
  getAll: () => api.get<Propriedade[]>('/propriedade'),
  getById: (id: string) => api.get<Propriedade>(`/propriedade/${id}`),
  create: (propriedade: Omit<Propriedade, 'id' | 'dataCriacao'>) => api.post<Propriedade>('/propriedade', propriedade),
  update: (id: string, propriedade: Partial<Propriedade>) => api.put<Propriedade>(`/propriedade/${id}`, propriedade),
  delete: (id: string) => api.delete(`/propriedade/${id}`),
};

export const plantioApi = {
  getAll: () => api.get<Plantio[]>('/plantio'),
  getById: (id: string) => api.get<Plantio>(`/plantio/${id}`),
  create: (plantio: Omit<Plantio, 'id' | 'dataCriacao'>) => api.post<Plantio>('/plantio', plantio),
  update: (id: string, plantio: Partial<Plantio>) => api.put<Plantio>(`/plantio/${id}`, plantio),
  delete: (id: string) => api.delete(`/plantio/${id}`),
};

export interface MovimentacaoFinanceira {
  id: string;
  tipoTransacao: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  dataTransacao: string;
  usuarioId: string;
}

export const analiseDeSoloApi = {
  getAll: () => api.get<ComposicaoDeSolo[]>('/analisedesolo'),
  getById: (id: string) => api.get<ComposicaoDeSolo>(`/analisedesolo/${id}`),
  create: (analise: Omit<ComposicaoDeSolo, 'id' | 'dataAnalise'>) => api.post<ComposicaoDeSolo>('/analisedesolo', analise),
  update: (id: string, analise: Partial<ComposicaoDeSolo>) => api.put<ComposicaoDeSolo>(`/analisedesolo/${id}`, analise),
  delete: (id: string) => api.delete(`/analisedesolo/${id}`),
};

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  supplier: string;
  cost: number;
  location: string;
  status: string;
  minQuantity: number;
  barcode?: string;
}

export const financeiroApi = {
  getAll: () => api.get<MovimentacaoFinanceira[]>('/financeiro'),
  getById: (id: string) => api.get<MovimentacaoFinanceira>(`/financeiro/${id}`),
  create: (movimentacao: Omit<MovimentacaoFinanceira, 'id' | 'dataTransacao'>) => api.post<MovimentacaoFinanceira>('/financeiro', movimentacao),
  update: (id: string, movimentacao: Partial<MovimentacaoFinanceira>) => api.put<MovimentacaoFinanceira>(`/financeiro/${id}`, movimentacao),
  delete: (id: string) => api.delete(`/financeiro/${id}`),
};

export const inventoryApi = {
  getAll: () => api.get<InventoryItem[]>('/inventory'),
  getById: (id: number) => api.get<InventoryItem>(`/inventory/${id}`),
  create: (item: Omit<InventoryItem, 'id'>) => api.post<InventoryItem>('/inventory', item),
  update: (id: number, item: Partial<InventoryItem>) => api.put<InventoryItem>(`/inventory/${id}`, item),
  delete: (id: number) => api.delete(`/inventory/${id}`),
};

export default api;
