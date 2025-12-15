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
        // Converte PDF para base64
        const base64Data = await fileToBase64(pdfFile);

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

        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error);
        throw new Error(`Falha ao processar ${pdfFile.name}: ${error.message}`);
    }
}

/**
 * Processa múltiplos PDFs com controle de concorrência
 */
export async function processPDFBatch(model, pdfFiles, onProgress) {
    const results = [];
    const CONCURRENT_LIMIT = 3; // Processa 3 PDFs por vez

    for (let i = 0; i < pdfFiles.length; i += CONCURRENT_LIMIT) {
        const batch = pdfFiles.slice(i, i + CONCURRENT_LIMIT);

        const batchPromises = batch.map(async (file, batchIndex) => {
            const globalIndex = i + batchIndex;

            // Atualiza progresso
            if (onProgress) {
                onProgress(globalIndex, pdfFiles.length, file.name);
            }

            const text = await extractTextFromPDF(model, file);
            return { file, text };
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
    }

    return results;
}
