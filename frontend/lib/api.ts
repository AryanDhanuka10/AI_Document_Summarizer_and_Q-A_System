/**
 * API Client for AI Document Summarizer Backend
 * 
 * CRITICAL: This implementation strictly follows the FastAPI backend contracts:
 * 1. Upload: POST /upload?session_id=<uuid> with FormData (files field only)
 * 2. Summarize: POST /summarize/upload?session_id=<uuid> with empty body
 * 3. Chat: POST /chat with JSON {session_id, question}
 */

import { UploadResponse, ChatResponse, SummaryResponse } from '@/types';
import { getSessionId } from './utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Upload multiple PDF documents
 * Backend expects: POST /upload?session_id=<uuid>
 * Content-Type: multipart/form-data
 * Body: files field with PDF files (NO session_id in FormData)
 */
export async function uploadMultipleDocuments(files: File[]): Promise<UploadResponse[]> {
    const sessionId = getSessionId();
    
    // Create FormData and append all files under 'files' field
    // CRITICAL: Do NOT append session_id to FormData - it goes in query parameter
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        // CRITICAL: session_id as query parameter, NOT in FormData
        const response = await fetch(`${API_BASE_URL}/upload?session_id=${sessionId}`, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        // Backend returns array of UploadResponse
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Backend unreachable. Please ensure the server is running.');
        }
        throw error;
    }
}

/**
 * Summarize uploaded documents
 * Backend expects: POST /summarize/upload?session_id=<uuid>
 * Body: empty (no JSON body required)
 */
export async function summarizeUploadedDocuments(): Promise<SummaryResponse> {
    const sessionId = getSessionId();

    try {
        const response = await fetch(`${API_BASE_URL}/summarize/upload?session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Empty body - backend uses session_id to find uploaded documents
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Summarization failed (${response.status}): ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Backend unreachable. Please ensure the server is running.');
        }
        throw error;
    }
}

/**
 * Ask a question about uploaded documents
 * Backend expects: POST /chat
 * Body: {session_id: string, question: string}
 */
export async function askQuestion(question: string): Promise<ChatResponse> {
    const sessionId = getSessionId();

    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                question: question,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Chat failed (${response.status}): ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Backend unreachable. Please ensure the server is running.');
        }
        throw error;
    }
}
