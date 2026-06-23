import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { carregarPagamento, qrCodeUrl } from "../api/client";
import type { PaymentInfo } from "../api/types";

const POLL_MS = 5000;
const REDIRECT_DELAY_MS = 4000;

export default function PaymentPage() {
  const { billingId } = useParams<{ billingId: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!billingId) {
      setError("Link de pagamento inválido.");
      return;
    }

    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const load = async () => {
      try {
        const result = await carregarPagamento(billingId);
        if (!active) return;
        setPayment(result);
        setError(null);
        if (result.status !== "CONFIRMADA") {
          timer = setTimeout(load, POLL_MS);
        }
      } catch (err) {
        if (!active) return;
        setError(
          (err as { message?: string })?.message ??
            "Não foi possível carregar os dados de pagamento.",
        );
      }
    };

    load();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [billingId]);

  useEffect(() => {
    if (payment?.status !== "CONFIRMADA") return;
    const redirect = setTimeout(() => navigate("/"), REDIRECT_DELAY_MS);
    return () => clearTimeout(redirect);
  }, [payment?.status, navigate]);

  const handleCopy = async () => {
    if (!payment) return;
    await navigator.clipboard.writeText(payment.copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (payment?.status === "CONFIRMADA") {
    return (
      <main className="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop py-20">
        <div className="w-full max-w-2xl glass-panel rounded-xl p-8 md:p-12 border-l-2 border-secondary text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-[56px]">verified</span>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase">
            Pagamento confirmado!
          </h1>
          <p className="font-body-lg text-on-surface-variant">
            A vaga da sua equipe foi confirmada. Você será redirecionado para o dashboard em
            alguns segundos.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop py-20">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase mb-4">
            Pagamento Pix
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Escaneie o QR Code ou copie o código Pix abaixo para confirmar a inscrição da sua
            equipe.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
          {!payment ? (
            <Skeleton />
          ) : (
            <>
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={qrCodeUrl(billingId!)}
                  alt="QR Code Pix"
                  className="w-56 h-56 object-contain"
                />
              </div>

              <div className="w-full">
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                  Código copia e cola
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={payment.copyPaste}
                    className="flex-1 bg-surface-container-highest border border-outline-variant/50 rounded px-4 py-3 text-on-surface text-sm truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="bg-primary text-on-primary font-label-caps text-label-caps px-4 rounded uppercase hover:bg-primary/90 transition-all shrink-0"
                  >
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              <a
                href={payment.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center bg-surface-container-high border border-outline-variant/40 text-on-surface font-headline-md text-headline-md py-4 rounded-lg uppercase tracking-wider hover:border-primary/50 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">forum</span>
                Entrar no Discord
              </a>

              <p className="font-label-caps text-label-caps text-outline uppercase text-center">
                A vaga é confirmada automaticamente após a verificação do pagamento.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Skeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-6 animate-pulse">
      <div className="w-56 h-56 rounded-lg bg-surface-container-highest" />
      <div className="w-full h-12 rounded bg-surface-container-highest" />
      <div className="w-full h-14 rounded-lg bg-surface-container-highest" />
    </div>
  );
}
