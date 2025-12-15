import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker do PDF.js para usar cópia local
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

/**
 * Extrai texto completo de um PDF usando PDF.js
 */
export async function extractTextFromPDF(pdfFile) {
    try {
        console.log(`[PDF] Processando: ${pdfFile.name}`);

        const arrayBuffer = await pdfFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        console.log(`[PDF] ${pdf.numPages} páginas carregadas`);

        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `\n\n--- Página ${pageNum} ---\n${pageText}`;
        }

        console.log(`[PDF] Texto extraído: ${fullText.length} caracteres`);
        return fullText;

    } catch (error) {
        console.error('[PDF] Erro:', error);
        throw new Error(`Falha ao processar ${pdfFile.name}: ${error.message}`);
    }
}

/**
 * Processa múltiplos PDFs sequencialmente
 */
export async function processPDFBatch(pdfFiles, onProgress) {
    const results = [];

    console.log(`[Batch] Iniciando ${pdfFiles.length} PDFs`);

    for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];

        console.log(`[Batch] ${i + 1}/${pdfFiles.length}: ${file.name}`);

        if (onProgress) {
            onProgress(i, pdfFiles.length, file.name);
        }

        const text = await extractTextFromPDF(file);
        results.push({ file, text });

        console.log(`[Batch] ${i + 1}/${pdfFiles.length} concluído`);
    }

    console.log(`[Batch] Todos os PDFs processados`);
    return results;
}
