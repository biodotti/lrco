/**
 * Determina decisão final baseada nas validações
 * @param {Object} validationResults - Resultados das validações do Groq
 * @returns {string} Decisão: 'ENVIAR_SERE', 'ENVIAR_RESSALVAS' ou 'DEVOLVER'
 */
export function determineDecision(validationResults) {
    const { registroAvaliacao, objetivosConteudo, frequencias } = validationResults;

    const failedValidations = [
        !registroAvaliacao.passed,
        !objetivosConteudo.passed,
        !frequencias.passed
    ].filter(Boolean);

    const failedCount = failedValidations.length;

    if (failedCount === 0) {
        return 'ENVIAR_SERE';
    } else if (failedCount === 1) {
        return 'ENVIAR_RESSALVAS';
    } else {
        return 'DEVOLVER';
    }
}

/**
 * Extrai lista de ressalvas dos resultados de validação
 * @param {Object} validationResults - Resultados das validações do Groq
 * @returns {string[]} Array de ressalvas
 */
export function extractRessalvas(validationResults) {
    const ressalvas = [];

    if (!validationResults.registroAvaliacao.passed) {
        ressalvas.push('Registro de avaliação não conforme com o padrão exigido');
    }

    if (!validationResults.objetivosConteudo.passed) {
        ressalvas.push('Objetivos ausentes ou insuficientes nos registros de conteúdo');
    }

    if (!validationResults.frequencias.passed) {
        ressalvas.push(`Frequências inválidas (total: ${validationResults.frequencias.total})`);
    }

    return ressalvas;
}
