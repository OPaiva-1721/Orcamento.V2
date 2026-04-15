// Tipos compartilhados do sistema de orçamentos
// Usados tanto pelo apps/api (NestJS) quanto pelo apps/web (React/Vite)

export type OrcamentoStatus =
  | 'Pendente'
  | 'Aprovado'
  | 'Rejeitado'
  | 'Cancelado'
  | 'Em Andamento'
  | 'Concluído';

export type EmailStatus = 'Enviado' | 'Falhou' | 'Pendente';

export interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  createdAt: Date;
  updatedAt: Date;
  destinatarios?: Destinatario[];
  orcamentos?: Orcamento[];
}

export interface Destinatario {
  id: number;
  nome: string;
  email: string;
  clienteId: number;
  createdAt: Date;
  updatedAt: Date;
  cliente?: Cliente;
  orcamentos?: Orcamento[];
}

export interface Orcamento {
  id: number;
  descricao: string;
  preco: number;
  status: OrcamentoStatus;
  formaPagamento: boolean; // true = "7 dias após o vencimento da nota"
  dataInicio: Date;
  dataTermino: Date | null;
  clienteId: number;
  createdAt: Date;
  updatedAt: Date;
  cliente?: Cliente;
  destinatarios?: Destinatario[];
  emailsEnviados?: EmailEnviado[];
  statusHistory?: StatusHistory[];
}

export interface StatusHistory {
  id: number;
  orcamentoId: number;
  status: string;
  dataMudanca: Date;
  observacao?: string;
}

export interface EmailEnviado {
  id: number;
  orcamentoId: number;
  destinatarioId: number;
  dataEnvio: Date;
  status: EmailStatus;
  orcamento?: Orcamento;
  destinatario?: Destinatario;
}

// --- DTOs de criação/atualização ---

export interface CreateClienteData {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
}

export interface UpdateClienteData extends Partial<CreateClienteData> {}

export interface CreateDestinatarioData {
  nome: string;
  email: string;
  clienteId: number;
}

export interface UpdateDestinatarioData extends Partial<CreateDestinatarioData> {}

export interface CreateOrcamentoData {
  descricao: string;
  preco: number;
  status?: OrcamentoStatus;
  formaPagamento: boolean;
  dataInicio: Date;
  dataTermino?: Date;
  clienteId: number;
  destinatarioIds: number[];
}

export interface UpdateOrcamentoData extends Partial<CreateOrcamentoData> {}

// --- Tipos de resposta da API ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Filtros ---

export interface ClienteFilters {
  q?: string;
  page?: number;
  limit?: number;
}

export interface DestinatarioFilters {
  clienteId?: number;
  page?: number;
  limit?: number;
}

export interface OrcamentoFilters {
  clienteId?: number;
  status?: OrcamentoStatus;
  page?: number;
  limit?: number;
}

// --- PDF / Email ---

export interface PDFData {
  orcamentoId: number;
  tipo: 'padrao' | 'editavel';
}

export interface EmailData {
  orcamentoId: number;
  destinatarioIds: number[];
}

// --- Dashboard ---

export interface DashboardStats {
  totalClientes: number;
  totalOrcamentos: number;
  totalOrcamentosAprovados: number;
  totalDestinatarios: number;
  valorTotalAprovado: number;
  recentOrcamentos: Orcamento[];
}
