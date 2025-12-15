/**
 * Valida o registro de avaliação conforme texto padrão
 */
export function validateRegistroAvaliacao(extractedText) {
    const text = extractedText.toLowerCase();

    // Verificar resoluções obrigatórias
    const resolucao3037 = text.includes('3.037/2024') || text.includes('3037/2024');
    const resolucao7342 = text.includes('7.342/2024') || text.includes('7342/2024');

    const foundResolutions = [];
    if (resolucao3037) foundResolutions.push('3.037/2024');
    if (resolucao7342) foundResolutions.push('7.342/2024');

    // Verificar menção a progressão de ano
    const menciona1para2 = (text.includes('1º') || text.includes('primeiro')) &&
        (text.includes('2º') || text.includes('segundo'));
    const menciona2para3 = (text.includes('2º') || text.includes('segundo')) &&
        (text.includes('3º') || text.includes('terceiro'));
    const mencionaProgressao = menciona1para2 || menciona2para3;

    // Verificar elementos do texto padrão
    const mencionaMatricula = text.includes('matriculado') || text.includes('matrícula');
    const mencionaFrequencia = text.includes('frequência') || text.includes('frequencia');
    const mencionaEstagioProb = text.includes('estágio probatório') ||
        text.includes('estagio probatorio');

    // Determinar se passou
    const passed = resolucao3037 && resolucao7342 && mencionaProgressao &&
        mencionaMatricula && mencionaFrequencia && mencionaEstagioProb;

    // Construir detalhes
    let details = '';
    if (passed) {
        details = `✅ Registro conforme. Resoluções encontradas: ${foundResolutions.join(', ')}. ` +
            `Menciona progressão de ano, matrícula, frequência e estágio probatório.`;
    } else {
        const problemas = [];
        if (!resolucao3037) problemas.push('Resolução 3.037/2024 não encontrada');
        if (!resolucao7342) problemas.push('Resolução 7.342/2024 não encontrada');
        if (!mencionaProgressao) problemas.push('Não menciona progressão de ano (1º→2º ou 2º→3º)');
        if (!mencionaMatricula) problemas.push('Não menciona matrícula');
        if (!mencionaFrequencia) problemas.push('Não menciona frequência');
        if (!mencionaEstagioProb) problemas.push('Não menciona estágio probatório');

        details = `❌ Problemas encontrados: ${problemas.join('; ')}`;
    }

    return {
        passed,
        details,
        foundResolutions
    };
}

/**
 * Valida objetivos nos registros de conteúdo
 */
export function validateObjetivosConteudo(extractedText) {
    const text = extractedText.toLowerCase();

    // Procurar por seções de registro de conteúdo
    const registroPatterns = [
        /registro\s+de\s+conteúdo/gi,
        /registro\s+de\s+conteudo/gi,
        /conteúdo\s+programático/gi,
        /conteudo\s+programatico/gi,
        /encontro\s+\d+/gi,
        /aula\s+\d+/gi
    ];

    let registrosEncontrados = 0;
    registroPatterns.forEach(pattern => {
        const matches = extractedText.match(pattern);
        if (matches) {
            registrosEncontrados += matches.length;
        }
    });

    // Procurar por menções a objetivos
    const objetivoPatterns = [
        /objetivo/gi,
        /objetivos/gi,
        /finalidade/gi,
        /propósito/gi,
        /proposito/gi,
        /meta/gi
    ];

    let objetivosEncontrados = 0;
    objetivoPatterns.forEach(pattern => {
        const matches = extractedText.match(pattern);
        if (matches) {
            objetivosEncontrados += matches.length;
        }
    });

    // Heurística: deve haver pelo menos 1 menção a objetivo para cada 2 registros
    const passed = objetivosEncontrados > 0 &&
        (registrosEncontrados === 0 || objetivosEncontrados >= registrosEncontrados / 2);

    let details = '';
    if (passed) {
        details = `✅ Objetivos encontrados nos registros. ` +
            `Registros identificados: ${registrosEncontrados}, ` +
            `Menções a objetivos: ${objetivosEncontrados}`;
    } else {
        details = `❌ Objetivos insuficientes ou ausentes. ` +
            `Registros identificados: ${registrosEncontrados}, ` +
            `Menções a objetivos: ${objetivosEncontrados}`;
    }

    return {
        passed,
        details,
        registrosEncontrados,
        objetivosEncontrados
    };
}

/**
 * Valida frequências (deve ser par, entre 42-50, de 2 em 2)
 */
export function validateFrequencias(extractedText) {
    const text = extractedText.toLowerCase();

    // Procurar por registros de frequência
    // Padrões comuns: "frequência", "presença", "P" (presente), checkmarks, etc.
    const frequenciaPatterns = [
        /frequência/gi,
        /frequencia/gi,
        /presença/gi,
        /presenca/gi,
        /\bpresente\b/gi,
        /\bp\b/gi, // "P" de presente (cuidado com falsos positivos)
    ];

    let totalFrequencias = 0;

    // Tentar contar menções explícitas de frequência
    frequenciaPatterns.forEach(pattern => {
        const matches = extractedText.match(pattern);
        if (matches) {
            totalFrequencias += matches.length;
        }
    });

    // Se encontrou poucas menções, tentar buscar por datas (cada encontro tem data)
    if (totalFrequencias < 20) {
        const datePatterns = [
            /\d{1,2}\/\d{1,2}\/\d{2,4}/g, // DD/MM/YYYY
            /\d{1,2}-\d{1,2}-\d{2,4}/g,   // DD-MM-YYYY
        ];

        let datesFound = 0;
        datePatterns.forEach(pattern => {
            const matches = extractedText.match(pattern);
            if (matches) {
                datesFound += matches.length;
            }
        });

        // Se há muitas datas, assumir que cada data = 2 frequências (manhã/tarde)
        if (datesFound > totalFrequencias / 2) {
            totalFrequencias = datesFound * 2;
        }
    }

    // Validar critérios
    const isPar = totalFrequencias % 2 === 0;
    const isInRange = totalFrequencias >= 42 && totalFrequencias <= 50;
    const passed = isPar && isInRange;

    let details = '';
    if (passed) {
        details = `✅ Frequências válidas. Total: ${totalFrequencias} (par, dentro do intervalo 42-50)`;
    } else {
        const problemas = [];
        if (!isPar) problemas.push(`Total ${totalFrequencias} é ímpar (deve ser par)`);
        if (!isInRange) {
            if (totalFrequencias < 42) problemas.push(`Total ${totalFrequencias} abaixo do mínimo (42)`);
            if (totalFrequencias > 50) problemas.push(`Total ${totalFrequencias} acima do máximo (50)`);
        }
        details = `❌ ${problemas.join('; ')}`;
    }

    return {
        passed,
        details,
        total: totalFrequencias
    };
}

/**
 * Determina decisão final baseada nas validações
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
