import { useCallback, useMemo, useState } from 'react';
import type { HistoricoVacinacao, Vacina, VacinacaoPessoa } from '../types';
import { ConfirmModal } from './ConfirmModal.tsx';

interface VacinacaoTableProps {
    vacinas: Vacina[];
    vacinacoes: VacinacaoPessoa[];
    isLoading?: boolean;
    hasSelectedPessoa?: boolean;
    onDeleteVacinacao?: (vacinacaoId: number) => Promise<void>;
    onEditVacina?: (vacina: Vacina) => void;
    onAddVacina?: () => void;
    onAddVacinacao?: (vacina: Vacina) => void;
}

export function CartaoVacinacao({
    vacinas,
    vacinacoes,
    isLoading = false,
    hasSelectedPessoa = false,
    onDeleteVacinacao,
    onEditVacina,
    onAddVacina,
    onAddVacinacao,
}: VacinacaoTableProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; vacinacao: HistoricoVacinacao | null }>({
        isOpen: false,
        vacinacao: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const vacinacaoMap = useMemo(() => {
        const map = new Map<number, VacinacaoPessoa['historico']>();
        (vacinacoes || []).forEach((v) => {
            map.set(v.vacinaId, v.historico);
        });
        return map;
    }, [vacinacoes]);

    const getDosesForVacina = useCallback((vacina: Vacina): number => {
        if (vacina.recorrente) {
            const historico = vacinacaoMap.get(vacina.id) || [];
            return historico.length + 1;
        }
        return (vacina.qtdDoses || 0) + (vacina.qtdReforco || 0);
    }, [vacinacaoMap]);

    const maxRows = useMemo(() => {
        if (vacinas.length === 0) return 0;

        let max = 0;
        for (const vacina of vacinas) {
            const doses = getDosesForVacina(vacina);
            if (doses > max) max = doses;
        }
        return max;
    }, [vacinas, getDosesForVacina]);

    const rows = useMemo(() => {
        return Array.from({ length: maxRows }, (_, index) => index + 1);
    }, [maxRows]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const handleDeleteClick = (vacinacao: HistoricoVacinacao) => {
        setDeleteConfirm({ isOpen: true, vacinacao });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.vacinacao || !onDeleteVacinacao) return;

        try {
            setIsDeleting(true);
            await onDeleteVacinacao(deleteConfirm.vacinacao.vacinacaoId);
            setDeleteConfirm({ isOpen: false, vacinacao: null });
        } catch (error) {
            console.error('Erro ao excluir:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ isOpen: false, vacinacao: null });
    };

    const renderDoseContent = (vacina: Vacina, doseNum: number) => {
        const historico = vacinacaoMap.get(vacina.id) || [];
        const vacinacao = historico[doseNum - 1];

        if (vacina.recorrente) {
            const maxDose = historico.length + 1;
            if (doseNum > maxDose) {
                return <span className="text-gray-300">—</span>;
            }

            return (
                <div className="flex items-center gap-2 group">
                    {vacinacao ? (
                        <>
                            <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                            <span className="text-xs text-gray-700">
                                {formatDate(vacinacao.dataVacinacao)}
                            </span>
                            {onDeleteVacinacao && (
                                <button
                                    onClick={() => handleDeleteClick(vacinacao)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                                    title="Excluir vacinação"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <span className="w-3 h-3 rounded-full border-2 border-blue-400 flex-shrink-0"></span>
                            <span className="text-xs text-blue-500">Próxima</span>
                        </>
                    )}
                </div>
            );
        }

        const totalDoses = (vacina.qtdDoses || 0) + (vacina.qtdReforco || 0);
        const isApplicable = doseNum <= totalDoses;
        const isReforco = doseNum > (vacina.qtdDoses || 0);

        if (!isApplicable) {
            return <span className="text-gray-300">—</span>;
        }

        return (
            <div className="flex items-center gap-2 group">
                {vacinacao ? (
                    <>
                        <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                        <span className="text-xs text-gray-700">
                            {formatDate(vacinacao.dataVacinacao)}
                        </span>
                        {onDeleteVacinacao && (
                            <button
                                onClick={() => handleDeleteClick(vacinacao)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                                title="Excluir vacinação"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <span className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0"></span>
                        <span className="text-xs text-gray-400">
                            {isReforco ? 'Reforço' : 'Dose'}
                        </span>
                    </>
                )}
            </div>
        );
    };

    const renderVacinaName = (vacina: Vacina, compact = false) => (
        <div className="flex items-center gap-1">
            {isEditMode && onEditVacina && (
                <button
                    onClick={() => onEditVacina(vacina)}
                    className="p-0.5 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                    title={`Editar vacina ${vacina.nome}`}
                >
                    <svg className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            )}
            <span className={compact ? 'truncate max-w-[100px]' : ''}>{vacina.nome}</span>
            {!isEditMode && hasSelectedPessoa && onAddVacinacao && (
                <button
                    onClick={() => onAddVacinacao(vacina)}
                    className={`${compact ? 'p-0.5' : 'p-1'} text-gray-400 hover:text-green-600 transition-colors flex-shrink-0`}
                    title={`Adicionar vacinação de ${vacina.nome}`}
                >
                    <svg className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            )}
        </div>
    );

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                Carregando vacinas...
            </div>
        );
    }

    if (vacinas.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                <p>Nenhuma vacina disponível</p>
                {onAddVacina && (
                    <button
                        onClick={onAddVacina}
                        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                        + Adicionar Vacina
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Carteira de Vacinação
                    </h2>
                    <div className="flex items-center gap-2">
                        {isEditMode ? (
                            <button
                                onClick={() => setIsEditMode(false)}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Voltar
                            </button>
                        ) : (
                            <>
                                {onEditVacina && (
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                    </button>
                                )}
                                {onAddVacina && (
                                    <button
                                        onClick={onAddVacina}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                        Nova Vacina
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="sticky left-0 bg-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200 min-w-[80px]">
                                    Dose
                                </th>
                                {vacinas.map((vacina) => (
                                    <th
                                        key={vacina.id}
                                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 min-w-[150px] whitespace-nowrap"
                                    >
                                        {renderVacinaName(vacina)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((rowNum) => (
                                <tr key={rowNum} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="sticky left-0 bg-white px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                                        {rowNum}ª
                                    </td>
                                    {vacinas.map((vacina) => (
                                        <td key={vacina.id} className="px-4 py-3 text-sm text-gray-700">
                                            {renderDoseContent(vacina, rowNum)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="sticky left-0 bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-600 border-r border-gray-200 min-w-[120px]">
                                    Vacina
                                </th>
                                {rows.map((doseNum) => (
                                    <th
                                        key={doseNum}
                                        className="px-3 py-2 text-center text-sm font-medium text-gray-600 min-w-[80px]"
                                    >
                                        {doseNum}ª
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {vacinas.map((vacina) => (
                                <tr key={vacina.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="sticky left-0 bg-white px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-200">
                                        {renderVacinaName(vacina, true)}
                                    </td>
                                    {rows.map((doseNum) => (
                                        <td key={doseNum} className="px-3 py-2 text-sm text-gray-700">
                                            {renderDoseContent(vacina, doseNum)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                title="Excluir Vacinação"
                message={`Tem certeza que deseja excluir esta vacinação${deleteConfirm.vacinacao ? ` do dia ${formatDate(deleteConfirm.vacinacao.dataVacinacao)}` : ''}?`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                isLoading={isDeleting}
            />
        </>
    );
}
