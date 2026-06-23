import type { TeamStatus } from "../api/types";

const styles: Record<TeamStatus, { label: string; className: string }> = {
  CONFIRMADA: {
    label: "Confirmado",
    className: "bg-secondary/15 text-secondary border border-secondary/40",
  },
  PENDENTE: {
    label: "Pendente",
    className: "bg-warning/15 text-warning border border-warning/40",
  },
};

export default function StatusPill({ status }: { status: TeamStatus }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-label-caps text-label-caps uppercase ${s.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
