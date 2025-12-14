export const API_BASE_URL = "/api";

export async function parseErrorResponse(response: Response): Promise<string> {
    try {
        const data = await response.json();
        if (data.message) {
            return data.message;
        }
    } catch (error) {
        console.error('Erro ao processar resposta JSON:', error);
    }
    return `Erro ${response.status}: ${response.statusText}`;
}
