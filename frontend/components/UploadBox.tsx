'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { uploadMultipleDocuments } from '@/lib/api';
import { UploadResponse } from '@/types';

interface UploadBoxProps {
    onUploadSuccess: (data: UploadResponse[]) => void;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export default function UploadBox({ onUploadSuccess }: UploadBoxProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = (files: File[]): string | null => {
        if (files.length === 0) return 'No files selected';

        for (const file of files) {
            if (file.type !== 'application/pdf') {
                return `Invalid file type: ${file.name}. Only PDF files are allowed.`;
            }
            if (file.size > 50 * 1024 * 1024) {
                return `File too large: ${file.name}. Maximum size is 50MB.`;
            }
        }
        return null;
    };

    const handleUpload = useCallback(async (files: File[]) => {
        const validationError = validateFiles(files);
        if (validationError) {
            setErrorMessage(validationError);
            setUploadState('error');
            return;
        }

        setUploadState('uploading');
        setErrorMessage('');

        try {
            const results = await uploadMultipleDocuments(files);
            setUploadedFiles(results);
            setUploadState('success');
            onUploadSuccess(results);

            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Upload failed';
            setErrorMessage(errorMsg);
            setUploadState('error');

            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [onUploadSuccess]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) handleUpload(files);
    }, [handleUpload]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) handleUpload(files);
    }, [handleUpload]);

    const handleReset = () => {
        setUploadState('idle');
        setErrorMessage('');
        setUploadedFiles([]);
    };

    return (
        <div className="space-y-3">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all
          ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-700 bg-panel'}
          ${uploadState === 'uploading' ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary hover:bg-primary/5'}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileInput}
                    disabled={uploadState === 'uploading'}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center gap-2">
                    {uploadState === 'uploading' ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : (
                        <Upload className="w-8 h-8 text-text-secondary" />
                    )}

                    <div>
                        <p className="text-sm font-medium text-text-primary">
                            {uploadState === 'uploading' ? 'Uploading...' : 'Drop PDFs here or click to browse'}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                            Upload multiple PDFs at once • Max 50MB per file
                        </p>
                    </div>
                </div>
            </div>

            {/* Success State */}
            {uploadState === 'success' && uploadedFiles.length > 0 && (
                <div className="bg-success/10 border border-success/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-success mb-2">
                                Successfully uploaded {uploadedFiles.length} {uploadedFiles.length === 1 ? 'document' : 'documents'}
                            </p>
                            <div className="space-y-1">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-text-primary">
                                        <FileText className="w-4 h-4 text-success" />
                                        <span className="truncate">{file.filename}</span>
                                        <span className="text-xs text-text-secondary">
                                            ({file.page_count} {file.page_count === 1 ? 'page' : 'pages'})
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleReset}
                                className="text-xs text-success hover:text-green-400 font-medium mt-2"
                            >
                                Upload more documents
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {uploadState === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-400">Upload failed</p>
                            <p className="text-sm text-text-primary mt-1">{errorMessage}</p>

                            {errorMessage.includes('unreachable') && (
                                <div className="mt-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-text-primary">
                                            <p className="font-medium mb-1">Troubleshooting:</p>
                                            <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                                                <li>Ensure backend is running</li>
                                                <li>Check CORS is enabled on backend</li>
                                                <li>Verify API_BASE_URL in .env.local</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleReset}
                                className="text-xs text-red-400 hover:text-red-300 font-medium mt-2"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
