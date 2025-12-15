import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

export default function FileUploader({ onFilesSelected, isProcessing }) {
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    const validateFile = (file) => {
        if (file.type !== 'application/pdf') {
            return 'Apenas arquivos PDF são permitidos';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'Arquivo muito grande (máximo 50MB)';
        }
        return null;
    };

    const handleFiles = (newFiles) => {
        const fileArray = Array.from(newFiles);

        // Validar cada arquivo
        const validFiles = [];
        const errors = [];

        for (const file of fileArray) {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        }

        // Verificar limite de arquivos
        const totalFiles = files.length + validFiles.length;
        if (totalFiles > MAX_FILES) {
            alert(`Você pode enviar no máximo ${MAX_FILES} arquivos. Selecionados: ${totalFiles}`);
            return;
        }

        if (errors.length > 0) {
            alert('Alguns arquivos foram rejeitados:\n' + errors.join('\n'));
        }

        if (validFiles.length > 0) {
            const updatedFiles = [...files, ...validFiles];
            setFiles(updatedFiles);
            onFilesSelected(updatedFiles);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleFileInput = (e) => {
        handleFiles(e.target.files);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="card fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                📄 Upload de PDFs
            </h2>

            <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
            >
                <Upload className="upload-zone-icon" size={48} />
                <p className="upload-zone-text">
                    Arraste e solte os PDFs aqui ou clique para selecionar
                </p>
                <p className="upload-zone-hint">
                    Máximo de {MAX_FILES} arquivos • Até 50MB cada • Apenas PDF
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                    disabled={isProcessing}
                />
            </div>

            {files.length > 0 && (
                <div className="file-list">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                        Arquivos Selecionados ({files.length}/{MAX_FILES})
                    </h3>
                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            <div className="file-info">
                                <FileText className="file-icon" size={24} />
                                <div>
                                    <div className="file-name">{file.name}</div>
                                    <div className="file-size">{formatFileSize(file.size)}</div>
                                </div>
                            </div>
                            <button
                                className="file-remove"
                                onClick={() => removeFile(index)}
                                disabled={isProcessing}
                                title="Remover arquivo"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
