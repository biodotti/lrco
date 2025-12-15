/**
 * Inicializa cliente Groq (apenas valida a chave)
 */
export function initializeGroq(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('Chave API Groq é obrigatória');
    }
    return apiKey; // Retorna a chave para uso posterior
}

/**
 * Analisa texto extraído do PDF usando Groq API REST
 */
export async function analyzeTextWithGroq(apiKey, extractedText) {
    try {
        console.log('[Groq] Iniciando análise...');
        console.log(`[Groq] Texto: ${extractedText.length} caracteres`);

        const prompt = `Você é um assistente especializado em validar documentos de LRCO (Livro de Registro de Classe Online) para o Estágio Probatório de professores no Paraná.

Analise o texto abaixo e verifique os seguintes critérios:

1. **Registro de Avaliação**: Deve conter:
   - Resolução 3.037/2024 - GS/SEED
   - Resolução 7.342/2024 - GS/SEED
   - Menção à progressão de ano (1º→2º ou 2º→3º)

2. **Objetivos de Conteúdo**: 
   - Registros de encontros/aulas devem conter objetivos de aprendizagem

3. **Frequências**: 
   - Conte o número TOTAL de DATAS/REGISTROS únicos no documento
   - Cada data representa um encontro/registro
   - O total de registros deve ser número PAR entre 42 e 50
   - NÃO conte menções à palavra "frequência", conte DATAS (formato DD/MM/AAAA ou similar)

Retorne APENAS um objeto JSON válido com o seguinte formato (sem texto adicional):
{
  "registroAvaliacao": {
    "passed": true ou false,
    "details": "explicação detalhada do resultado",
    "foundResolutions": ["lista de resoluções encontradas"]
  },
  "objetivosConteudo": {
    "passed": true ou false,
    "details": "explicação detalhada do resultado"
  },
  "frequencias": {
    "passed": true ou false,
    "details": "explicação detalhada do resultado",
    "total": número total de frequências encontradas
  }
}

TEXTO DO PDF:
${extractedText.substring(0, 15000)}`;

        console.log('[Groq] Enviando requisição via fetch...');

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        console.log('[Groq] Resposta recebida');
        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);
        console.log('[Groq] Análise concluída:', result);

        return result;

    } catch (error) {
        console.error('[Groq] Erro:', error);

        if (error.message?.includes('API key') || error.message?.includes('401')) {
            throw new Error('Chave API Groq inválida. Verifique se copiou corretamente.');
        }

        if (error.message?.includes('429')) {
            throw new Error('Limite de requisições excedido. Aguarde alguns segundos.');
        }

        throw new Error(`Falha na análise: ${error.message}`);
    }
}
