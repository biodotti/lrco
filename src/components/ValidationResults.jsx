import { CheckCircle, AlertTriangle, XCircle, Check, X } from 'lucide-react';

export default function ValidationResults({ results, onReset }) {
    const getDecisionConfig = (decision) => {
        switch (decision) {
            case 'ENVIAR_SERE':
                return {
                    label: 'Enviar para SERE',
                    icon: CheckCircle,
                    className: 'success'
                };
            case 'ENVIAR_RESSALVAS':
                return {
                    label: 'Enviar para SERE com ressalvas',
                    icon: AlertTriangle,
                    className: 'warning'
                };
            case 'DEVOLVER':
                return {
                    label: 'Devolver para tutora',
                    icon: XCircle,
                    className: 'error'
                };
            default:
                return {
                    label: 'Desconhecido',
                    icon: XCircle,
                    className: 'error'
                };
        }
    };

    const renderValidationIcon = (passed) => {
        return passed ? (
            <Check size={20} style={{ color: 'var(--color-success)' }} />
        ) : (
            <X size={20} style={{ color: 'var(--color-error)' }} />
        );
    };

    return (
        <div className="fade-in">
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'var(--color-primary)' }}>
                        ✅ Validação Concluída
                    </h2>
                    <button className="btn btn-secondary" onClick={onReset}>
                        Nova Validação
                    </button>
                </div>
                <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                    {results.length} {results.length === 1 ? 'PDF analisado' : 'PDFs analisados'}
                </p>
            </div>

            <div className="results-grid">
                {results.map((result, index) => {
                    const config = getDecisionConfig(result.decision);
                    const Icon = config.icon;

                    return (
                        <div key={index} className={`result-card ${config.className}`}>
                            <div className="result-header">
                                <div className="result-filename">{result.fileName}</div>
                                <div className={`result-badge ${config.className}`}>
                                    <Icon size={16} />
                                    {config.label}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    Critérios Validados:
                                </h3>

                                {/* Registro de Avaliação */}
                                <div className="validation-item">
                                    <div className="validation-title">
                                        {renderValidationIcon(result.validations.registroAvaliacao.passed)}
                                        Registro de Avaliação
                                    </div>
                                    <div className="validation-details">
                                        {result.validations.registroAvaliacao.details}
                                    </div>
                                </div>

                                {/* Objetivos de Conteúdo */}
                                <div className="validation-item">
                                    <div className="validation-title">
                                        {renderValidationIcon(result.validations.objetivosConteudo.passed)}
                                        Objetivos de Conteúdo
                                    </div>
                                    <div className="validation-details">
                                        {result.validations.objetivosConteudo.details}
                                    </div>
                                </div>

                                {/* Frequências */}
                                <div className="validation-item">
                                    <div className="validation-title">
                                        {renderValidationIcon(result.validations.frequencias.passed)}
                                        Frequências
                                    </div>
                                    <div className="validation-details">
                                        {result.validations.frequencias.details}
                                    </div>
                                </div>

                                {/* Ressalvas */}
                                {result.ressalvas && result.ressalvas.length > 0 && (
                                    <div className="ressalvas-section">
                                        <div className="ressalvas-title">⚠️ Ressalvas:</div>
                                        <ul className="ressalvas-list">
                                            {result.ressalvas.map((ressalva, i) => (
                                                <li key={i}>{ressalva}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
