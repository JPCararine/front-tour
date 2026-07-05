import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { carregarConfirmacao, confirmarTime } from "../api/client";
import type { ConfirmationInfo } from "../api/types";

export default function ConfirmationPage() {
  const { token } = useParams<{ token: string }>();

  const [info, setInfo] = useState<ConfirmationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Link de confirmação inválido.");
      return;
    }

    let active = true;
    carregarConfirmacao(token)
      .then((result) => {
        if (!active) return;
        setInfo(result);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          (err as { message?: string })?.message ??
            "Não foi possível carregar os dados da inscrição.",
        );
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleConfirm = async () => {
    if (!token || confirming) return;
    setConfirming(true);
    try {
      setInfo(await confirmarTime(token));
      setError(null);
    } catch (err) {
      setError(
        (err as { message?: string })?.message ?? "Não foi possível confirmar a inscrição.",
      );
    } finally {
      setConfirming(false);
    }
  };

  if (error) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop py-20">
        <div className="w-full max-w-2xl glass-panel rounded-xl p-8 md:p-12 border-l-2 border-tertiary text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-tertiary text-[56px]">error</span>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase">
            Algo deu errado
          </h1>
          <p className="font-body-lg text-on-surface-variant">{error}</p>
        </div>
      </main>
    );
  }

  if (info?.status === "CONFIRMADA") {
    return (
      <main className="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop py-20">
        <div className="w-full max-w-2xl glass-panel rounded-xl p-8 md:p-12 border-l-2 border-secondary text-center flex flex-col items-center gap-6">
          <span className="material-symbols-outlined text-secondary text-[56px]">verified</span>
          <div className="flex flex-col gap-4 items-center">
            <h1 className="font-headline-md text-headline-md text-on-surface uppercase">
              Vaga confirmada!
            </h1>
            <p className="font-body-lg text-on-surface-variant">
              A vaga do time <strong className="text-primary">{info.teamName}</strong> está
              garantida. Agora entre no Discord do campeonato para receber as próximas
              informações.
            </p>
          </div>
          <DiscordButton url={info.discordUrl} />
          <Link
            to="/"
            className="font-label-caps text-label-caps text-on-surface-variant uppercase hover:text-primary transition-colors"
          >
            Ver times inscritos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop py-20">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase mb-4">
            Confirmar Inscrição
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            A inscrição é <strong className="text-secondary">100% gratuita</strong>. Clique no
            botão abaixo para confirmar a vaga da sua equipe e depois entre no Discord do
            campeonato.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
          {!info ? (
            <Skeleton />
          ) : (
            <>
              <div className="text-center">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">
                  Equipe
                </span>
                <span className="font-headline-md text-headline-md text-on-surface uppercase">
                  {info.teamName}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full bg-primary text-on-primary font-headline-md text-headline-md py-4 rounded-lg uppercase tracking-wider hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(208,188,255,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {confirming && (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                )}
                {confirming ? "Confirmando..." : "Confirmar Time"}
              </button>

              <DiscordButton url={info.discordUrl} />

              <p className="font-label-caps text-label-caps text-outline uppercase text-center">
                A vaga só é garantida após a confirmação.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function DiscordButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="w-full text-center bg-surface-container-high border border-outline-variant/40 text-on-surface font-headline-md text-headline-md py-4 rounded-lg uppercase tracking-wider hover:border-primary/50 transition-all flex items-center justify-center gap-3"
    >
      <span className="material-symbols-outlined">forum</span>
      Entrar no Discord
    </a>
  );
}

function Skeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-6 animate-pulse">
      <div className="w-48 h-12 rounded bg-surface-container-highest" />
      <div className="w-full h-14 rounded-lg bg-surface-container-highest" />
      <div className="w-full h-14 rounded-lg bg-surface-container-highest" />
    </div>
  );
}
