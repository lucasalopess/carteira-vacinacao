import type {Pessoa} from '../types';

interface PessoaInfoProps {
    pessoa: Pessoa;
    onEdit?: () => void;
}

export function PessoaInfo({pessoa, onEdit}: PessoaInfoProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Dados da Pessoa
                </h2>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar pessoa"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <span className="text-sm text-gray-500">Nome</span>
                    <p className="font-medium text-gray-900">{pessoa.nome}</p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Idade</span>
                    <p className="font-medium text-gray-900">{pessoa.idade} anos</p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Sexo</span>
                    <p className="font-medium text-gray-900">{pessoa.sexo}</p>
                </div>
            </div>
        </div>
    );
}
