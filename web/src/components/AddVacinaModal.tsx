import {useState} from 'react';
import {useSnackbar} from '../contexts';

interface AddVacinaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        nome: string;
        idadeInicial: number;
        intervaloDoses: number;
        recorrente: boolean;
        qtdDoses: number | null;
        dosesReforco: boolean;
        qtdReforco: number | null;
    }) => Promise<void>;
}

export function AddVacinaModal({isOpen, onClose, onSubmit}: AddVacinaModalProps) {
    const [nome, setNome] = useState('');
    const [idadeInicial, setIdadeInicial] = useState('');
    const [intervaloDoses, setIntervaloDoses] = useState('');
    const [recorrente, setRecorrente] = useState(false);
    const [qtdDoses, setQtdDoses] = useState('');
    const [dosesReforco, setDosesReforco] = useState(false);
    const [qtdReforco, setQtdReforco] = useState('0');
    const [isLoading, setIsLoading] = useState(false);

    const {showError} = useSnackbar();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim() || !idadeInicial || !intervaloDoses) {
            showError('Preencha todos os campos obrigatórios');
            return;
        }

        if (!recorrente && !qtdDoses) {
            showError('Informe a quantidade de doses');
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit({
                nome: nome.trim(),
                idadeInicial: parseInt(idadeInicial, 10),
                intervaloDoses: parseInt(intervaloDoses, 10),
                recorrente,
                qtdDoses: recorrente ? null : parseInt(qtdDoses, 10),
                dosesReforco: recorrente ? false : dosesReforco,
                qtdReforco: recorrente ? null : (dosesReforco ? parseInt(qtdReforco, 10) : null),
            });
            setNome('');
            setIdadeInicial('');
            setIntervaloDoses('');
            setRecorrente(false);
            setQtdDoses('');
            setDosesReforco(false);
            setQtdReforco('0');
            onClose();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao adicionar vacina');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
            <div
                className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Nova Vacina
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="vacina-nome" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome da Vacina
                        </label>
                        <input
                            id="vacina-nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                            placeholder="Ex: BCG, Hepatite B..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="idade-inicial" className="block text-sm font-medium text-gray-700 mb-1">
                                Idade Inicial
                            </label>
                            <input
                                id="idade-inicial"
                                type="number"
                                min="0"
                                value={idadeInicial}
                                onChange={(e) => setIdadeInicial(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                                placeholder="Anos"
                            />
                        </div>
                        <div>
                            <label htmlFor="intervalo-doses" className="block text-sm font-medium text-gray-700 mb-1">
                                Intervalo (meses)
                            </label>
                            <input
                                id="intervalo-doses"
                                type="number"
                                min="0"
                                value={intervaloDoses}
                                onChange={(e) => setIntervaloDoses(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                                placeholder="Meses"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="recorrente"
                            type="checkbox"
                            checked={recorrente}
                            onChange={(e) => setRecorrente(e.target.checked)}
                            className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-400"
                        />
                        <label htmlFor="recorrente" className="text-sm font-medium text-gray-700">
                            Vacina recorrente (sem limite de doses)
                        </label>
                    </div>

                    {!recorrente && (
                        <>
                            <div>
                                <label htmlFor="qtd-doses" className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantidade de Doses
                                </label>
                                <input
                                    id="qtd-doses"
                                    type="number"
                                    min="1"
                                    value={qtdDoses}
                                    onChange={(e) => setQtdDoses(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                                    placeholder="Número de doses"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id="doses-reforco"
                                    type="checkbox"
                                    checked={dosesReforco}
                                    onChange={(e) => setDosesReforco(e.target.checked)}
                                    className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-400"
                                />
                                <label htmlFor="doses-reforco" className="text-sm font-medium text-gray-700">
                                    Possui doses de reforço
                                </label>
                            </div>
                            {dosesReforco && (
                                <div>
                                    <label htmlFor="qtd-reforco"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantidade de Reforços
                                    </label>
                                    <input
                                        id="qtd-reforco"
                                        type="number"
                                        min="1"
                                        value={qtdReforco}
                                        onChange={(e) => setQtdReforco(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                                        placeholder="Número de reforços"
                                    />
                                </div>
                            )}
                        </>
                    )}

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
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
