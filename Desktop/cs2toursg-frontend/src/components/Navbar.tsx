import { NavLink } from "react-router-dom";

const linkBase =
  "font-headline-md text-headline-md hover:bg-primary/10 transition-all duration-300 px-4 py-2 rounded-lg scale-95 active:scale-100";

export default function Navbar() {
  return (
    <nav className="bg-surface/70 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-outline-variant/30 h-[88px]">
      <div className="max-w-container-max mx-auto h-full flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        <NavLink
          to="/"
          className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg font-extrabold text-primary tracking-tighter"
        >
          ESL ITAP
        </NavLink>

        <div className="hidden md:flex gap-gutter items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary"
              }`
            }
            end
          >
            Times
          </NavLink>
          <NavLink
            to="/inscricao"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary"
              }`
            }
          >
            Inscrições
          </NavLink>
        </div>

        <NavLink
          to="/inscricao"
          className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded scale-95 active:scale-100 transition-transform hover:bg-primary/90 uppercase"
        >
          Inscrever Time
        </NavLink>
      </div>
    </nav>
  );
}
