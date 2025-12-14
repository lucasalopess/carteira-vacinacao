import type { Vacina } from '../types';
import { API_BASE_URL, parseErrorResponse } from './apiClient';

export async function fetchVacinas(): Promise<Vacina[]> {
    const response = await fetch(`${API_BASE_URL}/vacina`);
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function createVacina(data: {
    nome: string;
    idadeInicial: number;
    intervaloDoses: number;
    recorrente: boolean;
    qtdDoses: number | null;
    dosesReforco: boolean;
    qtdReforco: number | null;
}): Promise<Vacina> {
    const response = await fetch(`${API_BASE_URL}/vacina`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function updateVacina(id: number, data: {
    nome: string;
    idadeInicial: number;
    intervaloDoses: number;
    recorrente: boolean;
    qtdDoses: number | null;
    dosesReforco: boolean;
    qtdReforco: number | null;
}): Promise<Vacina> {
    const response = await fetch(`${API_BASE_URL}/vacina/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
    return response.json();
}

export async function deleteVacina(vacinaId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vacina/${vacinaId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }
}
