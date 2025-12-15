import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extrai texto completo de um PDF usando PDF.js
 * @param {File} pdfFile - Arquivo PDF para processar
 * @returns {Promise<string>} Texto extraído do PDF
 */
export async function extractTextFromPDF(pdfFile) {
    try {
        console.log(`Processando PDF: ${pdfFile.name}, tamanho: ${(pdfFile.size / 1024).toFixed(2)} KB`);

        // Converte arquivo para ArrayBuffer
        const arrayBuffer = await pdfFile.arrayBuffer();

        // Carrega o PDF
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        console.log(`PDF carregado: ${pdf.numPages} páginas`);

        let fullText = '';

        // Processa cada página
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Extrai texto de cada item na página
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');

            fullText += `\n\n--- Página ${pageNum} ---\n${pageText}`;
        }

        console.log(`Texto extraído com sucesso: ${fullText.length} caracteres`);
        return fullText;

    } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error);
        throw new Error(`Falha ao processar ${pdfFile.name}: ${error.message}`);
    }
}

/**
 * Processa múltiplos PDFs sequencialmente
 * @param {File[]} pdfFiles - Array de arquivos PDF
 * @param {Function} onProgress - Callback de progresso (index, total, fileName)
 * @returns {Promise<Array<{file: File, text: string}>>} Array com arquivos e textos extraídos
 */
export async function processPDFBatch(pdfFiles, onProgress) {
    const results = [];

    for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];

        // Atualiza progresso
        if (onProgress) {
            onProgress(i, pdfFiles.length, file.name);
        }

        // Extrai texto
        const text = await extractTextFromPDF(file);
        results.push({ file, text });
    }

    return results;
}
