import {useEffect, useState} from 'react';
import {useSnackbar} from '../contexts';
import type {Pessoa, Vacina} from '../types';

interface AddVacinacaoModalProps {
    isOpen: boolean;
    pessoa: Pessoa | null;
    vacina: Vacina | null;
    vacinas: Vacina[];
    onClose: () => void;
    onSubmit: (data: { pessoaId: number; vacinaId: number; dataVacinacao: string }) => Promise<void>;
}

const formatDateToLocalFormat = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

const formatDateToISO = (brDate: string): string => {
    const cleanDate = brDate.replace(/\D/g, '');
    if (cleanDate.length !== 8) return '';
    const day = cleanDate.substring(0, 2);
    const month = cleanDate.substring(2, 4);
    const year = cleanDate.substring(4, 8);

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
        return '';
    }

    return `${year}-${month}-${day}`;
};

const applyDateMask = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    let masked = '';

    for (let i = 0; i < numbers.length && i < 8; i++) {
        if (i === 2 || i === 4) {
            masked += '/';
        }
        masked += numbers[i];
    }

    return masked;
};

export function AddVacinacaoModal({
                                      isOpen,
                                      pessoa,
                                      vacina,
                                      vacinas,
                                      onClose,
                                      onSubmit,
                                  }: AddVacinacaoModalProps) {
    const [selectedVacinaId, setSelectedVacinaId] = useState<string>('');
    const [dataVacinacaoText, setDataVacinacaoText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {showError} = useSnackbar();

    useEffect(() => {
        if (isOpen) {
            setSelectedVacinaId(vacina ? String(vacina.id) : '');
            const today = new Date().toISOString().split('T')[0];
            setDataVacinacaoText(formatDateToLocalFormat(today));
        }
    }, [isOpen, vacina]);

    const handleDateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = applyDateMask(e.target.value);
        setDataVacinacaoText(masked);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pessoa) {
            showError('Nenhuma pessoa selecionada');
            return;
        }

        if (!selectedVacinaId) {
            showError('Selecione uma vacina');
            return;
        }

        const isoDate = formatDateToISO(dataVacinacaoText);
        if (!isoDate) {
            showError('Data inválida. Use o formato dd/mm/aaaa');
            return;
        }

        const [year, month, day] = isoDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
            showError('Data inválida');
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit({
                pessoaId: pessoa.id,
                vacinaId: parseInt(selectedVacinaId, 10),
                dataVacinacao: isoDate,
            });
            onClose();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao registrar vacinação');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Registrar Vacinação
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="pessoa-nome" className="block text-sm font-medium text-gray-700 mb-1">
                            Pessoa
                        </label>
                        <input
                            id="pessoa-nome"
                            type="text"
                            value={pessoa?.nome || ''}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="vacina-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Vacina
                        </label>
                        <select
                            id="vacina-select"
                            value={selectedVacinaId}
                            onChange={(e) => setSelectedVacinaId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                        >
                            <option value="">Selecione...</option>
                            {vacinas.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="data-vacinacao" className="block text-sm font-medium text-gray-700 mb-1">
                            Data da Vacinação
                        </label>
                        <input
                            id="data-vacinacao"
                            type="text"
                            value={dataVacinacaoText}
                            onChange={handleDateTextChange}
                            placeholder="dd/mm/aaaa"
                            maxLength={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !pessoa}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
