import Groq from 'groq-sdk';

/**
 * Inicializa cliente Groq com chave API
 * @param {string} apiKey - Chave API da Groq
 * @returns {Groq} Cliente Groq inicializado
 */
export function initializeGroq(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('Chave API Groq é obrigatória');
    }

    return new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Permite uso no navegador
    });
}

/**
 * Analisa texto extraído do PDF usando Groq
 * @param {Groq} groq - Cliente Groq
 * @param {string} extractedText - Texto extraído do PDF
 * @returns {Promise<Object>} Resultado da análise com validações
 */
export async function analyzeTextWithGroq(groq, extractedText) {
    try {
        console.log('Enviando texto para análise com Groq...');

        const prompt = `Você é um assistente especializado em validar documentos de LRCO (Livro de Registro de Classe Online) para o Estágio Probatório de professores no Paraná.

Analise o texto abaixo e verifique os seguintes critérios:

1. **Registro de Avaliação**: Deve conter:
   - Resolução 3.037/2024 - GS/SEED
   - Resolução 7.342/2024 - GS/SEED
   - Menção à progressão de ano (1º→2º ou 2º→3º)
   - Texto sobre matrícula e frequência mínima

2. **Objetivos de Conteúdo**: 
   - Registros de encontros/aulas devem conter objetivos de aprendizagem
   - Verifique se há descrição de objetivos pedagógicos

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
${extractedText.substring(0, 15000)}`;  // Limita a 15k caracteres para evitar exceder limite

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-70b-versatile', // Modelo mais recente e poderoso
            temperature: 0.1, // Baixa temperatura para respostas consistentes
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        console.log('Análise concluída:', result);

        return result;

    } catch (error) {
        console.error('Erro ao analisar com Groq:', error);

        // Mensagens de erro mais específicas
        if (error.message?.includes('API key') || error.message?.includes('401')) {
            throw new Error('Chave API Groq inválida. Verifique se copiou corretamente.');
        }

        if (error.message?.includes('429')) {
            throw new Error('Limite de requisições excedido. Aguarde alguns segundos e tente novamente.');
        }

        throw new Error(`Falha na análise: ${error.message}`);
    }
}
