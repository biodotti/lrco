import { Loader2 } from 'lucide-react';

export default function ProgressIndicator({ current, total, currentFile }) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="card fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 className="spinner" size={24} />
                Processando PDFs...
            </h2>

            <div className="progress-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="progress-text">
                    {current} de {total} PDFs processados ({percentage}%)
                </p>
                {currentFile && (
                    <p style={{ textAlign: 'center', color: 'var(--color-text)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        📄 {currentFile}
                    </p>
                )}
            </div>

            <p style={{ textAlign: 'center', color: 'var(--color-text-light)', fontSize: '0.875rem', marginTop: '1rem' }}>
                Aguarde enquanto a IA analisa os documentos...
            </p>
        </div>
    );
}
