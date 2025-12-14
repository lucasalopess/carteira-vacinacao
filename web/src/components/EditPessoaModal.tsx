import { useEffect, useState } from 'react';
import { fetchSexoOptions } from '../services';
import { useSnackbar } from '../contexts';
import { ConfirmModal } from './ConfirmModal.tsx';
import type { Pessoa } from '../types';

interface EditPessoaModalProps {
    isOpen: boolean;
    pessoa: Pessoa | null;
    onClose: () => void;
    onSubmit: (id: number, data: { nome: string; idade: number; sexo: string }) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export function EditPessoaModal({ isOpen, pessoa, onClose, onSubmit, onDelete }: EditPessoaModalProps) {
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [sexo, setSexo] = useState('');
    const [sexoOptions, setSexoOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSexo, setIsLoadingSexo] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { showError } = useSnackbar();

    useEffect(() => {
        if (isOpen) {
            loadSexoOptions();
            if (pessoa) {
                setNome(pessoa.nome);
                setIdade(String(pessoa.idade));
                setSexo(pessoa.sexo);
            }
        }
    }, [isOpen, pessoa]);

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

        if (!pessoa) return;

        if (!nome.trim() || !idade || !sexo) {
            showError('Preencha todos os campos');
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit(pessoa.id, {
                nome: nome.trim(),
                idade: parseInt(idade, 10),
                sexo,
            });
            onClose();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao atualizar pessoa');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!pessoa) return;

        try {
            setIsLoading(true);
            await onDelete(pessoa.id);
            setShowDeleteConfirm(false);
            onClose();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao excluir pessoa');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Editar Pessoa
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

                        <div className="flex justify-between pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Excluir Pessoa
                            </button>
                            <div className="flex gap-3">
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
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Excluir Pessoa"
                message={`Tem certeza que deseja excluir "${pessoa?.nome}"? Esta ação não pode ser desfeita.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                isLoading={isLoading}
            />
        </>
    );
}
