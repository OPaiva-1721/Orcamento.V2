// Tipos compartilhados do sistema de orçamentos
// Usados tanto pelo apps/api (NestJS) quanto pelo apps/web (React/Vite)

// Enum central de status de orçamento — fonte única da verdade
export const ORCAMENTO_STATUS = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
  CANCELADO: 'Cancelado',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
} as const;

export type OrcamentoStatus =
  (typeof ORCAMENTO_STATUS)[keyof typeof ORCAMENTO_STATUS];

export const ORCAMENTO_STATUS_VALUES = Object.values(
  ORCAMENTO_STATUS,
) as OrcamentoStatus[];

export const EMAIL_STATUS = {
  ENVIADO: 'Enviado',
  FALHOU: 'Falhou',
  PENDENTE: 'Pendente',
} as const;

export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];

export interface Cliente {
  id: number;
  ownerId: string;
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
  ownerId: string;
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
  ownerId: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface DestinatarioFilters {
  ownerId: string;
  clienteId?: number;
  page?: number;
  limit?: number;
}

export interface OrcamentoFilters {
  ownerId: string;
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
