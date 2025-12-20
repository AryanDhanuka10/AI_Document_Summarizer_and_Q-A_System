export interface Document {
    id: string;
    name: string;
    uploadedAt: string;
    size: number;
    pageCount?: number;
}

export interface Citation {
    documentId: string;
    documentName: string;
    page: number;
    text?: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
    timestamp: string;
}

export interface UploadResponse {
    success: boolean;
    document?: Document;
    error?: string;
}

export interface ChatResponse {
    message: string;
    citations?: Citation[];
}
