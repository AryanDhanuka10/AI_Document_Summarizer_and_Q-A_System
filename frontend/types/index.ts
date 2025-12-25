export interface Document {
    id: string;
    filename: string;
    sessionId: string;
    pageCount: number;
    uploadedAt: string;
    selected: boolean;
}

export interface Citation {
    source_file: string;
    page_number: number;
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
    filename: string;
    session_id: string;
    page_count: number;
}

export interface ChatRequest {
    session_id: string;
    question: string;
}

export interface ChatResponse {
    answer: string;
    citations?: Citation[];
    chunk_count?: number;
}

export interface SummaryResponse {
    summary: string;
    citations?: Citation[];
    document_count?: number;
}

