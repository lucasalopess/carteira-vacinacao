import {useState} from 'react';
import type {Pessoa, Vacina, VacinacaoPessoa} from '../types';

interface AlertCenterProps {
    pessoa: Pessoa;
    vacinasAtrasadas: Vacina[];
    vacinacoes: VacinacaoPessoa[];
    isLoading?: boolean;
}

export function CentralAlerta({pessoa, vacinasAtrasadas, vacinacoes, isLoading}: AlertCenterProps) {
    const [expandedVacina, setExpandedVacina] = useState<number | null>(null);

    if (isLoading) {
        return null;
    }

    if (vacinasAtrasadas.length === 0) {
        return null;
    }

    const getVacinacaoCount = (vacinaId: number): number => {
        const vacinacao = vacinacoes.find((v) => v.vacinaId === vacinaId);
        return vacinacao?.historico?.length || 0;
    };

    const getAlertMessage = (vacina: Vacina): string => {
        const dosesTomadas = getVacinacaoCount(vacina.id);
        const proximaDose = dosesTomadas + 1;

        if (dosesTomadas === 0) {
            return `A 1ª dose da vacina ${vacina.nome} está prevista para ser tomada com ${vacina.idadeInicial} anos.`;
        } else if (proximaDose <= (vacina.qtdDoses || 0)) {
            return `Você deve tomar a ${proximaDose}ª dose da vacina ${vacina.nome}. Intervalo previsto: ${vacina.intervaloDoses} meses após a dose anterior.`;
        } else if (vacina.recorrente) {
            return `Você deve tomar a ${proximaDose}ª dose da vacina ${vacina.nome}. Intervalo recomendado: ${vacina.intervaloDoses} meses.`;
        } else {
            const reforcoNum = proximaDose - (vacina.qtdDoses || 0);
            return `Você deve tomar o ${reforcoNum}º reforço da vacina ${vacina.nome}. Intervalo recomendado: ${vacina.intervaloDoses} meses.`;
        }
    };

    return (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <h3 className="text-sm font-semibold text-yellow-800">
                        Centro de Alertas - {pessoa.nome}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-200 text-yellow-800 rounded-full">
                        {vacinasAtrasadas.length} vacina{vacinasAtrasadas.length > 1 ? 's' : ''} atrasada{vacinasAtrasadas.length > 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {vacinasAtrasadas.map((vacina) => (
                        <div
                            key={vacina.id}
                            className="flex-shrink-0 bg-white border border-yellow-300 rounded-lg p-3 min-w-[250px] max-w-[300px]"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-medium text-yellow-900">
                                        {vacina.nome}
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-0.5">
                                        Vacina atrasada
                                    </p>
                                </div>
                                <button
                                    onClick={() => setExpandedVacina(expandedVacina === vacina.id ? null : vacina.id)}
                                    className="text-xs font-medium text-yellow-700 hover:text-yellow-900 underline whitespace-nowrap"
                                >
                                    {expandedVacina === vacina.id ? 'Fechar' : 'Saiba mais'}
                                </button>
                            </div>
                            {expandedVacina === vacina.id && (
                                <div className="mt-2 pt-2 border-t border-yellow-200">
                                    <p className="text-xs text-yellow-800">
                                        {getAlertMessage(vacina)}
                                    </p>
                                    <div className="mt-2 text-xs text-yellow-600">
                                        {vacina.recorrente ? (
                                            <p>• Vacina Recorrente</p>
                                        ) : (
                                            <>
                                                <p>• Doses: {getVacinacaoCount(vacina.id)}/{vacina.qtdDoses || 0}</p>
                                                {vacina.dosesReforco && (
                                                    <p>•
                                                        Reforços: {Math.max(0, getVacinacaoCount(vacina.id) - (vacina.qtdDoses || 0))}/{vacina.qtdReforco || 0}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
