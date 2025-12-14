import type { Pessoa } from '../types';
import { API_BASE_URL, parseErrorResponse } from './apiClient';

export async function fetchPessoas(): Promise<Pessoa[]> {
    const response = await fetch(`${API_BASE_URL}/pessoa`);
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function fetchSexoOptions(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/pessoa/sexo`);
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function createPessoa(data: { nome: string; idade: number; sexo: string }): Promise<Pessoa> {
    const response = await fetch(`${API_BASE_URL}/pessoa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function updatePessoa(id: number, data: { nome: string; idade: number; sexo: string }): Promise<Pessoa> {
    const response = await fetch(`${API_BASE_URL}/pessoa/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function deletePessoa(pessoaId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pessoa/${pessoaId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
}
