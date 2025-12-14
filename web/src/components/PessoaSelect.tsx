import {useMemo, useState} from 'react';
import type {Pessoa} from '../types';

interface PessoaSelectProps {
    pessoas: Pessoa[];
    selectedPessoa: Pessoa | null;
    onSelect: (pessoa: Pessoa | null) => void;
    isLoading?: boolean;
}

export function PessoaSelect({
                                 pessoas,
                                 selectedPessoa,
                                 onSelect,
                                 isLoading = false,
                             }: PessoaSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredPessoas = useMemo(() => {
        if (!searchTerm) return pessoas;
        return pessoas.filter((pessoa) =>
            pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pessoas, searchTerm]);

    const handleSelect = (pessoa: Pessoa) => {
        onSelect(pessoa);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        if (selectedPessoa) {
            onSelect(null);
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSelect(null);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full max-w-md">
            <label
                htmlFor="person-search"
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                Buscar Pessoa
            </label>
            <div className="relative">
                <input
                    id="person-search"
                    type="text"
                    value={selectedPessoa ? selectedPessoa.nome : searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={isLoading ? 'Carregando...' : 'Digite o nome...'}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {(selectedPessoa || searchTerm) && (
                    <button
                        onClick={handleClear}
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                )}
            </div>

            {isOpen && !selectedPessoa && filteredPessoas.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPessoas.map((pessoa) => (
                        <li key={pessoa.id}>
                            <button
                                type="button"
                                onClick={() => handleSelect(pessoa)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                            >
                                <span className="font-medium">{pessoa.nome}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                    {pessoa.idade} anos • {pessoa.sexo}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && !selectedPessoa && searchTerm && filteredPessoas.length === 0 && (
                <div
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    Nenhuma pessoa encontrada
                </div>
            )}
        </div>
    );
}
