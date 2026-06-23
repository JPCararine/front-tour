import type {
  ApiError,
  DashboardResponse,
  PaymentInfo,
  TeamRegistrationRequest,
  TeamRegistrationResponse,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/**
 * Fluxo A — inscreve a equipe. Em caso de 400 lança um {@link ApiError} do tipo
 * "validacao" com os erros por campo; qualquer outra falha vira tipo "servidor".
 */
export async function inscreverEquipe(
  dados: TeamRegistrationRequest,
): Promise<TeamRegistrationResponse> {
  let resp: Response;
  try {
    resp = await fetch(`${BASE_URL}/api/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  } catch {
    throw serverError("Não foi possível se conectar ao servidor. Tente novamente.");
  }

  if (resp.status === 201) {
    return (await resp.json()) as TeamRegistrationResponse;
  }

  if (resp.status === 400) {
    const body = (await resp.json().catch(() => null)) as {
      message?: string;
      errors?: Record<string, string>;
    } | null;
    const err: ApiError = {
      tipo: "validacao",
      message: body?.message ?? "Dados de inscrição inválidos",
      errors: body?.errors ?? {},
    };
    throw err;
  }

  throw serverError("Não foi possível concluir a inscrição. Tente novamente.");
}

/** Fluxo C — carrega o painel público (times pendentes e confirmados). */
export async function carregarDashboard(): Promise<DashboardResponse> {
  let resp: Response;
  try {
    resp = await fetch(`${BASE_URL}/api/teams`);
  } catch {
    throw serverError("Não foi possível carregar a lista de times.");
  }
  if (!resp.ok) {
    throw serverError("Não foi possível carregar a lista de times.");
  }
  return (await resp.json()) as DashboardResponse;
}

/** URL do PNG do QR Code Pix, conforme `GET /api/payments/{billingId}/qr.png`. */
export function qrCodeUrl(billingId: string): string {
  return `${BASE_URL}/api/payments/${billingId}/qr.png`;
}

/**
 * Carrega o copia-e-cola, o link do Discord e o status atual de uma cobranca,
 * para a tela acessada pelo link de pagamento enviado por e-mail ao capitao.
 */
export async function carregarPagamento(billingId: string): Promise<PaymentInfo> {
  let resp: Response;
  try {
    resp = await fetch(`${BASE_URL}/api/payments/${billingId}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw serverError("Não foi possível carregar os dados de pagamento.");
  }

  if (resp.status === 404) {
    throw serverError("Link de pagamento inválido ou expirado.");
  }

  if (!resp.ok) {
    throw serverError("Não foi possível carregar os dados de pagamento.");
  }

  return (await resp.json()) as PaymentInfo;
}

function serverError(message: string): ApiError {
  return { tipo: "servidor", message };
}

export function isValidationError(err: unknown): err is Extract<ApiError, { tipo: "validacao" }> {
  return typeof err === "object" && err !== null && (err as ApiError).tipo === "validacao";
}
