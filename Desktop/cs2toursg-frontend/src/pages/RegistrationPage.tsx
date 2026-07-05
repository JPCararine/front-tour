import { useState } from "react";
import { clausulas, diasSemana, periodos } from "../data/clausulas";
import { inscreverEquipe, isValidationError } from "../api/client";
import type { TeamRegistrationRequest } from "../api/types";

const inputClass =
  "w-full bg-surface-container-highest border rounded px-4 py-3 text-on-surface input-glow focus:ring-0 transition-shadow placeholder:text-outline/60";
const labelClass = "block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase";

interface FormState {
  teamName: string;
  captainName: string;
  captainEmail: string;
  captainDiscordId: string;
  whatsapp: string;
  observations: string;
}

const EMPTY_FORM: FormState = {
  teamName: "",
  captainName: "",
  captainEmail: "",
  captainDiscordId: "",
  whatsapp: "",
  observations: "",
};

export default function RegistrationPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [accepted, setAccepted] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      clearFieldError(field);
    };

  const clearFieldError = (field: string) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const toggleSlot = (key: string) => {
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }));
    clearFieldError("availability");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted || submitting) return;

    const selectedAvailability = Object.entries(availability)
      .filter(([, v]) => v)
      .map(([key]) => key);

    const payload: TeamRegistrationRequest = {
      teamName: form.teamName.trim(),
      captainName: form.captainName.trim(),
      captainEmail: form.captainEmail.trim(),
      captainDiscordId: form.captainDiscordId.trim(),
      whatsapp: form.whatsapp.trim(),
      availability: selectedAvailability,
      observations: form.observations.trim() || undefined,
      termsAccepted: accepted,
    };

    setSubmitting(true);
    setErrors({});
    setServerError(null);

    try {
      await inscreverEquipe(payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (isValidationError(err)) {
        setErrors(err.errors);
      } else {
        setServerError(
          (err as { message?: string })?.message ??
            "Não foi possível concluir a inscrição. Tente novamente.",
        );
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin-desktop py-20">
        <div className="w-full max-w-2xl glass-panel rounded-xl p-8 md:p-12 border-l-2 border-secondary text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-[56px]">mark_email_read</span>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase">
            Inscrição recebida!
          </h1>
          <p className="font-body-lg text-on-surface-variant">
            A manifestação de interesse do time <strong className="text-primary">{form.teamName}</strong>{" "}
            foi registrada. Enviamos um <strong>link de confirmação</strong> para o e-mail{" "}
            <strong className="text-primary">{form.captainEmail}</strong>. A inscrição é gratuita —
            a vaga só será confirmada após clicar no link e confirmar o time no site.
          </p>
          <p className="font-label-caps text-label-caps text-outline uppercase">
            Não esqueça de verificar a caixa de spam.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-start w-full px-margin-mobile md:px-margin-desktop py-12">
      {/* Header */}
      <div className="w-full max-w-container-max mb-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase mb-4">
          Manifestação de Interesse
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Registre o interesse da sua equipe no campeonato de Counter-Strike 2. A inscrição é{" "}
          <strong className="text-secondary">gratuita</strong> — o envio deste formulário não
          garante vaga: a confirmação ocorre pelo link enviado ao e-mail do capitão.
        </p>
      </div>

      {serverError && (
        <div className="w-full max-w-container-max mb-gutter glass-panel rounded-xl p-6 border-l-2 border-tertiary flex items-center gap-4">
          <span className="material-symbols-outlined text-tertiary text-[32px]">error</span>
          <p className="text-on-surface-variant">{serverError}</p>
        </div>
      )}

      <div className="w-full max-w-container-max grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Form Section */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-6 md:p-8 shadow-lg">
          <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant/30 pb-4 mb-8">
            Dados da Equipe
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Team & Captain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                id="teamName"
                label="Nome do time"
                placeholder="EX: FURIOUS FIVE"
                value={form.teamName}
                onChange={update("teamName")}
                error={errors.teamName}
              />
              <Field
                id="captainName"
                label="Nome do capitão / responsável"
                placeholder="EX: JOÃO SILVA"
                value={form.captainName}
                onChange={update("captainName")}
                error={errors.captainName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/20">
              <Field
                id="captainEmail"
                type="email"
                label="E-mail do capitão"
                placeholder="CAPITAO@EMAIL.COM"
                value={form.captainEmail}
                onChange={update("captainEmail")}
                error={errors.captainEmail}
              />
              <Field
                id="captainDiscordId"
                label="Discord ID do capitão"
                placeholder="CAPITAO#1234"
                value={form.captainDiscordId}
                onChange={update("captainDiscordId")}
                error={errors.captainDiscordId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                id="whatsapp"
                type="tel"
                label="WhatsApp para contato"
                placeholder="(15) 99999-9999"
                value={form.whatsapp}
                onChange={update("whatsapp")}
                error={errors.whatsapp}
              />
            </div>

            {/* Availability */}
            <div className="pt-6 border-t border-outline-variant/20">
              <label className={labelClass}>Disponibilidade da equipe</label>
              <p className="text-on-surface-variant text-sm mb-4">
                Marque os períodos em que a equipe está disponível para jogar.
              </p>
              <div className="space-y-3">
                {diasSemana.map((dia) => (
                  <div key={dia} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:items-center">
                    <span className="font-label-caps text-label-caps text-on-surface uppercase">{dia}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {periodos.map((periodo) => {
                        const key = `${dia} - ${periodo}`;
                        const active = !!availability[key];
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => toggleSlot(key)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded border font-label-caps text-label-caps uppercase transition-all ${
                              active
                                ? "bg-primary/15 border-primary text-primary shadow-[0_0_8px_rgba(208,188,255,0.25)]"
                                : "bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:border-primary/50"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {active ? "check_box" : "check_box_outline_blank"}
                            </span>
                            {periodo}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {errors.availability && (
                <p className="mt-3 font-label-caps text-label-caps text-tertiary uppercase">
                  {errors.availability}
                </p>
              )}
            </div>

            {/* Observações */}
            <div className="pt-6 border-t border-outline-variant/20">
              <label className={labelClass} htmlFor="observations">
                Observações
              </label>
              <textarea
                id="observations"
                className={`${inputClass} min-h-[120px] resize-y ${
                  errors.observations ? "border-tertiary" : "border-outline-variant/50"
                }`}
                placeholder="INFORMAÇÕES ADICIONAIS (OPCIONAL)"
                value={form.observations}
                onChange={update("observations")}
              />
              {errors.observations && (
                <p className="mt-2 font-label-caps text-label-caps text-tertiary uppercase">
                  {errors.observations}
                </p>
              )}
            </div>

            {/* Action */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!accepted || submitting}
                className="w-full bg-primary text-on-primary font-headline-md text-headline-md py-4 rounded-lg uppercase tracking-wider hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(208,188,255,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 flex items-center justify-center gap-3"
              >
                {submitting && (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                )}
                {submitting ? "Enviando..." : "Enviar Manifestação de Interesse"}
              </button>
              {!accepted && (
                <p className="mt-3 font-label-caps text-label-caps text-tertiary uppercase text-center">
                  É necessário aceitar as cláusulas para enviar
                </p>
              )}
              {errors.termsAccepted && (
                <p className="mt-3 font-label-caps text-label-caps text-tertiary uppercase text-center">
                  {errors.termsAccepted}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Rules Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="reader-mode p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-primary border-b border-outline-variant/30 pb-4">
              <span className="material-symbols-outlined">gavel</span>
              <h3 className="font-headline-md text-headline-md uppercase">Cláusulas do Torneio</h3>
            </div>
            <div
              className="font-body-md text-on-surface-variant space-y-4 overflow-y-auto pr-2 max-h-[520px]"
              style={{ lineHeight: 1.8 }}
            >
              {clausulas.map((c) => (
                <p key={c.titulo}>
                  <strong className="text-primary font-label-caps block mb-1 uppercase">{c.titulo}</strong>
                  {c.texto}
                </p>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-outline-variant/30">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    clearFieldError("termsAccepted");
                  }}
                  className="mt-1 w-5 h-5 bg-surface-container border-outline-variant rounded text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="font-label-caps text-label-caps text-outline group-hover:text-on-surface transition-colors leading-tight uppercase">
                  Declaro, em nome da equipe, que todos os integrantes leram, compreenderam e
                  concordam com o regulamento e as cláusulas. Reconheço que o envio representa apenas
                  manifestação de interesse e que a vaga só será confirmada após a confirmação pelo
                  link enviado por e-mail.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}

function Field({ id, label, placeholder, value, onChange, error, type = "text" }: FieldProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${inputClass} ${error ? "border-tertiary" : "border-outline-variant/50"}`}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="mt-2 font-label-caps text-label-caps text-tertiary uppercase">{error}</p>
      )}
    </div>
  );
}
