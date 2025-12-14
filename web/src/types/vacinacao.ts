export interface HistoricoVacinacao {
    vacinacaoId: number;
    dataVacinacao: string;
}

export interface VacinacaoPessoa {
    vacinaId: number;
    historico: HistoricoVacinacao[];
}
