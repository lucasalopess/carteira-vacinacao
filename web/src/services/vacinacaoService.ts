import type { Vacina, VacinacaoPessoa } from '../types';
import { API_BASE_URL, parseErrorResponse } from './apiClient';

export async function fetchVacinacaoPessoa(pessoaId: number): Promise<VacinacaoPessoa[]> {
    const response = await fetch(`${API_BASE_URL}/vacinacao/pessoa/${pessoaId}`);
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function createVacinacao(data: {
    pessoaId: number;
    vacinaId: number;
    dataVacinacao: string;
}): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vacinacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
}

export async function deleteVacinacao(vacinacaoId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vacinacao/${vacinacaoId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
}

export async function fetchVacinasAtrasadas(pessoaId: number): Promise<Vacina[]> {
    const response = await fetch(`${API_BASE_URL}/vacinacao/pessoa/${pessoaId}/atrasadas`);
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}
