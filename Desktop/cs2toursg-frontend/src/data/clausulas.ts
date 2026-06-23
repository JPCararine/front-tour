export interface Clausula {
  titulo: string;
  texto: string;
}

/** Cláusulas oficiais sobre inscrições e confirmação das equipes (PDF oficial). */
export const clausulas: Clausula[] = [
  {
    titulo: "1. Manifestação de interesse",
    texto:
      "O preenchimento do formulário tem como finalidade exclusiva registrar o interesse da equipe em participar do campeonato. O envio do formulário não garante nem reserva uma vaga na competição.",
  },
  {
    titulo: "2. Confirmação da inscrição",
    texto:
      "A vaga da equipe será considerada confirmada somente após a realização e a confirmação do pagamento da taxa de inscrição. A ordem de confirmação das vagas seguirá a ordem dos pagamentos recebidos.",
  },
  {
    titulo: "3. Quantidade de equipes inscritas",
    texto:
      "A quantidade de equipes que manifestaram interesse e a quantidade de equipes com inscrição já confirmada serão atualizadas periodicamente na descrição da publicação oficial do campeonato.",
  },
  {
    titulo: "4. Situação excepcional entre 13 e 15 equipes",
    texto:
      "Caso, até o dia 4 de julho de 2026, o campeonato tenha entre 13 e 15 equipes com pagamento confirmado e não seja possível incluir todas no formato da competição, o valor da inscrição das equipes que não puderem participar será restituído em quantia equivalente ao dobro do valor pago, como forma de compensação pelo inconveniente. A definição das equipes participantes respeitará a ordem de confirmação dos pagamentos.",
  },
  {
    titulo: "5. Cancelamento do campeonato",
    texto:
      "Caso o campeonato não possa ser realizado, independentemente do motivo, os valores pagos pelas equipes a título de inscrição serão integralmente restituídos.",
  },
  {
    titulo: "6. Aceitação dos termos",
    texto:
      "Ao enviar o formulário, o responsável pela inscrição declara, em nome da equipe, que todos os seus integrantes leram, compreenderam e concordam integralmente com as regras, condições e cláusulas do campeonato, não podendo posteriormente alegar desconhecimento, discordância ou falta de informação sobre os termos apresentados. Eventuais dúvidas ou divergências deverão ser comunicadas à organização antes da confirmação do pagamento da inscrição.",
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
