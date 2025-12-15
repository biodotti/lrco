import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import ApiKeyInput from './components/ApiKeyInput';
import FileUploader from './components/FileUploader';
import ProgressIndicator from './components/ProgressIndicator';
import ValidationResults from './components/ValidationResults';
import { processPDFBatch } from './services/pdfService';
import { initializeGroq, analyzeTextWithGroq } from './services/groqService';
import {
    determineDecision,
    extractRessalvas
} from './services/validationService';

function App() {
    const [apiKey, setApiKey] = useState('');
    const [files, setFiles] = useState([]);
    const [state, setState] = useState('INITIAL'); // INITIAL, PROCESSING, RESULTS
    const [progress, setProgress] = useState({ current: 0, total: 0, currentFile: '' });
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleApiKeyChange = (key) => {
        setApiKey(key);
        setError(null);
    };

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
        setError(null);
    };

    const handleValidation = async () => {
        // Validações iniciais
        if (!apiKey || apiKey.trim() === '') {
            setError('Por favor, insira sua chave API Groq');
            return;
        }

        if (files.length === 0) {
            setError('Por favor, selecione pelo menos um PDF');
            return;
        }

        setError(null);
        setState('PROCESSING');
        setProgress({ current: 0, total: files.length, currentFile: '' });

        try {
            // 1. Inicializa Groq
            const groq = initializeGroq(apiKey);

            // 2. Extrai texto dos PDFs com PDF.js
            const updateProgress = (current, total, fileName) => {
                setProgress({ current, total, currentFile: fileName });
            };

            const extractedData = await processPDFBatch(files, updateProgress);

            // 3. Analisa cada PDF com Groq
            const validationPromises = extractedData.map(async ({ file, text }) => {
                // Groq analisa tudo de uma vez
                const validations = await analyzeTextWithGroq(groq, text);

                // Determina decisão final
                const decision = determineDecision(validations);

                // Extrai ressalvas se houver
                const ressalvas = extractRessalvas(validations);

                return {
                    fileName: file.name,
                    decision,
                    validations,
                    ressalvas
                };
            });

            // Aguarda todas as análises
            const validationResults = await Promise.all(validationPromises);

            // Atualiza progresso final
            setProgress({ current: files.length, total: files.length, currentFile: '' });

            // 4. Exibe resultados
            setResults(validationResults);
            setState('RESULTS');

        } catch (err) {
            console.error('Erro durante validação:', err);
            setError(err.message || 'Erro ao processar PDFs. Verifique sua chave API e tente novamente.');
            setState('INITIAL');
        }
    };

    const handleReset = () => {
        setState('INITIAL');
        setFiles([]);
        setResults([]);
        setProgress({ current: 0, total: 0, currentFile: '' });
        setError(null);
    };

    const canValidate = apiKey.trim() !== '' && files.length > 0;

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>📋 Revisor de LRCO</h1>
                <p>Validação Automatizada de Livros de Registro - Estágio Probatório</p>
            </header>

            {state === 'INITIAL' && (
                <>
                    <ApiKeyInput
                        onApiKeyChange={handleApiKeyChange}
                        isProcessing={false}
                    />

                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        isProcessing={false}
                    />

                    {error && (
                        <div className="card" style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderLeft: '4px solid var(--color-error)',
                            color: 'var(--color-error)'
                        }}>
                            <strong>❌ Erro:</strong> {error}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleValidation}
                            disabled={!canValidate}
                            style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
                        >
                            <PlayCircle size={24} />
                            Validar PDFs ({files.length})
                        </button>
                    </div>

                    {files.length > 0 && (
                        <div className="card" style={{ marginTop: '2rem', background: 'rgba(63, 165, 53, 0.1)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                ℹ️ Critérios de Validação
                            </h3>
                            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text)', lineHeight: '1.8' }}>
                                <li><strong>Registro de Avaliação:</strong> Deve citar Resoluções 3.037/2024 e 7.342/2024, mencionar progressão de ano (1º→2º ou 2º→3º)</li>
                                <li><strong>Objetivos de Conteúdo:</strong> Registros de encontros devem conter objetivos</li>
                                <li><strong>Frequências:</strong> Total deve ser número par entre 42 e 50, lançadas de 2 em 2</li>
                            </ul>
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
                                <strong>Decisões:</strong>
                                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                    <li>✅ <strong>Enviar para SERE:</strong> Todos os critérios atendidos</li>
                                    <li>⚠️ <strong>Enviar com ressalvas:</strong> 1 critério não atendido</li>
                                    <li>❌ <strong>Devolver para tutora:</strong> 2 ou mais critérios não atendidos</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}

            {state === 'PROCESSING' && (
                <ProgressIndicator
                    current={progress.current}
                    total={progress.total}
                    currentFile={progress.currentFile}
                />
            )}

            {state === 'RESULTS' && (
                <ValidationResults
                    results={results}
                    onReset={handleReset}
                />
            )}

            <footer style={{
                textAlign: 'center',
                marginTop: '3rem',
                padding: '2rem 0',
                color: 'white',
                opacity: 0.9
            }}>
                <p style={{ fontSize: '0.875rem' }}>
                    Desenvolvido com ❤️ usando Gemini 2.0 Flash API
                </p>
            </footer>
        </div>
    );
}

export default App;
