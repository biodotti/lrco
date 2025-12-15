import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Inicializa o cliente Gemini com a chave API
 */
export function initializeGemini(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('Chave API Gemini é obrigatória');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Usar Gemini 2.5 Flash (modelo atual e ativo)
    return genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
}

/**
 * Converte arquivo PDF para base64
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Extrai texto completo de um PDF usando Gemini
 */
export async function extractTextFromPDF(model, pdfFile) {
    try {
        console.log(`Processando PDF: ${pdfFile.name}, tamanho: ${(pdfFile.size / 1024).toFixed(2)} KB`);

        // Converte PDF para base64
        const base64Data = await fileToBase64(pdfFile);
        console.log(`PDF convertido para base64, tamanho: ${base64Data.length} caracteres`);

        // Prompt para extração estruturada
        const prompt = `Extraia TODO o texto deste PDF de forma estruturada e completa.

IMPORTANTE: Preserve EXATAMENTE como aparecem no documento:
- Todos os títulos e seções
- Todas as datas e horários
- Todas as listas e tabelas
- TODOS os registros de frequência (cada um deles)
- Todos os registros de conteúdo/encontros
- Todas as resoluções e números de documentos oficiais
- Todo o texto de avaliação e parecer final

Retorne o texto completo extraído, preservando a estrutura original.
NÃO resuma, NÃO omita nada. Extraia TUDO.`;

        console.log('Enviando requisição para Gemini API...');

        // Envia para Gemini
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: base64Data
                }
            },
            prompt
        ]);

        console.log('Resposta recebida da API');
        const response = await result.response;
        const text = response.text();

        console.log(`Texto extraído com sucesso, ${text.length} caracteres`);
        return text;

    } catch (error) {
        console.error('ERRO DETALHADO:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText
        });

        // Mensagens de erro mais específicas
        if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
            throw new Error('Chave API inválida. Verifique se copiou corretamente do Google AI Studio.');
        }

        if (error.status === 429 || error.message?.includes('429')) {
            throw new Error('Limite de requisições excedido. Aguarde 1 minuto e tente novamente.');
        }

        if (error.status === 400) {
            throw new Error(`Requisição inválida: O PDF pode estar corrompido ou muito grande.`);
        }

        if (error.status === 403) {
            throw new Error(`Acesso negado: Sua chave API pode não ter permissão para este modelo.`);
        }

        if (error.message?.includes('model not found') || error.message?.includes('404')) {
            throw new Error('Modelo não encontrado. Atualize o SDK: npm install @google/generative-ai@latest');
        }

        throw new Error(`Falha ao processar ${pdfFile.name}: ${error.message}`);
    }
}

/**
 * Processa múltiplos PDFs com controle de concorrência e delay
 */
export async function processPDFBatch(model, pdfFiles, onProgress) {
    const results = [];
    const CONCURRENT_LIMIT = 1;
    const DELAY_MS = 3000; // 3 segundos de delay

    for (let i = 0; i < pdfFiles.length; i += CONCURRENT_LIMIT) {
        const batch = pdfFiles.slice(i, i + CONCURRENT_LIMIT);

        const batchPromises = batch.map(async (file, batchIndex) => {
            const globalIndex = i + batchIndex;

            if (onProgress) {
                onProgress(globalIndex, pdfFiles.length, file.name);
            }

            const text = await extractTextFromPDF(model, file);
            return { file, text };
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Delay entre PDFs
        if (i + CONCURRENT_LIMIT < pdfFiles.length) {
            console.log(`Aguardando ${DELAY_MS / 1000} segundos antes do próximo PDF...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    return results;
}
