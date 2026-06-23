import type {
  ApiError,
  DashboardResponse,
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

function serverError(message: string): ApiError {
  return { tipo: "servidor", message };
}

export function isValidationError(err: unknown): err is Extract<ApiError, { tipo: "validacao" }> {
  return typeof err === "object" && err !== null && (err as ApiError).tipo === "validacao";
}
