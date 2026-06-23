import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 w-full py-margin-desktop px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-base mt-auto">
      <div className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tighter uppercase">
        ESL ITAP
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        <a
          className="font-label-caps text-label-caps text-outline hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
          href="#"
        >
          Discord
        </a>
        <a
          className="font-label-caps text-label-caps text-outline hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
          href="#"
        >
          Regulamento
        </a>
        <Link
          className="font-label-caps text-label-caps text-outline hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100"
          to="/contato"
        >
          Contato
        </Link>
      </div>
      <div className="font-label-caps text-label-caps text-secondary text-center md:text-right">
        © 2026 ESL ITAP — CAMPEONATO DE COUNTER-STRIKE 2.
      </div>
    </footer>
  );
}
