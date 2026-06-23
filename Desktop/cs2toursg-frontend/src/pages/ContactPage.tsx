const SUPPORT_EMAIL = "newgenerationitap@gmail.com";

export default function ContactPage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-start w-full px-margin-mobile md:px-margin-desktop py-12">
      <div className="w-full max-w-container-max mb-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase mb-4">
          Contato
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Precisa de ajuda? Para qualquer suporte ou dúvida, entre em contato pelo e-mail abaixo.
        </p>
      </div>

      <div className="w-full max-w-container-max glass-panel rounded-xl p-8 md:p-12 flex flex-col items-center text-center gap-6 border-l-2 border-primary">
        <span className="material-symbols-outlined text-primary text-[48px]">mail</span>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Para qualquer suporte ou dúvida, mande um e-mail para:
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-headline-md text-headline-md text-secondary hover:text-secondary-fixed transition-colors break-all"
        >
          {SUPPORT_EMAIL}
        </a>
      </div>
    </main>
  );
}
