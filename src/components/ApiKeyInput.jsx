import { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

export default function ApiKeyInput({ onApiKeyChange, isProcessing }) {
    const [apiKey, setApiKey] = useState(() => {
        return sessionStorage.getItem('gemini_api_key') || '';
    });
    const [showKey, setShowKey] = useState(false);

    const handleChange = (e) => {
        const newKey = e.target.value;
        setApiKey(newKey);
        sessionStorage.setItem('gemini_api_key', newKey);
        onApiKeyChange(newKey);
    };

    const toggleShowKey = () => {
        setShowKey(!showKey);
    };

    return (
        <div className="card fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={24} />
                Chave API Gemini
            </h2>

            <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor="api-key">
                    Insira sua chave API do Google Gemini
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        id="api-key"
                        type={showKey ? 'text' : 'password'}
                        className="input-field"
                        value={apiKey}
                        onChange={handleChange}
                        placeholder="AIza..."
                        disabled={isProcessing}
                        style={{ paddingRight: '3rem' }}
                    />
                    <button
                        type="button"
                        onClick={toggleShowKey}
                        style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-light)',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title={showKey ? 'Ocultar chave' : 'Mostrar chave'}
                    >
                        {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                    Sua chave é armazenada apenas nesta sessão do navegador.{' '}
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                    >
                        Obter chave API
                    </a>
                </p>
            </div>
        </div>
    );
}
