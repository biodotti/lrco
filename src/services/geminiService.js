import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Inicializa o cliente Gemini com a chave API
 */
export function initializeGemini(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('Chave API Gemini é obrigatória');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp"
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

        // Prompt simplificado para teste
        const prompt = `Extraia TODO o texto deste PDF. Preserve a estrutura original e não omita nada.`;

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
            statusText: error.statusText,
            errorDetails: error
        });

        // Log do erro completo para debug
        console.error('Erro completo:', JSON.stringify(error, null, 2));

        // Mensagens de erro mais específicas
        if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
            throw new Error('Chave API inválida. Verifique se copiou corretamente do Google AI Studio.');
        }

        // Verificar se é realmente 429 ou outro código
        if (error.status === 429 || error.message?.includes('429')) {
            throw new Error(`Rate limit (429): ${error.message}. Sua conta pode ter atingido o limite diário ou por minuto.`);
        }

        if (error.status === 400) {
            throw new Error(`Requisição inválida (400): ${error.message}. O PDF pode estar corrompido ou muito grande.`);
        }

        if (error.status === 403) {
            throw new Error(`Acesso negado (403): ${error.message}. Sua chave API pode não ter permissão para este modelo.`);
        }

        if (error.message?.includes('CORS') || error.message?.includes('fetch')) {
            throw new Error('Erro de conexão com a API. Verifique sua conexão com a internet.');
        }

        if (error.message?.includes('model not found') || error.message?.includes('404')) {
            throw new Error('Modelo não encontrado (404). Sua chave pode não ter acesso ao gemini-2.0-flash-exp.');
        }

        // Erro genérico com mais detalhes
        throw new Error(`Falha ao processar ${pdfFile.name}: [${error.status || 'UNKNOWN'}] ${error.message}`);
    }
}

/**
 * Processa múltiplos PDFs com controle de concorrência e delay
 */
export async function processPDFBatch(model, pdfFiles, onProgress) {
    const results = [];
    const CONCURRENT_LIMIT = 1;
    const DELAY_MS = 5000; // 5 segundos de delay

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
