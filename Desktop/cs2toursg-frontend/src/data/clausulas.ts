export interface Clausula {
  titulo: string;
  texto: string;
}

/** Cláusulas oficiais sobre inscrições e confirmação das equipes. */
export const clausulas: Clausula[] = [
  {
    titulo: "1. Manifestação de interesse",
    texto:
      "O preenchimento do formulário tem como finalidade exclusiva registrar o interesse da equipe em participar do campeonato. O envio do formulário não garante nem reserva uma vaga na competição.",
  },
  {
    titulo: "2. Inscrição gratuita e confirmação",
    texto:
      "A inscrição no campeonato é totalmente gratuita. A vaga da equipe será considerada confirmada somente após o capitão acessar o link de confirmação enviado por e-mail e confirmar a participação no site. A ordem de confirmação das vagas seguirá a ordem das confirmações realizadas.",
  },
  {
    titulo: "3. Quantidade de equipes inscritas",
    texto:
      "A quantidade de equipes que manifestaram interesse e a quantidade de equipes com inscrição já confirmada serão atualizadas periodicamente na descrição da publicação oficial do campeonato.",
  },
  {
    titulo: "4. Validade do link de confirmação",
    texto:
      "O link de confirmação enviado por e-mail possui prazo de validade. Equipes que não confirmarem a participação dentro do prazo terão a inscrição removida automaticamente, liberando a vaga para outras equipes interessadas.",
  },
  {
    titulo: "5. Cancelamento do campeonato",
    texto:
      "Caso o campeonato não possa ser realizado, independentemente do motivo, as equipes inscritas serão comunicadas pelos canais oficiais (e-mail e Discord).",
  },
  {
    titulo: "6. Aceitação dos termos",
    texto:
      "Ao enviar o formulário, o responsável pela inscrição declara, em nome da equipe, que todos os seus integrantes leram, compreenderam e concordam integralmente com as regras, condições e cláusulas do campeonato, não podendo posteriormente alegar desconhecimento, discordância ou falta de informação sobre os termos apresentados. Eventuais dúvidas ou divergências deverão ser comunicadas à organização antes da confirmação da inscrição.",
  },
];

/** Dias e períodos para a grade de disponibilidade da equipe. */
export const diasSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
] as const;

export const periodos = ["Manhã", "Tarde", "Noite"] as const;
