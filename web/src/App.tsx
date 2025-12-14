import {useCallback, useEffect, useState} from 'react';
import {
    AddPessoaModal,
    AddVacinacaoModal,
    AddVacinaModal,
    CartaoVacinacao,
    CentralAlerta,
    EditPessoaModal,
    EditVacinaModal,
    PessoaInfo,
    PessoaSelect,
} from './components';
import {
    createPessoa,
    createVacina,
    createVacinacao,
    deletePessoa,
    deleteVacina,
    deleteVacinacao,
    fetchPessoas,
    fetchVacinacaoPessoa,
    fetchVacinas,
    fetchVacinasAtrasadas,
    updatePessoa,
    updateVacina,
} from './services';
import {useSnackbar} from './contexts';
import type {Pessoa, Vacina, VacinacaoPessoa} from './types';

function App() {
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [vacinas, setVacinas] = useState<Vacina[]>([]);
    const [vacinacoes, setVacinacoes] = useState<VacinacaoPessoa[]>([]);
    const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);
    const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
    const [isLoadingVacinas, setIsLoadingVacinas] = useState(true);
    const [isLoadingVacinacoes, setIsLoadingVacinacoes] = useState(false);
    const [vacinasAtrasadas, setVacinasAtrasadas] = useState<Vacina[]>([]);
    const [isLoadingAtrasadas, setIsLoadingAtrasadas] = useState(false);

    const {showSuccess, showError} = useSnackbar();

    // Estado dos popups
    const [isAddPessoaOpen, setIsAddPessoaOpen] = useState(false);
    const [isAddVacinaOpen, setIsAddVacinaOpen] = useState(false);
    const [addVacinacaoState, setAddVacinacaoState] = useState<{ isOpen: boolean; vacina: Vacina | null }>({
        isOpen: false,
        vacina: null,
    });
    const [editPessoaState, setEditPessoaState] = useState<{ isOpen: boolean; pessoa: Pessoa | null }>({
        isOpen: false,
        pessoa: null,
    });
    const [editVacinaState, setEditVacinaState] = useState<{ isOpen: boolean; vacina: Vacina | null }>({
        isOpen: false,
        vacina: null,
    });

    // Dados Iniciais
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoadingPessoas(true);
                setIsLoadingVacinas(true);

                const [pessoasData, vacinasData] = await Promise.all([
                    fetchPessoas(),
                    fetchVacinas(),
                ]);

                setPessoas(pessoasData);
                setVacinas(vacinasData);
            } catch (err) {
                showError(err instanceof Error ? err.message : 'Erro ao carregar dados');
            } finally {
                setIsLoadingPessoas(false);
                setIsLoadingVacinas(false);
            }
        }

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Carregar histórico de vacinação quando selecionar pessoa
    const loadVacinacoes = useCallback(async () => {
        if (!selectedPessoa) {
            setVacinacoes([]);
            return;
        }

        try {
            setIsLoadingVacinacoes(true);
            const vacinacoesData = await fetchVacinacaoPessoa(selectedPessoa.id);
            setVacinacoes(vacinacoesData);
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao carregar vacinações');
            setVacinacoes([]);
        } finally {
            setIsLoadingVacinacoes(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPessoa]);

    useEffect(() => {
        loadVacinacoes();
    }, [loadVacinacoes]);

    // Carregar vacinas atrasadas quando selecionar pessoa
    const loadVacinasAtrasadas = useCallback(async () => {
        if (!selectedPessoa) {
            setVacinasAtrasadas([]);
            return;
        }

        try {
            setIsLoadingAtrasadas(true);
            const data = await fetchVacinasAtrasadas(selectedPessoa.id);
            setVacinasAtrasadas(data);
        } catch (err) {
            console.error('Erro ao carregar vacinas atrasadas:', err);
            setVacinasAtrasadas([]);
        } finally {
            setIsLoadingAtrasadas(false);
        }
    }, [selectedPessoa]);

    useEffect(() => {
        loadVacinasAtrasadas();
    }, [loadVacinasAtrasadas]);

    // Handlers de pessoa
    const handleAddPessoa = async (data: { nome: string; idade: number; sexo: string }) => {
        const newPessoa = await createPessoa(data);
        setPessoas((prev) => [...prev, newPessoa]);
        setSelectedPessoa(newPessoa);
        showSuccess('Pessoa cadastrada com sucesso!');
    };

    const handleUpdatePessoa = async (id: number, data: { nome: string; idade: number; sexo: string }) => {
        const updated = await updatePessoa(id, data);
        setPessoas((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setSelectedPessoa(updated);
        showSuccess('Pessoa atualizada com sucesso!');
    };

    const handleDeletePessoa = async (id: number) => {
        await deletePessoa(id);
        setPessoas((prev) => prev.filter((p) => p.id !== id));
        setSelectedPessoa(null);
        showSuccess('Pessoa excluída com sucesso!');
    };

    // Handlers de Vacina
    const handleAddVacina = async (data: {
        nome: string;
        idadeInicial: number;
        intervaloDoses: number;
        recorrente: boolean;
        qtdDoses: number | null;
        dosesReforco: boolean;
        qtdReforco: number | null;
    }) => {
        const newVacina = await createVacina(data);
        setVacinas((prev) => [...prev, newVacina]);
        await loadVacinasAtrasadas();
        showSuccess('Vacina cadastrada com sucesso!');
    };

    const handleUpdateVacina = async (id: number, data: {
        nome: string;
        idadeInicial: number;
        intervaloDoses: number;
        recorrente: boolean;
        qtdDoses: number | null;
        dosesReforco: boolean;
        qtdReforco: number | null;
    }) => {
        const updated = await updateVacina(id, data);
        setVacinas((prev) => prev.map((v) => (v.id === id ? updated : v)));
        await loadVacinasAtrasadas();
        showSuccess('Vacina atualizada com sucesso!');
    };

    const handleDeleteVacina = async (id: number) => {
        await deleteVacina(id);
        setVacinas((prev) => prev.filter((v) => v.id !== id));
        await loadVacinasAtrasadas();
        showSuccess('Vacina excluída com sucesso!');
    };

    // Handlers de Vacinacao
    const handleAddVacinacao = async (data: { pessoaId: number; vacinaId: number; dataVacinacao: string }) => {
        await createVacinacao(data);
        await loadVacinacoes();
        await loadVacinasAtrasadas();
        showSuccess('Vacinação registrada com sucesso!');
    };

    const handleDeleteVacinacao = async (vacinacaoId: number) => {
        await deleteVacinacao(vacinacaoId);
        await loadVacinacoes();
        await loadVacinasAtrasadas();
        showSuccess('Vacinação excluída com sucesso!');
    };

    const handleOpenAddVacinacao = (vacina: Vacina) => {
        setAddVacinacaoState({isOpen: true, vacina});
    };

    const handleOpenEditPessoa = () => {
        if (selectedPessoa) {
            setEditPessoaState({isOpen: true, pessoa: selectedPessoa});
        }
    };

    const handleOpenEditVacina = (vacina: Vacina) => {
        setEditVacinaState({isOpen: true, vacina});
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Carteira de Vacinação
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Selecione uma pessoa para visualizar sua carteira de vacinação
                    </p>
                </header>

                <div className="space-y-6">
                    <div className="flex items-end gap-3">
                        <PessoaSelect
                            pessoas={pessoas}
                            selectedPessoa={selectedPessoa}
                            onSelect={setSelectedPessoa}
                            isLoading={isLoadingPessoas}
                        />
                        <button
                            onClick={() => setIsAddPessoaOpen(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 whitespace-nowrap h-[42px]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                            </svg>
                            <span className="hidden sm:inline">Nova Pessoa</span>
                        </button>
                    </div>

                    {selectedPessoa && (
                        <PessoaInfo
                            pessoa={selectedPessoa}
                            onEdit={handleOpenEditPessoa}
                        />
                    )}

                    <CartaoVacinacao
                        vacinas={vacinas}
                        vacinacoes={vacinacoes}
                        isLoading={isLoadingVacinas || isLoadingVacinacoes}
                        hasSelectedPessoa={!!selectedPessoa}
                        onDeleteVacinacao={selectedPessoa ? handleDeleteVacinacao : undefined}
                        onEditVacina={handleOpenEditVacina}
                        onAddVacina={() => setIsAddVacinaOpen(true)}
                        onAddVacinacao={selectedPessoa ? handleOpenAddVacinacao : undefined}
                    />

                    {selectedPessoa && (
                        <CentralAlerta
                            pessoa={selectedPessoa}
                            vacinasAtrasadas={vacinasAtrasadas}
                            vacinacoes={vacinacoes}
                            isLoading={isLoadingAtrasadas}
                        />
                    )}
                </div>
            </div>

            <AddPessoaModal
                isOpen={isAddPessoaOpen}
                onClose={() => setIsAddPessoaOpen(false)}
                onSubmit={handleAddPessoa}
            />
            <AddVacinaModal
                isOpen={isAddVacinaOpen}
                onClose={() => setIsAddVacinaOpen(false)}
                onSubmit={handleAddVacina}
            />
            <AddVacinacaoModal
                isOpen={addVacinacaoState.isOpen}
                pessoa={selectedPessoa}
                vacina={addVacinacaoState.vacina}
                vacinas={vacinas}
                onClose={() => setAddVacinacaoState({isOpen: false, vacina: null})}
                onSubmit={handleAddVacinacao}
            />
            <EditPessoaModal
                isOpen={editPessoaState.isOpen}
                pessoa={editPessoaState.pessoa}
                onClose={() => setEditPessoaState({isOpen: false, pessoa: null})}
                onSubmit={handleUpdatePessoa}
                onDelete={handleDeletePessoa}
            />
            <EditVacinaModal
                isOpen={editVacinaState.isOpen}
                vacina={editVacinaState.vacina}
                onClose={() => setEditVacinaState({isOpen: false, vacina: null})}
                onSubmit={handleUpdateVacina}
                onDelete={handleDeleteVacina}
            />
        </div>
    );
}

export default App;
