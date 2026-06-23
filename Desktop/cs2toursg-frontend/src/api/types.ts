export type TeamStatus = "PENDENTE" | "CONFIRMADA";

export interface TeamRegistrationRequest {
  teamName: string;
  captainName: string;
  captainEmail: string;
  captainDiscordId: string;
  whatsapp: string;
  availability: string[];
  observations?: string;
  termsAccepted: boolean;
}

export interface TeamRegistrationResponse {
  id: string; // UUID
  status: TeamStatus;
}

export interface TeamSummary {
  teamName: string;
  status: TeamStatus;
}

export interface DashboardResponse {
  pendentes: TeamSummary[];
  confirmadas: TeamSummary[];
  totalPendentes: number;
  totalConfirmadas: number;
}

/** Dados exibidos na tela de pagamento acessada pelo link enviado por e-mail. */
export interface PaymentInfo {
  copyPaste: string;
  discordUrl: string;
  status: TeamStatus;
}

/** Erro de validação (HTTP 400) — `errors` mapeia campo -> mensagem. */
export interface ValidationError {
  tipo: "validacao";
  message: string;
  errors: Record<string, string>;
}

/** Falha de servidor / rede (HTTP 500 ou indisponível). */
export interface ServerError {
  tipo: "servidor";
  message: string;
}

export type ApiError = ValidationError | ServerError;
