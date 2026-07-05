import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { carregarDashboard } from "../api/client";
import type { DashboardResponse, TeamSummary } from "../api/types";
import StatusPill from "../components/StatusPill";

const TOTAL_VAGAS = 16;
const REFRESH_MS = 30_000;

export default function TeamsPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async (showSpinner: boolean) => {
      if (showSpinner) setLoading(true);
      try {
        const result = await carregarDashboard();
        if (!active) return;
        setData(result);
        setError(null);
      } catch {
        if (!active) return;
        setError("Não foi possível carregar a lista de times.");
      } finally {
        if (active && showSpinner) setLoading(false);
      }
    };

    load(true);
    const timer = setInterval(() => load(false), REFRESH_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const confirmadas = data?.confirmadas ?? [];
  const pendentes = data?.pendentes ?? [];
  const totalConfirmadas = data?.totalConfirmadas ?? 0;
  const totalPendentes = data?.totalPendentes ?? 0;

  return (
    <main className="flex-grow flex flex-col items-center justify-start w-full px-margin-mobile md:px-margin-desktop py-12">
      {/* Header */}
      <div className="w-full max-w-container-max mb-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase mb-4">
          Times Inscritos
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Acompanhe as equipes que manifestaram interesse no campeonato e o status de cada inscrição.
          A inscrição é gratuita e as vagas são confirmadas conforme a ordem das confirmações.
        </p>
      </div>

      {loading ? (
        <div className="w-full max-w-container-max glass-panel rounded-xl py-20 flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Carregando times...
          </span>
        </div>
      ) : error ? (
        <div className="w-full max-w-container-max glass-panel rounded-xl py-20 flex flex-col items-center gap-3 border-l-2 border-tertiary">
          <span className="material-symbols-outlined text-tertiary text-[40px]">cloud_off</span>
          <span className="font-body-md text-on-surface-variant">{error}</span>
        </div>
      ) : (
        <div className="w-full max-w-container-max grid grid-cols-1 lg:grid-cols-2 gap-gutter items-stretch">
          {/* Confirmados */}
          <section className="glass-panel rounded-xl p-6 md:p-8 border-l-2 border-secondary">
            <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-4 mb-6">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined">verified</span>
                <h2 className="font-headline-md text-headline-md uppercase">Confirmados</h2>
              </div>
              <div className="text-right">
                <div className="font-display-lg-mobile text-display-lg-mobile text-secondary leading-none">
                  {totalConfirmadas}
                  <span className="text-on-surface-variant"> / {TOTAL_VAGAS}</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Vagas preenchidas
                </span>
              </div>
            </div>

            {/* Barra de progresso das vagas */}
            <div className="mb-6">
              <div className="h-2 w-full rounded-full bg-surface-container-low overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary transition-all"
                  style={{ width: `${Math.min((totalConfirmadas / TOTAL_VAGAS) * 100, 100)}%` }}
                />
              </div>
            </div>

            {confirmadas.length === 0 ? (
              <EmptyState text="Nenhum time confirmado ainda." />
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {confirmadas.map((team, i) => (
                  <TeamRow key={team.teamName} team={team} index={i} />
                ))}
              </ul>
            )}
          </section>

          {/* Pendentes */}
          <section className="glass-panel rounded-xl p-6 md:p-8 border-l-2 border-warning">
            <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-4 mb-6">
              <div className="flex items-center gap-2 text-warning">
                <span className="material-symbols-outlined">hourglass_top</span>
                <h2 className="font-headline-md text-headline-md uppercase">Pendentes</h2>
              </div>
              <div className="text-right">
                <div className="font-display-lg-mobile text-display-lg-mobile text-warning leading-none">
                  {totalPendentes}
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Aguardando confirmação
                </span>
              </div>
            </div>

            {pendentes.length === 0 ? (
              <EmptyState text="Nenhum time pendente no momento." />
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-2">
                {pendentes.map((team, i) => (
                  <TeamRow key={team.teamName} team={team} index={i} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* Como funciona a inscrição */}
      <section className="w-full max-w-container-max mt-16">
        <div className="glass-panel rounded-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant/30 pb-6 mb-8">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-[32px]">route</span>
              <h2 className="font-headline-md text-headline-md uppercase">
                Como funciona a inscrição
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 self-start md:self-auto bg-secondary/15 border border-secondary/40 text-secondary font-label-caps text-label-caps uppercase px-4 py-2 rounded-full">
              <span className="material-symbols-outlined text-[18px]">celebration</span>
              100% gratuita — sem taxa de inscrição
            </span>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            {PASSOS_INSCRICAO.map((passo, i) => (
              <li
                key={passo.titulo}
                className="bg-surface-container-low/60 border border-white/5 rounded-lg p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display-lg-mobile text-display-lg-mobile text-primary leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {passo.icone}
                  </span>
                </div>
                <h3 className="font-headline-md text-on-surface font-bold uppercase">
                  {passo.titulo}
                </h3>
                <p className="font-body-md text-on-surface-variant">{passo.texto}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 font-body-md text-on-surface-variant text-center">
            Todo o processo é <strong className="text-secondary">gratuito</strong> — não há
            cobrança em nenhuma etapa. A vaga da equipe só é garantida após a confirmação pelo
            link enviado por e-mail, então fique de olho na caixa de entrada (e no spam).
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="w-full max-w-container-max mt-12 flex flex-col items-center text-center gap-4">
        <p className="font-body-lg text-on-surface-variant">Sua equipe ainda não está na lista?</p>
        <Link
          to="/inscricao"
          className="bg-primary text-on-primary font-headline-md text-headline-md py-4 px-10 rounded-lg uppercase tracking-wider hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(208,188,255,0.4)] active:scale-[0.98]"
        >
          Manifestar Interesse
        </Link>
      </div>
    </main>
  );
}

const PASSOS_INSCRICAO = [
  {
    icone: "edit_note",
    titulo: "Preencha o formulário",
    texto:
      "O capitão informa os dados da equipe e a disponibilidade na página de inscrição.",
  },
  {
    icone: "mark_email_unread",
    titulo: "Receba o e-mail",
    texto:
      "Enviamos um link de confirmação para o e-mail do capitão. Ele tem prazo de validade, então não demore.",
  },
  {
    icone: "task_alt",
    titulo: "Confirme o time",
    texto:
      "O link traz de volta ao site: basta clicar em Confirmar Time para garantir a vaga. Sem pagamento, sem taxa.",
  },
  {
    icone: "forum",
    titulo: "Entre no Discord",
    texto:
      "Na mesma página, entre no Discord do campeonato para receber os próximos avisos da organização.",
  },
] as const;

function TeamRow({ team, index }: { team: TeamSummary; index: number }) {
  return (
    <li className="flex items-center justify-between gap-3 bg-surface-container-low/60 border border-white/5 rounded-lg px-4 py-3 hover:bg-surface-container-high/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-label-caps text-label-caps text-outline shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="font-headline-md text-on-surface font-bold truncate">{team.teamName}</div>
      </div>
      <StatusPill status={team.status} />
    </li>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-10 text-center font-label-caps text-label-caps text-outline uppercase">
      {text}
    </div>
  );
}
