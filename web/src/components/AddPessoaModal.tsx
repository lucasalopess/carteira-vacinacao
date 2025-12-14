import { useEffect, useState } from 'react';
import { fetchSexoOptions } from '../services';
import { useSnackbar } from '../contexts';

interface AddPessoaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { nome: string; idade: number; sexo: string }) => Promise<void>;
}

export function AddPessoaModal({ isOpen, onClose, onSubmit }: AddPessoaModalProps) {
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [sexo, setSexo] = useState('');
    const [sexoOptions, setSexoOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSexo, setIsLoadingSexo] = useState(false);

    const { showError } = useSnackbar();

    useEffect(() => {
        if (isOpen) {
            loadSexoOptions();
        }
    }, [isOpen]);

    const loadSexoOptions = async () => {
        try {
            setIsLoadingSexo(true);
            const options = await fetchSexoOptions();
            setSexoOptions(options);
        } catch (err) {
            console.error('Erro ao carregar opções de sexo:', err);
            setSexoOptions(['Masculino', 'Feminino', 'Outro']);
        } finally {
            setIsLoadingSexo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim() || !idade || !sexo) {
            showError('Preencha todos os campos');
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit({
                nome: nome.trim(),
                idade: parseInt(idade, 10),
                sexo,
            });
            setNome('');
            setIdade('');
            setSexo('');
            onClose();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao adicionar pessoa');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Nova Pessoa
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome
                        </label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                            placeholder="Digite o nome"
                        />
                    </div>
                    <div>
                        <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-1">
                            Idade
                        </label>
                        <input
                            id="idade"
                            type="number"
                            min="0"
                            max="150"
                            value={idade}
                            onChange={(e) => setIdade(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
                            placeholder="Digite a idade"
                        />
                    </div>
                    <div>
                        <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
                            Sexo
                        </label>
                        <select
                            id="sexo"
                            value={sexo}
                            onChange={(e) => setSexo(e.target.value)}
                            disabled={isLoadingSexo}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none disabled:bg-gray-100"
                        >
                            <option value="">{isLoadingSexo ? 'Carregando...' : 'Selecione...'}</option>
                            {sexoOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
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
