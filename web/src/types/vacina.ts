export interface Vacina {
    id: number;
    nome: string;
    idadeInicial: number;
    intervaloDoses: number;
    recorrente: boolean;
    qtdDoses: number | null;
    dosesReforco: boolean;
    qtdReforco: number | null;
}
